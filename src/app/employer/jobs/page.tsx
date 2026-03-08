"use client";

import { useState, useMemo, useCallback } from "react";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, ChevronDown, Eye } from "lucide-react";
import EmployerSidebarLayout from "@/components/EmployerSidebarLayout";
import toast from "react-hot-toast";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import Link from "next/link";
import {
  useGetAllJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} from "@/Redux/Services/JobApi";
import { Job } from "@/lib/DatabaseTypes";

// ─── Mock Data (fallback until backend is ready) ──────────────────────────────

const MOCK_JOBS: Job[] = [
  { 
    id: "1", 
    title: "Frontend Developer", 
    company: "TechCo",
    companyLogo: "",
    location: "Remote", 
    type: "full-time", 
    experience: "3-5 years",
    salary: "$80,000 - $120,000",
    description: "Build awesome UIs with React and TypeScript.", 
    responsibilities: ["Lead frontend development", "Code reviews", "Mentor junior developers"],
    whoYouAre: ["Experienced with React", "Strong TypeScript skills"],
    niceToHaves: ["Next.js experience", "UI/UX design skills"],
    categories: ["Engineering", "Frontend"],
    requiredSkills: ["React", "TypeScript", "CSS"],
    appliedCount: 14,
    totalCapacity: 20,
    applyBefore: "2025-03-30",
    jobPostedOn: "2025-01-10",
  },
  { 
    id: "2", 
    title: "Backend Engineer", 
    company: "StartupCo",
    companyLogo: "",
    location: "Algiers", 
    type: "full-time", 
    experience: "3-5 years",
    salary: "$70,000 - $100,000",
    description: "Build scalable APIs with Node.js and PostgreSQL.", 
    responsibilities: ["Design and build backend services", "Database optimization", "API development"],
    whoYouAre: ["Strong Node.js developer", "Database expert"],
    niceToHaves: ["Docker experience", "AWS knowledge"],
    categories: ["Engineering", "Backend"],
    requiredSkills: ["Node.js", "PostgreSQL", "REST APIs"],
    appliedCount: 9,
    totalCapacity: 15,
    applyBefore: "2025-04-15",
    jobPostedOn: "2025-01-15",
  },
  { 
    id: "3", 
    title: "UI/UX Designer", 
    company: "DesignCo",
    companyLogo: "",
    location: "Remote", 
    type: "part-time", 
    experience: "2-4 years",
    salary: "$50,000 - $70,000",
    description: "Design beautiful interfaces for web and mobile.", 
    responsibilities: ["Create user-centered designs", "Conduct user research", "Prototype interfaces"],
    whoYouAre: ["Creative designer", "User-focused"],
    niceToHaves: ["Figma expert", "Animation skills"],
    categories: ["Design", "UX"],
    requiredSkills: ["Figma", "UI Design", "User Research"],
    appliedCount: 22,
    totalCapacity: 25,
    applyBefore: "2025-02-28",
    jobPostedOn: "2024-12-01",
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  open: "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  closed: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
};

const typeStyles: Record<string, string> = {
  "full-time": "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  "part-time": "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
  "remote": "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  "internship": "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployerJobs() {
  // API hooks with mock data fallback
  const { data: jobsData, isLoading } = useGetAllJobsQuery();
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJob] = useDeleteJobMutation();

  // Use API data or fallback to mock data
  const jobs = jobsData?.content || MOCK_JOBS;

  const [open, setOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<Job["type"]>("full-time");

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setLocation("");
    setType("full-time");
  }, []);

  const handleCreate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJob({ 
        title, 
        description, 
        location, 
        type, 
        status: "open",
        salary: "",
        requirements: "",
        responsibilities: "",
        benefits: "",
        company: { name: "Company", logo: "" }
      }).unwrap();
      toast.success("Job created successfully");
      setOpen(false);
      resetForm();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create job");
    }
  }, [title, description, location, type, createJob, resetForm]);

  const handleUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    try {
      await updateJob({ 
        id: selectedJob.id, 
        jobData: { title, description, location, type }
      }).unwrap();
      toast.success("Job updated successfully");
      setEditSheetOpen(false);
      setSelectedJob(null);
      resetForm();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update job");
    }
  }, [selectedJob, title, description, location, type, updateJob, resetForm]);

  const handleDelete = useCallback(async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      await deleteJob(jobId).unwrap();
      toast.success("Job deleted successfully");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete job");
    }
  }, [deleteJob]);

  // Note: Status toggle removed - Job interface doesn't include status field
  // Can be re-added when backend supports job status management

  const [sorting, setSorting] = useState<any[]>([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(() => [
    {
      id: "select",
      header: () => <Checkbox className="cursor-pointer" aria-label="Select all" />,
      cell: ({ row }: any) => (
        <Checkbox
          className="cursor-pointer"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Job Title",
      cell: ({ row }: any) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }: any) => <div className="text-sm text-muted-foreground">{row.getValue("location")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: any) => (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeStyles[row.getValue("type")] || ""}`}>
          {row.getValue("type")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[row.getValue("status")] || ""}`}>
          {row.getValue("status")}
        </span>
      ),
    },
    {
      accessorKey: "applicationsCount",
      header: "Applications",
      cell: ({ row }: any) => (
        <div className="font-semibold text-center">{row.getValue("applicationsCount") ?? 0}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Posted",
      cell: ({ row }: any) => (
        <div className="text-sm text-muted-foreground">{row.getValue("createdAt")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: any) => {
        const job = row.original as Job;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="cursor-pointer">
              <Link href={`/employer/applications?jobId=${job.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View Apps
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedJob(job);
                    setTitle(job.title);
                    setDescription(job.description);
                    setLocation(job.location);
                    setType(job.type);
                    setEditSheetOpen(true);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600"
                  onClick={() => handleDelete(job.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ], [handleDelete]);

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

  const JobFormFields = useMemo(() => (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <Label htmlFor="job-title">Job Title</Label>
        <Input id="job-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Developer" required />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="job-description">Description</Label>
        <Textarea id="job-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the role..." rows={4} required />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="job-location">Location</Label>
        <Input id="job-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Remote, Algiers..." required />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="job-type">Job Type</Label>
        <select
          id="job-type"
          value={type}
          onChange={(e) => setType(e.target.value as Job["type"])}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="remote">Remote</option>
          <option value="internship">Internship</option>
        </select>
      </div>
    </div>
  ), [title, description, location, type]);

  return (
    <EmployerSidebarLayout breadcrumbTitle="Jobs">
      <h1 className="text-2xl font-bold">Jobs</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        Manage all your job listings.
      </p>

      <div className="w-full">
        <div className="flex items-center py-4 gap-3">
          {/* Create Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" size="lg">Post a New Job</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Post a New Job</DialogTitle>
                  <DialogDescription className="mb-3">
                    Fill in the details below. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                {JobFormFields}
                <DialogFooter className="mt-5">
                  <DialogClose asChild>
                    <Button variant="outline" size="lg">Cancel</Button>
                  </DialogClose>
                  {isCreating ? (
                    <ButtonLoading />
                  ) : (
                    <Button type="submit" variant="primary" size="lg">Post Job</Button>
                  )}
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Search */}
          <Input
            placeholder="Search by title..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
            className="max-w-sm"
          />

          {/* Column toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="ml-auto cursor-pointer">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="">
              {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="capitalize cursor-pointer"
                  checked={col.getIsVisible()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Edit Sheet */}
        <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
          <SheetContent className="">
            <form onSubmit={handleUpdate}>
              <SheetHeader className="">
                <SheetTitle className="">Edit Job</SheetTitle>
                <SheetDescription className="">Update the job details. Click save when done.</SheetDescription>
              </SheetHeader>
              <div className="px-6 py-4">
                {JobFormFields}
              </div>
              <SheetFooter className="space-y-2">
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
                {isUpdating ? (
                  <ButtonLoading />
                ) : (
                  <Button type="submit" size="lg" variant="primary">Save Changes</Button>
                )}
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No jobs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button variant="primary" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="cursor-pointer">
              Previous
            </Button>
            <Button variant="primary" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="cursor-pointer">
              Next
            </Button>
          </div>
        </div>
      </div>
    </EmployerSidebarLayout>
  );
}