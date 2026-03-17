"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
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
import { JobApplication } from "@/lib/DatabaseTypes";

// ─── Mock Data (fallback until backend is ready) ──────────────────────────────

const MOCK_APPLICATIONS: JobApplication[] = [
  {
    id: "a1",
    jobId: "1",
    jobTitle: "Frontend Developer",
    applicantName: "Yacine Benali",
    applicantEmail: "yacine@mail.com",
    applicantPhone: "+213 555 1234",
    coverLetter:
      "I am passionate about building great UIs with React and TypeScript. I have 3 years of experience working on e-commerce platforms.",
    status: "pending",
    appliedDate: "2025-02-01",
  },
  {
    id: "a2",
    jobId: "1",
    jobTitle: "Frontend Developer",
    applicantName: "Sara Boudiaf",
    applicantEmail: "sara@mail.com",
    applicantPhone: "+213 555 5678",
    coverLetter:
      "Frontend dev with a strong eye for design and 4 years of experience. Excited to contribute to your team.",
    status: "reviewing",
    appliedDate: "2025-02-03",
  },
  {
    id: "a3",
    jobId: "2",
    jobTitle: "Backend Engineer",
    applicantName: "Amine Cherif",
    applicantEmail: "amine@mail.com",
    applicantPhone: "+213 555 9012",
    coverLetter:
      "Experienced Node.js and Java backend engineer with strong API design skills.",
    status: "accepted",
    appliedDate: "2025-01-28",
  },
  {
    id: "a4",
    jobId: "2",
    jobTitle: "Backend Engineer",
    applicantName: "Farid Meziane",
    applicantEmail: "farid@mail.com",
    applicantPhone: "+213 555 3456",
    coverLetter: "5 years of experience building microservices at scale.",
    status: "rejected",
    appliedDate: "2025-01-30",
  },
  {
    id: "a5",
    jobId: "3",
    jobTitle: "UI/UX Designer",
    applicantName: "Lila Hamidi",
    applicantEmail: "lila@mail.com",
    applicantPhone: "+213 555 7890",
    coverLetter:
      "UX designer with a strong portfolio of mobile and web products.",
    status: "pending",
    appliedDate: "2025-02-05",
  },
] as JobApplication[];

// ─── Status Styles ────────────────────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  reviewing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  shortlisted: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  accepted: "bg-green-500/10 text-green-600 dark:text-green-400",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployerApplications() {
  const searchParams = useSearchParams();
  const preFilterJobId = searchParams.get("jobId") || "all";

  // API hooks with mock data fallback
  const { data: applicationsData, isLoading: isLoadingApplications } =
    useGetAllApplicationsQuery();
  const { data: jobsData } = useGetAllJobsQuery();

  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();
  const [deleteApplication] = useDeleteApplicationMutation();

  // Use API data or fallback to mock data
  const applications = applicationsData?.content || MOCK_APPLICATIONS;
  const jobs = jobsData?.content || [];

  const [selectedJobFilter, setSelectedJobFilter] = useState(preFilterJobId);
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Build jobs filter list
  const jobsFilterList = useMemo(
    () => [
      { id: "all", title: "All Jobs" },
      ...jobs.map((job) => ({ id: job.id, title: job.title })),
    ],
    [jobs],
  );

  const filteredData = useMemo(
    () =>
      selectedJobFilter === "all"
        ? applications
        : applications.filter((a) => a.jobId === selectedJobFilter),
    [applications, selectedJobFilter],
  );

  const handleStatusChange = useCallback(
    async (appId: string, newStatus: JobApplication["status"]) => {
      try {
        await updateApplicationStatus({
          id: appId,
          status: newStatus,
        }).unwrap();
        toast.success(`Application marked as ${newStatus}`);
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || "Failed to update status");
      }
    },
    [updateApplicationStatus],
  );

  const handleDelete = useCallback(
    async (appId: string) => {
      if (!confirm("Are you sure you want to delete this application?")) return;

      try {
        await deleteApplication(appId).unwrap();
        toast.success("Application deleted successfully");
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || "Failed to delete application");
      }
    },
    [deleteApplication],
  );

  const exportToCSV = useCallback(() => {
    if (!filteredData.length) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "ID",
      "Job Title",
      "Applicant Name",
      "Email",
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
        row.map((v) => (String(v).includes(",") ? `"${v}"` : v)).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `applications_${new Date().toISOString().split("T")[0]}.csv`;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Applications exported!");
  }, [filteredData]);

  const [sorting, setSorting] = useState<any[]>([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: () => <Checkbox className="cursor-pointer" />,
        cell: ({ row }: any) => (
          <Checkbox
            className="cursor-pointer"
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "applicantName",
        header: "Applicant",
        cell: ({ row }: any) => (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              {row
                .getValue("applicantName")
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{row.getValue("applicantName")}</div>
              <div className="text-xs text-muted-foreground">
                {row.original.applicantEmail}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "jobTitle",
        header: "Applied For",
        cell: ({ row }: any) => (
          <div className="flex items-center gap-1 text-sm">
            <Briefcase className="h-3 w-3 text-muted-foreground" />
            {row.getValue("jobTitle")}
          </div>
        ),
      },
      {
        accessorKey: "appliedDate",
        header: "Date",
        cell: ({ row }: any) => (
          <div className="text-sm text-muted-foreground">
            {row.getValue("appliedDate")}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: any) => {
          const app = row.original as JobApplication;
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
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
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
        cell: ({ row }: any) => {
          const app = row.original as JobApplication;
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
                View
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
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-green-600"
                    onClick={() => handleStatusChange(app.id, "accepted")}
                  >
                    Accept
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={() => handleStatusChange(app.id, "rejected")}
                  >
                    Reject
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={() => handleDelete(app.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [handleStatusChange, handleDelete],
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
      <h1 className="text-2xl font-bold">Applications</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        Review and manage all incoming applications.
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
                      onCheckedChange={(v) => col.toggleVisibility(!!v)}
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
          <DialogContent className="sm:max-w-[520px]">
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
                    <span>
                      Applied for:{" "}
                      <strong>{selectedApplication.jobTitle}</strong>
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
