"use client";
"use no memo";

import { useState, useMemo, useCallback } from "react";
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable,
  useReactTable,
  type VisibilityState,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, ChevronDown, Eye } from "lucide-react";
import toast from "react-hot-toast";
import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import Link from "next/link";
import {
  useGetAllJobsQuery,
  useDeleteJobMutation,
} from "@/Redux/Services/JobApi";
import { Job } from "@/lib/DatabaseTypes";
import SuperAdminSidebarLayout from "@/components/SuperAdminSidebarLayout";
import { type Language, useI18n } from "@/context/I18nContext";

const superAdminJobsCopy: Record<Language, Record<string, string>> = {
  en: {
    pageTitle: "Jobs",
    pageDescription: "Manage all your website job listings.",
    deleted: "Job deleted successfully",
    deleteFailed: "Failed to delete job",
    toggled: "Job status toggled successfully",
    toggleFailed: "Failed to toggle job status",
    selectAll: "Select all",
    selectRow: "Select row",
    jobTitle: "Job Title",
    location: "Location",
    type: "Type",
    actions: "Actions",
    viewApps: "View Apps",
    openMenu: "Open menu",
    deactivate: "Deactivate",
    activate: "Activate",
    delete: "Delete",
    searchTitle: "Search by title...",
    columns: "Columns",
    noJobs: "No jobs found.",
    selectedRows: "{selected} of {total} row(s) selected.",
    previous: "Previous",
    next: "Next",
  },
  fr: {
    pageTitle: "Emplois",
    pageDescription: "Gerez toutes les offres d'emploi du site.",
    deleted: "Emploi supprime avec succes",
    deleteFailed: "Echec de suppression de l'emploi",
    toggled: "Statut de l'emploi mis a jour",
    toggleFailed: "Echec de mise a jour du statut",
    selectAll: "Tout selectionner",
    selectRow: "Selectionner la ligne",
    jobTitle: "Titre du poste",
    location: "Lieu",
    type: "Type",
    actions: "Actions",
    viewApps: "Voir candidatures",
    openMenu: "Ouvrir le menu",
    deactivate: "Desactiver",
    activate: "Activer",
    delete: "Supprimer",
    searchTitle: "Rechercher par titre...",
    columns: "Colonnes",
    noJobs: "Aucun emploi trouve.",
    selectedRows: "{selected} sur {total} ligne(s) selectionnee(s).",
    previous: "Precedent",
    next: "Suivant",
  },
  ar: {
    pageTitle: "الوظائف",
    pageDescription: "ادارة جميع اعلانات الوظائف في المنصة.",
    deleted: "تم حذف الوظيفة بنجاح",
    deleteFailed: "فشل حذف الوظيفة",
    toggled: "تم تغيير حالة الوظيفة بنجاح",
    toggleFailed: "فشل تغيير حالة الوظيفة",
    selectAll: "تحديد الكل",
    selectRow: "تحديد الصف",
    jobTitle: "عنوان الوظيفة",
    location: "الموقع",
    type: "النوع",
    actions: "الاجراءات",
    viewApps: "عرض الطلبات",
    openMenu: "فتح القائمة",
    deactivate: "تعطيل",
    activate: "تفعيل",
    delete: "حذف",
    searchTitle: "ابحث بالعنوان...",
    columns: "الاعمدة",
    noJobs: "لم يتم العثور على وظائف.",
    selectedRows: "تم تحديد {selected} من {total} صف.",
    previous: "السابق",
    next: "التالي",
  },
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

// const statusStyles: Record<string, string> = {
//   open: "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
//   closed: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
// };

const typeStyles: Record<string, string> = {
  "full-time":
    "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  "part-time":
    "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
  remote:
    "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  internship:
    "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SuperAdminJobs() {
  const { language, t } = useI18n();
  const copy = superAdminJobsCopy[language];
  const { data: jobsData, isLoading } = useGetAllJobsQuery();
  const [deleteJob] = useDeleteJobMutation();

  const jobs = jobsData?.content ?? [];
  
  const handleDelete = useCallback(
    async (jobId: string) => {
      try {
        await deleteJob(jobId).unwrap();
        toast.success(copy.deleted);
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || copy.deleteFailed);
      }
    },
    [copy.deleteFailed, copy.deleted, deleteJob],
  );
  
  const toggleActive = useCallback(
    async (jobId: string) => {
      try {
        await deleteJob(jobId).unwrap();
        toast.success(copy.toggled);
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || copy.toggleFailed);
      }
    },
    [copy.toggleFailed, copy.toggled, deleteJob],
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }: { table: TanstackTable<Job> }) => (
          <Checkbox
            className="cursor-pointer"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value: boolean | "indeterminate") =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label={copy.selectAll}
          />
        ),
        cell: ({ row }: { row: Row<Job> }) => (
          <Checkbox
            className="cursor-pointer"
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean | "indeterminate") => row.toggleSelected(!!value)}
            aria-label={copy.selectRow}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "title",
        header: copy.jobTitle,
        cell: ({ row }: { row: Row<Job> }) => (
          <div className="font-medium">{row.getValue("title")}</div>
        ),
      },
      {
        accessorKey: "location",
        header: copy.location,
        cell: ({ row }: { row: Row<Job> }) => (
          <div className="text-sm text-muted-foreground">
            {row.getValue("location")}
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: copy.type,
        cell: ({ row }: { row: Row<Job> }) => (
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${typeStyles[row.getValue("type") as string] || ""}`}
          >
            {row.getValue("type")}
          </span>
        ),
      },

      {
        id: "actions",
        header: copy.actions,
        enableHiding: false,
        cell: ({ row }: { row: Row<Job> }) => {
          const job = row.original as Job;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="cursor-pointer"
              >
                <Link href={`/employer/applications?jobId=${job.id}`}>
                  <Eye className="h-4 w-4 mr-1" />
                  {copy.viewApps}
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 cursor-pointer"
                  >
                    <span className="sr-only">{copy.openMenu}</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="">
                  <DropdownMenuLabel>{copy.actions}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      toggleActive(job.id);

                    }}
                  >
                    {(job as Job & { isActive?: boolean }).isActive
                      ? copy.deactivate
                      : copy.activate}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={() => handleDelete(job.id)}
                  >
                    {copy.delete}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [
      copy.actions,
      copy.activate,
      copy.deactivate,
      copy.delete,
      copy.jobTitle,
      copy.location,
      copy.openMenu,
      copy.selectAll,
      copy.selectRow,
      copy.type,
      copy.viewApps,
      handleDelete,
      toggleActive,
    ],
  );

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  return (
    <SuperAdminSidebarLayout breadcrumbTitle={copy.pageTitle}>
      <h1 className="text-2xl font-bold">{copy.pageTitle}</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        {copy.pageDescription}
      </p>

      <div className="w-full">
        <div className="flex items-center py-4 gap-3">
          {/* create job dialog */}

          {/* Search */}
          <Input
            placeholder={copy.searchTitle}
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("title")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />

          {/* Column toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="ml-auto cursor-pointer"
              >
                {copy.columns} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize cursor-pointer"
                    checked={col.getIsVisible()}
                    onCheckedChange={(value: boolean) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <AdminDataTableSkeleton />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {copy.noJobs}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {t(copy.selectedRows, {
              selected: table.getFilteredSelectedRowModel().rows.length,
              total: table.getFilteredRowModel().rows.length,
            })}
          </div>
          <div className="space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="cursor-pointer"
            >
              {copy.previous}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="cursor-pointer"
            >
              {copy.next}
            </Button>
          </div>
        </div>
      </div>
    </SuperAdminSidebarLayout>
  );
}
