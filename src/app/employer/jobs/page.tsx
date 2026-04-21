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
import EmployerSidebarLayout from "@/components/EmployerSidebarLayout";
import toast from "react-hot-toast";
import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import Link from "next/link";
import { useAppSelector } from "@/Redux/hooks";
import {
  useGetJobsbyEmployerIdQuery,
  useDeleteJobMutation,
} from "@/Redux/Services/JobApi";
import { Job } from "@/lib/DatabaseTypes";
import CreateJobDialog from "@/components/CreateJobDialog";
import UpdateJobSheet from "@/components/UpdateJobSheet";
import { type Language, useI18n } from "@/context/I18nContext";

const jobsCopy: Record<Language, Record<string, string>> = {
  en: {
    title: "Jobs",
    subtitle: "Manage all your job listings.",
    search: "Search by title...",
    columns: "Columns",
    noJobs: "No jobs found.",
    selectedRows: "{selected} of {total} row(s) selected.",
    previous: "Previous",
    next: "Next",
    jobDeleted: "Job deleted successfully",
    deleteFailed: "Failed to delete job",
    jobTitle: "Job Title",
    location: "Location",
    type: "Type",
    actions: "Actions",
    viewApps: "View Apps",
    openMenu: "Open menu",
    edit: "Edit",
    delete: "Delete",
  },
  fr: {
    title: "Offres",
    subtitle: "Gerez toutes vos offres d'emploi.",
    search: "Rechercher par titre...",
    columns: "Colonnes",
    noJobs: "Aucune offre trouvee.",
    selectedRows: "{selected} sur {total} ligne(s) selectionnee(s).",
    previous: "Precedent",
    next: "Suivant",
    jobDeleted: "Offre supprimee",
    deleteFailed: "Echec de suppression",
    jobTitle: "Poste",
    location: "Localisation",
    type: "Type",
    actions: "Actions",
    viewApps: "Voir candidatures",
    openMenu: "Ouvrir menu",
    edit: "Modifier",
    delete: "Supprimer",
  },
  ar: {
    title: "الوظائف",
    subtitle: "ادارة جميع الوظائف المنشورة.",
    search: "ابحث بعنوان الوظيفة...",
    columns: "الاعمدة",
    noJobs: "لا توجد وظائف.",
    selectedRows: "تم تحديد {selected} من {total} صف.",
    previous: "السابق",
    next: "التالي",
    jobDeleted: "تم حذف الوظيفة بنجاح",
    deleteFailed: "فشل حذف الوظيفة",
    jobTitle: "المسمى الوظيفي",
    location: "الموقع",
    type: "النوع",
    actions: "الاجراءات",
    viewApps: "عرض الطلبات",
    openMenu: "فتح القائمة",
    edit: "تعديل",
    delete: "حذف",
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

export default function EmployerJobs() {
  const { language, t } = useI18n();
  const copy = jobsCopy[language];
  const user = useAppSelector((state) => state.auth.user);
  const companyId = user?.userId ?? "";
  console.log("the user id " ,user?.userId);
  

  const { data: jobsData, isLoading } = useGetJobsbyEmployerIdQuery({ id: companyId });
  const [deleteJob] = useDeleteJobMutation();
  
  const jobs = useMemo(() => {
    const allJobs = jobsData?.content ?? [];
    if (!companyId) return [];

    return allJobs.filter((job) => String(job.company) === String(companyId));
  }, [jobsData, companyId]);

  const [open, setOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleDelete = useCallback(
    async (jobId: string) => {
      try {
        await deleteJob(jobId).unwrap();
        toast.success(copy.jobDeleted);
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || copy.deleteFailed);
      }
    },
    [copy.deleteFailed, copy.jobDeleted, deleteJob],
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
            aria-label="Select all"
          />
        ),
        cell: ({ row }: { row: Row<Job> }) => (
          <Checkbox
            className="cursor-pointer"
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean | "indeterminate") => row.toggleSelected(!!value)}
            aria-label="Select row"
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
                      setSelectedJob(job);
                      setEditSheetOpen(true);
                    }}
                  >
                    {copy.edit}
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
    [copy.actions, copy.delete, copy.edit, copy.jobTitle, copy.location, copy.openMenu, copy.type, copy.viewApps, handleDelete],
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
    <EmployerSidebarLayout breadcrumbTitle="Jobs">
      <h1 className="text-2xl font-bold">{copy.title}</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        {copy.subtitle}
      </p>

      <div className="w-full">
        <div className="flex items-center py-4 gap-3">
          {/* create job dialog */}
          <CreateJobDialog
            open={open}
            onOpenChange={setOpen}
            defaultCompanyId={companyId}
          />

          {/* Search */}
          <Input
            placeholder={copy.search}
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
                    onCheckedChange={(value: boolean | "indeterminate") => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <UpdateJobSheet
          key={selectedJob?.id ?? "no-selected-job"}
          open={editSheetOpen}
          onOpenChange={(nextOpen: boolean) => {
            setEditSheetOpen(nextOpen);
            if (!nextOpen) {
              setSelectedJob(null);
            }
          }}
          job={selectedJob}
        />

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
    </EmployerSidebarLayout>
  );
}
