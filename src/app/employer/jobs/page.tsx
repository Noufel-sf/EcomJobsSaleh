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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal, Edit, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import EmployerSidebarLayout from "@/components/EmployerSidebarLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  useGetAllJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} from "@/Redux/Services/JobApi";

import { Job } from "@/lib/DatabaseTypes";

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  responsibilities: string;
  whoYouAre: string;
  niceToHaves: string;
  categories: string;
  requiredSkills: string;
  totalCapacity: string;
  applyBefore: string;
}

const initialFormData: JobFormData = {
  title: "",
  company: "",
  location: "",
  type: "Full-time",
  experience: "",
  salary: "",
  description: "",
  responsibilities: "",
  whoYouAre: "",
  niceToHaves: "",
  categories: "",
  requiredSkills: "",
  totalCapacity: "",
  applyBefore: "",
};

export default function EmployerJobs() {
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJob] = useDeleteJobMutation();

  const { data: jobsData, isLoading } = useGetAllJobsQuery(undefined);
  const jobs = jobsData?.content || [];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<JobFormData>(initialFormData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      const jobData = {
        ...formData,
        responsibilities: formData.responsibilities.split("\n").filter(Boolean),
        whoYouAre: formData.whoYouAre.split("\n").filter(Boolean),
        niceToHaves: formData.niceToHaves.split("\n").filter(Boolean),
        categories: formData.categories.split(",").map((c) => c.trim()).filter(Boolean),
        requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
        totalCapacity: parseInt(formData.totalCapacity) || 1,
        appliedCount: 0,
        jobPostedOn: new Date().toLocaleDateString(),
      };

      await createJob(jobData).unwrap();
      toast.success("Job created successfully");
      setOpenCreate(false);
      setFormData(initialFormData);
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to create job");
    }
  };

  const handleUpdate = async () => {
    if (!selectedJob) return;

    try {
      const jobData = {
        ...formData,
        responsibilities: formData.responsibilities.split("\n").filter(Boolean),
        whoYouAre: formData.whoYouAre.split("\n").filter(Boolean),
        niceToHaves: formData.niceToHaves.split("\n").filter(Boolean),
        categories: formData.categories.split(",").map((c) => c.trim()).filter(Boolean),
        requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
        totalCapacity: parseInt(formData.totalCapacity) || 1,
      };

      await updateJob({ id: selectedJob.id, jobData }).unwrap();
      toast.success("Job updated successfully");
      setOpenEdit(false);
      setSelectedJob(null);
      setFormData(initialFormData);
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to update job");
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      await deleteJob(jobId).unwrap();
      toast.success("Job deleted successfully");
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to delete job");
    }
  };

  const openEditDialog = (job: Job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary: job.salary,
      description: job.description,
      responsibilities: job.responsibilities.join("\n"),
      whoYouAre: job.whoYouAre.join("\n"),
      niceToHaves: job.niceToHaves?.join("\n") || "",
      categories: job.categories.join(", "),
      requiredSkills: job.requiredSkills.join(", "),
      totalCapacity: job.totalCapacity.toString(),
      applyBefore: job.applyBefore,
    });
    setOpenEdit(true);
  };

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "title",
      header: "Job Title",
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge className={""} variant="secondary">{row.getValue("type")}</Badge>
      ),
    },
    {
      accessorKey: "appliedCount",
      header: "Applications",
      cell: ({ row }) => {
        const applied = row.getValue("appliedCount") as number;
        const total = row.original.totalCapacity;
        return (
          <span className="text-sm">
            {applied}/{total}
          </span>
        );
      },
    },
    {
      accessorKey: "jobPostedOn",
      header: "Posted On",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const job = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="" align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => openEditDialog(job)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(job.id)}
                className="text-destructive cursor-pointer"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <EmployerSidebarLayout breadcrumbTitle="Jobs">
        <h1 className="text-2xl font-bold">Manage Jobs</h1>
        <p className="text-gray-700 dark:text-gray-400 mb-4">
          Create, view, and manage your job postings.
        </p>

        <div className="w-full">
            {/* Top Controls */}
            <div className="flex items-center justify-between py-4">
              <Input
                type="text"
                placeholder="Search by job title..."
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />

              <div className="flex items-center gap-3">
                <Button onClick={() => setOpenCreate(true)} variant="default">
                  Create Job
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
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
            </div>

            {/* Table */}
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
                                header.getContext()
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
                              cell.getContext()
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
                        No jobs found.
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
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
      </EmployerSidebarLayout>

      {/* Create/Edit Dialog */}
      <Dialog open={openCreate || openEdit} onOpenChange={(open: boolean) => {
        if (!open) {
          setOpenCreate(false);
          setOpenEdit(false);
          setFormData(initialFormData);
          setSelectedJob(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{openEdit ? "Edit Job" : "Create New Job"}</DialogTitle>
            <DialogDescription>
              {openEdit ? "Update job details" : "Fill in the job details"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Developer"
                />
              </div>
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g., Tech Corp"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York"
                />
              </div>
              <div>
                <Label htmlFor="type">Job Type *</Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experience">Experience *</Label>
                <Input
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 3-5 years"
                />
              </div>
              <div>
                <Label htmlFor="salary">Salary *</Label>
                <Input
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g., $75k-$85k USD"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalCapacity">Total Capacity *</Label>
                <Input
                  id="totalCapacity"
                  name="totalCapacity"
                  type="number"
                  value={formData.totalCapacity}
                  onChange={handleInputChange}
                  placeholder="e.g., 10"
                />
              </div>
              <div>
                <Label htmlFor="applyBefore">Apply Before *</Label>
                <Input
                  id="applyBefore"
                  name="applyBefore"
                  type="date"
                  value={formData.applyBefore}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Job description..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="responsibilities">Responsibilities (one per line) *</Label>
              <Textarea
                id="responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleInputChange}
                placeholder="Responsibility 1&#10;Responsibility 2"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="whoYouAre">Requirements (one per line) *</Label>
              <Textarea
                id="whoYouAre"
                name="whoYouAre"
                value={formData.whoYouAre}
                onChange={handleInputChange}
                placeholder="Requirement 1&#10;Requirement 2"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="niceToHaves">Nice-to-Haves (one per line)</Label>
              <Textarea
                id="niceToHaves"
                name="niceToHaves"
                value={formData.niceToHaves}
                onChange={handleInputChange}
                placeholder="Nice to have 1&#10;Nice to have 2"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="categories">Categories (comma-separated) *</Label>
              <Input
                id="categories"
                name="categories"
                value={formData.categories}
                onChange={handleInputChange}
                placeholder="e.g., Marketing, Design"
              />
            </div>

            <div>
              <Label htmlFor="requiredSkills">Required Skills (comma-separated) *</Label>
              <Input
                id="requiredSkills"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleInputChange}
                placeholder="e.g., React, Node.js, TypeScript"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenCreate(false);
                setOpenEdit(false);
                setFormData(initialFormData);
                setSelectedJob(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={openEdit ? handleUpdate : handleCreate}
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating
                ? "Saving..."
                : openEdit
                ? "Update Job"
                : "Create Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
