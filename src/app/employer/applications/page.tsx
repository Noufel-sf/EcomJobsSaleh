"use client";
"use no memo";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreHorizontal,
  ChevronDown,
  Download,
  Eye,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";
import EmployerSidebarLayout from "@/components/EmployerSidebarLayout";
import toast from "react-hot-toast";
import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import {
  useGetAllApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useDeleteApplicationMutation,
  useGetAllJobsQuery,
} from "@/Redux/Services/JobApi";
import { useAppSelector } from "@/Redux/hooks";
import { JobApplication } from "@/lib/DatabaseTypes";
import { type Language, useI18n } from "@/context/I18nContext";

type ApplicationRow = JobApplication & {
  jobId: string;
  jobTitle: string;
};

// ─── Status Styles ────────────────────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  reviewing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  shortlisted: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  accepted: "bg-green-500/10 text-green-600 dark:text-green-400",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const applicationsCopy: Record<Language, Record<string, string>> = {
  en: {
    title: "Applications",
    subtitle: "Review and manage all incoming applications.",
    allJobs: "All Jobs",
    updated: "Application marked as {status}",
    updateFailed: "Failed to update status",
    deleteConfirm: "Are you sure you want to delete this application?",
    deleted: "Application deleted successfully",
    deleteFailed: "Failed to delete application",
    noData: "No data to export",
    exported: "Applications exported!",
    applicant: "Applicant",
    appliedFor: "Applied For",
    date: "Date",
    contact: "Contact",
    status: "Status",
    changeStatus: "Change Status",
    view: "View",
    actions: "Actions",
    accept: "Accept",
    reject: "Reject",
    delete: "Delete",
  },
  fr: {
    title: "Candidatures",
    subtitle: "Examinez et gerez toutes les candidatures recues.",
    allJobs: "Toutes les offres",
    updated: "Candidature marquee comme {status}",
    updateFailed: "Echec de mise a jour du statut",
    deleteConfirm: "Voulez-vous vraiment supprimer cette candidature ?",
    deleted: "Candidature supprimee",
    deleteFailed: "Echec de suppression",
    noData: "Aucune donnee a exporter",
    exported: "Candidatures exportees !",
    applicant: "Candidat",
    appliedFor: "Poste",
    date: "Date",
    contact: "Contact",
    status: "Statut",
    changeStatus: "Changer le statut",
    view: "Voir",
    actions: "Actions",
    accept: "Accepter",
    reject: "Refuser",
    delete: "Supprimer",
  },
  ar: {
    title: "طلبات التوظيف",
    subtitle: "مراجعة وادارة جميع الطلبات الواردة.",
    allJobs: "كل الوظائف",
    updated: "تم تغيير الحالة الى {status}",
    updateFailed: "فشل تحديث الحالة",
    deleteConfirm: "هل تريد حذف طلب التوظيف هذا؟",
    deleted: "تم حذف الطلب بنجاح",
    deleteFailed: "فشل حذف الطلب",
    noData: "لا توجد بيانات للتصدير",
    exported: "تم تصدير الطلبات!",
    applicant: "المتقدم",
    appliedFor: "الوظيفة",
    date: "التاريخ",
    contact: "التواصل",
    status: "الحالة",
    changeStatus: "تغيير الحالة",
    view: "عرض",
    actions: "الاجراءات",
    accept: "قبول",
    reject: "رفض",
    delete: "حذف",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployerApplications() {
  const { language, t } = useI18n();
  const copy = applicationsCopy[language];
  const user = useAppSelector((state) => state.auth.user);
  const searchParams = useSearchParams();
  const preFilterJobId = searchParams.get("jobId") || "all";
  const companyId = user?.userId ?? "";

  const { data: applicationsData, isLoading: isLoadingApplications } =
    useGetAllApplicationsQuery(companyId, { skip: !companyId });
  const { data: jobsData } = useGetAllJobsQuery();

  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();
  const [deleteApplication] = useDeleteApplicationMutation();

  const jobs = useMemo(() => jobsData?.content ?? [], [jobsData]);

  const applications = useMemo<ApplicationRow[]>(() => {
    const rawApplications = applicationsData?.content ?? [];
    const jobTitleById = new Map(jobs.map((job) => [job.id, job.title]));

    return rawApplications.map((application) => {
      const jobRef = application.jobApplicationJob || application.jobId || "";

      return {
        ...application,
        jobApplicationJob: jobRef,
        jobId: jobRef,
        jobTitle:
          application.jobTitle || jobTitleById.get(jobRef) || "Unknown Job",
        appliedDate: application.appliedDate || application.lastUpdated || "",
      };
    });
  }, [applicationsData, jobs]);

  const [selectedJobFilter, setSelectedJobFilter] = useState(preFilterJobId);
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationRow | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    setSelectedJobFilter(preFilterJobId);
  }, [preFilterJobId]);

  // Build jobs filter list
  const jobsFilterList = useMemo(
    () => [
      { id: "all", title: copy.allJobs },
      ...jobs.map((job) => ({ id: job.id, title: job.title })),
    ],
    [copy.allJobs, jobs],
  );

  const filteredData = useMemo(
    () =>
      selectedJobFilter === "all"
        ? applications
        : applications.filter((a) => a.jobApplicationJob === selectedJobFilter),
    [applications, selectedJobFilter],
  );

  const handleStatusChange = useCallback(
    async (appId: string, newStatus: JobApplication["status"]) => {
      try {
        await updateApplicationStatus({
          id: appId,
          status: newStatus,
        }).unwrap();
        toast.success(t(copy.updated, { status: newStatus }));
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || copy.updateFailed);
      }
    },
    [copy.updateFailed, copy.updated, t, updateApplicationStatus],
  );

  const handleDelete = useCallback(
    async (appId: string) => {
      if (!confirm(copy.deleteConfirm)) return;

      try {
        await deleteApplication(appId).unwrap();
        toast.success(copy.deleted);
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || copy.deleteFailed);
      }
    },
    [copy.deleteConfirm, copy.deleteFailed, copy.deleted, deleteApplication],
  );

  const exportToCSV = useCallback(() => {
    if (!filteredData.length) {
      toast.error(copy.noData);
      return;
    }

    const headers = [
      "ID",
      "Job Title",
      "Applicant Name",
      "Phone",
      "Status",
      "Applied At",
    ];
    const rows = filteredData.map((a) => [
      a.id,
      a.jobTitle,
      a.applicantName,
      a.applicantEmail,
      a.applicantPhone,
      a.status,
      a.appliedDate,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((v: string | undefined) =>
            String(v).includes(",") ? `"${v}"` : (v ?? ""),
          )
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = `applications_${new Date().toISOString().split("T")[0]}.csv`;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
    toast.success(copy.exported);
  }, [copy.exported, copy.noData, filteredData]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }: { table: TanstackTable<ApplicationRow> }) => (
          <Checkbox
            className="cursor-pointer"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(v: boolean | "indeterminate") =>
              table.toggleAllPageRowsSelected(!!v)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }: { row: Row<ApplicationRow> }) => (
          <Checkbox
            className="cursor-pointer"
            checked={row.getIsSelected()}
            onCheckedChange={(v: boolean | "indeterminate") =>
              row.toggleSelected(!!v)
            }
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "applicantName",
        header: copy.applicant,
        cell: ({ row }: { row: Row<ApplicationRow> }) => {
          const applicantName = String(row.getValue("applicantName") || "");

          return (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                {applicantName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{applicantName}</div>
                <div className="text-xs text-muted-foreground">
                  {row.original.applicantEmail}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "jobTitle",
        header: copy.appliedFor,
        cell: ({ row }: { row: Row<ApplicationRow> }) => (
          <div className="flex items-center gap-1 text-sm">
            <Briefcase className="h-3 w-3 text-muted-foreground" />
            {row.getValue("jobTitle")}
          </div>
        ),
      },
      {
        accessorKey: "appliedDate",
        header: copy.date,
        cell: ({ row }: { row: Row<ApplicationRow> }) => (
          <div className="text-sm text-muted-foreground">
            {row.getValue("appliedDate")}
          </div>
        ),
      },
      {
        accessorKey: "applicantPhone",
        header: copy.contact,
        cell: ({ row }: { row: Row<ApplicationRow> }) => (
          <div className="flex items-center gap-1 text-sm">
            <Phone className="h-3 w-3 text-muted-foreground" />
            {row.getValue("applicantPhone") || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: copy.status,
        cell: ({ row }: { row: Row<ApplicationRow> }) => {
          const app = row.original as ApplicationRow;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 cursor-pointer"
                >
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[app.status]}`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="">
                <DropdownMenuLabel>{copy.changeStatus}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(
                  [
                    "pending",
                    "reviewing",
                    "shortlisted",
                    "accepted",
                    "rejected",
                  ] as const
                ).map((s) => (
                  <DropdownMenuItem
                    key={s}
                    className="cursor-pointer capitalize"
                    onClick={() => handleStatusChange(app.id, s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }: { row: Row<ApplicationRow> }) => {
          const app = row.original as ApplicationRow;
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={() => {
                  setSelectedApplication(app);
                  setDetailsOpen(true);
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                {copy.view}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 cursor-pointer"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="">
                  <DropdownMenuLabel>{copy.actions}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-green-600"
                    onClick={() => handleStatusChange(app.id, "accepted")}
                  >
                    {copy.accept}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={() => handleStatusChange(app.id, "rejected")}
                  >
                    {copy.reject}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={() => handleDelete(app.id)}
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
    [copy.accept, copy.actions, copy.applicant, copy.appliedFor, copy.changeStatus, copy.contact, copy.date, copy.delete, copy.reject, copy.status, copy.view, handleDelete, handleStatusChange],
  );

  const table = useReactTable({
    data: filteredData,
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
    <EmployerSidebarLayout breadcrumbTitle="Applications">
      <h1 className="text-2xl font-bold">{copy.title}</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        {copy.subtitle}
      </p>

      <div className="w-full">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between py-4 gap-3">
          <div className="flex items-center gap-3">
            {/* Filter by Job */}
            <Select
              value={selectedJobFilter}
              onValueChange={setSelectedJobFilter}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Job" />
              </SelectTrigger>
              <SelectContent className="">
                {jobsFilterList.map((job) => (
                  <SelectItem
                    key={job.id}
                    value={job.id}
                    className="cursor-pointer"
                  >
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search */}
            <Input
              placeholder="Search by applicant name..."
              value={
                (table
                  .getColumn("applicantName")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn("applicantName")?.setFilterValue(e.target.value)
              }
              className="max-w-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="default"
              onClick={exportToCSV}
              className="cursor-pointer"
            >
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  className="cursor-pointer"
                >
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                      onCheckedChange={(v: boolean) =>
                        col.toggleVisibility(!!v)
                      }
                    >
                      {col.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
              {isLoadingApplications ? (
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
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Application Details Modal */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-130">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Full details for this application.
              </DialogDescription>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-4 pt-2">
                {/* Applicant Info */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {selectedApplication.applicantName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      {selectedApplication.applicantName}
                    </div>
                    <div
                      className={`text-xs px-2 py-0.5 rounded-full inline-block font-medium mt-1 ${statusStyles[selectedApplication.status]}`}
                    >
                      {selectedApplication.status.charAt(0).toUpperCase() +
                        selectedApplication.status.slice(1)}
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedApplication.applicantEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedApplication.applicantPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium ">
                      Applied for:{" "}
                      <strong className="text-primary">{selectedApplication.jobTitle}</strong>
                    </span>
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <div className="text-sm font-semibold mb-1">Cover Letter</div>
                  <p className="text-sm text-muted-foreground bg-muted/40 p-3 rounded-lg leading-relaxed">
                    {selectedApplication.coverLetter}
                  </p>
                </div>

                {/* Applied at */}
                <div className="text-xs text-muted-foreground">
                  Applied on: {selectedApplication.appliedDate}
                </div>

                {/* Quick actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      handleStatusChange(selectedApplication.id, "accepted");
                      setDetailsOpen(false);
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      handleStatusChange(selectedApplication.id, "rejected");
                      setDetailsOpen(false);
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="cursor-pointer"
            >
              Previous
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </EmployerSidebarLayout>
  );
}
