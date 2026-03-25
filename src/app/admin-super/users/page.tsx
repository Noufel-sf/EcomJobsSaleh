"use client";
import { useState, useEffect } from "react";
import React from "react";
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ChevronDown, ExternalLink, ShieldOff, Trash2 } from "lucide-react";
import SuperAdminSidebarLayout from "@/components/SuperAdminSidebarLayout";
import toast from "react-hot-toast";
import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = "employer" | "seller";
type UserStatus = "active" | "suspended";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  avatar: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_USERS: User[] = [
  { id: "1",  name: "Ahmed Benali",     email: "ahmed.benali@email.com",     phone: "+213 555 123 456", role: "employer", status: "active",    createdAt: "2024-01-15", avatar: "AB" },
  { id: "2",  name: "Sara Meziane",     email: "sara.meziane@email.com",     phone: "+213 661 234 567", role: "seller",   status: "active",    createdAt: "2024-02-03", avatar: "SM" },
  { id: "3",  name: "Karim Ouali",      email: "karim.ouali@email.com",      phone: "+213 770 345 678", role: "employer", status: "suspended", createdAt: "2024-01-28", avatar: "KO" },
  { id: "4",  name: "Fatima Amrani",    email: "fatima.amrani@email.com",    phone: "+213 550 456 789", role: "seller",   status: "active",    createdAt: "2024-03-10", avatar: "FA" },
  { id: "5",  name: "Youcef Boudiaf",   email: "youcef.boudiaf@email.com",   phone: "+213 698 567 890", role: "employer", status: "active",    createdAt: "2024-03-22", avatar: "YB" },
  { id: "6",  name: "Nadia Khaldi",     email: "nadia.khaldi@email.com",     phone: "+213 773 678 901", role: "seller",   status: "suspended", createdAt: "2024-02-17", avatar: "NK" },
  { id: "7",  name: "Omar Tlemcani",    email: "omar.tlemcani@email.com",    phone: "+213 561 789 012", role: "employer", status: "active",    createdAt: "2024-04-05", avatar: "OT" },
  { id: "8",  name: "Lina Bensalem",    email: "lina.bensalem@email.com",    phone: "+213 699 890 123", role: "seller",   status: "active",    createdAt: "2024-04-18", avatar: "LB" },
  { id: "9",  name: "Hamza Rahmani",    email: "hamza.rahmani@email.com",    phone: "+213 556 901 234", role: "employer", status: "active",    createdAt: "2024-05-01", avatar: "HR" },
  { id: "10", name: "Asma Chergui",     email: "asma.chergui@email.com",     phone: "+213 771 012 345", role: "seller",   status: "active",    createdAt: "2024-05-14", avatar: "AC" },
  { id: "11", name: "Bilal Hadjadj",    email: "bilal.hadjadj@email.com",    phone: "+213 663 123 456", role: "employer", status: "suspended", createdAt: "2024-06-02", avatar: "BH" },
  { id: "12", name: "Rima Bouzid",      email: "rima.bouzid@email.com",      phone: "+213 552 234 567", role: "seller",   status: "active",    createdAt: "2024-06-20", avatar: "RB" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SuperAdminUsers() {
  const [data, setData] = useState<User[]>(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSuspend = (user: User) => {
    const nextStatus: UserStatus = user.status === "active" ? "suspended" : "active";
    setData((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    toast.success(
      nextStatus === "suspended"
        ? `${user.name} has been suspended.`
        : `${user.name} has been reactivated.`
    );
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!userToDelete) return;
    setData((prev) => prev.filter((u) => u.id !== userToDelete.id));
    toast.success(`${userToDelete.name} has been deleted.`);
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleVisitProfile = (user: User) => {
    // In a real app: router.push(`/admin/users/${user.id}`)
    toast(`Visiting profile of ${user.name}`, { icon: "👤" });
  };

  // ── Columns ─────────────────────────────────────────────────────────────────

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox className="cursor-pointer" aria-label="Select all" />
      ),
      cell: ({ row }) => (
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
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const user: User = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {user.avatar}
            </div>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("phone")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role: UserRole = row.getValue("role");
        return (
          <Badge
            variant="outline"
            className={
              role === "employer"
                ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                : "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300"
            }
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status: UserStatus = row.getValue("status");
        return (
          <Badge
            variant="outline"
            className={
              status === "active"
                ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.getValue("createdAt")).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      id: "profile",
      header: "Profile",
      enableHiding: false,
      cell: ({ row }) => {
        const user: User = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={() => handleVisitProfile(user)}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View
          </Button>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user: User = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className="h-8 w-8 p-0 cursor-pointer"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                inset=""
                onClick={() => handleVisitProfile(user)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                inset=""
                onClick={() => handleSuspend(user)}
              >
                <ShieldOff className="mr-2 h-4 w-4" />
                {user.status === "active" ? "Suspend" : "Reactivate"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                inset=""
                onClick={() => openDeleteDialog(user)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // ── Table ────────────────────────────────────────────────────────────────────

  const table = useReactTable({
    data,
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

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <SuperAdminSidebarLayout breadcrumbTitle="Users">
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        Manage all registered employers and sellers.
      </p>

      <div className="w-full">
        {/* Toolbar */}
        <div className="flex items-center py-4 gap-3">
          <Input
            placeholder="Filter by name or email..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("name")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />

          {/* Role filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="cursor-pointer">
                Role <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  table.getColumn("role")?.setFilterValue(undefined)
                }
              >
                All Roles
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  table.getColumn("role")?.setFilterValue("employer")
                }
              >
                Employers
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  table.getColumn("role")?.setFilterValue("seller")
                }
              >
                Sellers
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="ml-auto cursor-pointer"
              >
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription className="mb-3">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  {userToDelete?.name}
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline" size="lg">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                size="lg"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                    No results.
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
    </SuperAdminSidebarLayout>
  );
}