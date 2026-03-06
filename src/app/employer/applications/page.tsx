"use client";

import { useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, MoreHorizontal, Trash, FileText, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import EmployerSidebarLayout from "@/components/EmployerSidebarLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useGetAllApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useDeleteApplicationMutation,
} from "@/Redux/Services/JobApi";

import { JobApplication } from "@/lib/DatabaseTypes";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  reviewing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  shortlisted: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  accepted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

export default function EmployerApplications() {
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();
  const [deleteApplication] = useDeleteApplicationMutation();

  const { data: applicationsData, isLoading } = useGetAllApplicationsQuery(undefined);
  const applications = applicationsData?.content || [];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleStatusChange = async (applicationId: string, newStatus: JobApplication["status"]) => {
    try {
      await updateApplicationStatus({ id: applicationId, status: newStatus }).unwrap();
      toast.success(`Application status updated to ${newStatus}`);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      await deleteApplication(applicationId).unwrap();
      toast.success("Application deleted successfully");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete application");
    }
  };

  const viewDetails = (application: JobApplication) => {
    setSelectedApplication(application);
    setDetailsOpen(true);
  };

  const columns: ColumnDef<JobApplication>[] = [
    {
      accessorKey: "applicantName",
      header: "Applicant Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("applicantName")}</div>
      ),
    },
    {
      accessorKey: "jobTitle",
      header: "Job Title",
    },
    {
      accessorKey: "applicantEmail",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue("applicantEmail")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as JobApplication["status"];
        return (
          <Badge className={statusColors[status]} variant="secondary">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "appliedDate",
      header: "Applied Date",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const application = row.original;

        return (
          <div className="flex gap-2">
            <Select
              value={application.status}
              onValueChange={(value: string) =>
                handleStatusChange(application.id, value as JobApplication["status"])
              }
            >
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="pending" className="cursor-pointer">Pending</SelectItem>
                <SelectItem value="reviewing" className="cursor-pointer">Reviewing</SelectItem>
                <SelectItem value="shortlisted" className="cursor-pointer">Shortlisted</SelectItem>
                <SelectItem value="accepted" className="cursor-pointer">Accepted</SelectItem>
                <SelectItem value="rejected" className="cursor-pointer">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="" align="end">
                <DropdownMenuLabel className="" inset={false}>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator className="" />
                <DropdownMenuItem
                  onClick={() => viewDetails(application)}
                  className="cursor-pointer"
                  inset={false}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(application.id)}
                  className="text-destructive cursor-pointer"
                  inset={false}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: applications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <EmployerSidebarLayout breadcrumbTitle="Applications">
        <h1 className="text-2xl font-bold">Manage Applications</h1>
        <p className="text-gray-700 dark:text-gray-400 mb-4">
          Review and manage job applications from candidates.
        </p>

        <div className="w-full">
            {/* Top Controls */}
            <div className="flex items-center justify-between py-4">
              <Input
                type="text"
                placeholder="Search by applicant name..."
                value={(table.getColumn("applicantName")?.getFilterValue() as string) ?? ""}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  table
                    .getColumn("applicantName")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="" size="default">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="" align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize cursor-pointer"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value: boolean) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table className="">
                <TableHeader className="">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="">
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="">
                  {isLoading ? (
                    <AdminDataTableSkeleton />
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className=""
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="">
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

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className=""
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className=""
              >
                Next
              </Button>
            </div>
          </div>
      </EmployerSidebarLayout>

      {/* Application Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="">
            <DialogTitle className="">Application Details</DialogTitle>
            <DialogDescription className="">
              Detailed information about the job application
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Applicant Name</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedApplication.applicantName}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Job Title</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedApplication.jobTitle}
                  </p>
                </div>
              </div>

              <Separator className="" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </h4>
                  <a
                    href={`mailto:${selectedApplication.applicantEmail}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {selectedApplication.applicantEmail}
                  </a>
                </div>
                {selectedApplication.applicantPhone && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </h4>
                    <a
                      href={`tel:${selectedApplication.applicantPhone}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {selectedApplication.applicantPhone}
                    </a>
                  </div>
                )}
              </div>

              <Separator className="" />

              <div>
                <h4 className="text-sm font-semibold mb-1">Status</h4>
                <Badge className={statusColors[selectedApplication.status]} variant="secondary">
                  {selectedApplication.status}
                </Badge>
              </div>

              <Separator className="" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Applied Date</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedApplication.appliedDate}
                  </p>
                </div>
                {selectedApplication.lastUpdated && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Last Updated</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedApplication.lastUpdated}
                    </p>
                  </div>
                )}
              </div>

              {selectedApplication.coverLetter && (
                <>
                  <Separator className="" />
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Cover Letter</h4>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm whitespace-pre-line">
                        {selectedApplication.coverLetter}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {selectedApplication.resume && (
                <>
                  <Separator className="" />
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Resume</h4>
                    <Button asChild variant="outline" size="sm" className="">
                      <a
                        href={selectedApplication.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Resume
                      </a>
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
