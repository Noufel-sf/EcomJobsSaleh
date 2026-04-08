"use client";
"use no memo";

import { useCallback, useMemo, useState } from "react";
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { CheckCircle2, ChevronDown, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import SuperAdminSidebarLayout from "@/components/SuperAdminSidebarLayout";
import {
  useGetNotAvailableJobsQuery,
  useUpdateJobStatusMutation,
} from "@/Redux/Services/JobApi";
import { type Language, useI18n } from "@/context/I18nContext";
import { Job } from "@/lib/DatabaseTypes";

const notActiveJobsCopy: Record<Language, Record<string, string>> = {
  en: {
    pageTitle: "Not Active Jobs",
    pageDescription: "Review jobs that are currently not available.",
    patched: "Job status updated successfully",
    patchFailed: "Failed to update job status",
    selectAll: "Select all",
    selectRow: "Select row",
    jobTitle: "Job Title",
    location: "Location",
    type: "Type",
    actions: "Actions",
    viewApps: "View Apps",
    activate: "Activate",
    openMenu: "Open menu",
    searchTitle: "Search by title...",
    columns: "Columns",
    noJobs: "No not-active jobs found.",
    selectedRows: "{selected} of {total} row(s) selected.",
    previous: "Previous",
    next: "Next",
  },
  fr: {
    pageTitle: "Emplois non actifs",
    pageDescription: "Consultez les emplois actuellement indisponibles.",
    patched: "Statut de l'emploi mis a jour",
    patchFailed: "Echec de mise a jour du statut",
    selectAll: "Tout selectionner",
    selectRow: "Selectionner la ligne",
    jobTitle: "Titre du poste",
    location: "Lieu",
    type: "Type",
    actions: "Actions",
    viewApps: "Voir candidatures",
    activate: "Activer",
    openMenu: "Ouvrir le menu",
    searchTitle: "Rechercher par titre...",
    columns: "Colonnes",
    noJobs: "Aucun emploi non actif trouve.",
    selectedRows: "{selected} sur {total} ligne(s) selectionnee(s).",
    previous: "Precedent",
    next: "Suivant",
  },
  ar: {
    pageTitle: "الوظائف غير النشطة",
    pageDescription: "مراجعة الوظائف غير المتاحة حاليا.",
    patched: "تم تحديث حالة الوظيفة بنجاح",
    patchFailed: "فشل تحديث حالة الوظيفة",
    selectAll: "تحديد الكل",
    selectRow: "تحديد الصف",
    jobTitle: "عنوان الوظيفة",
    location: "الموقع",
    type: "النوع",
    actions: "الاجراءات",
    viewApps: "عرض الطلبات",
    activate: "تفعيل",
    openMenu: "فتح القائمة",
    searchTitle: "ابحث بالعنوان...",
    columns: "الاعمدة",
    noJobs: "لا توجد وظائف غير نشطة.",
    selectedRows: "تم تحديد {selected} من {total} صف.",
    previous: "السابق",
    next: "التالي",
  },
};

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

export default function SuperAdminNotActiveJobs() {
  const { language, t } = useI18n();
  const copy = notActiveJobsCopy[language];

  const { data: jobsData, isLoading } = useGetNotAvailableJobsQuery();
  const [updateJobStatus] = useUpdateJobStatusMutation();

  const jobs = jobsData?.content ?? [];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const handleActivate = useCallback(
    async (jobId: string) => {
      try {
        await updateJobStatus({ jobID: jobId, status: true }).unwrap();
        toast.success(copy.patched);
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || copy.patchFailed);
      }
    },
    [copy.patchFailed, copy.patched, updateJobStatus],
  );

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
            onCheckedChange={(value: boolean | "indeterminate") =>
              row.toggleSelected(!!value)
            }
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
                    onClick={() => handleActivate(job.id)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {copy.activate}
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
      copy.jobTitle,
      copy.location,
      copy.openMenu,
      copy.selectAll,
      copy.selectRow,
      copy.type,
      copy.viewApps,
      handleActivate,
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
          <Input
            placeholder={copy.searchTitle}
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("title")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />

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
                    onCheckedChange={(value: boolean) =>
                      col.toggleVisibility(!!value)
                    }
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
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
