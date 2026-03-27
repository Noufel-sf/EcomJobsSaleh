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
import { type Language, useI18n } from "@/context/I18nContext";

const superAdminUsersCopy: Record<Language, Record<string, string>> = {
  en: {
    breadcrumb: "Users",
    title: "Users",
    description: "Manage all registered employers and sellers.",
    suspendedToast: "{name} has been suspended.",
    reactivatedToast: "{name} has been reactivated.",
    deletedToast: "{name} has been deleted.",
    visitingProfileToast: "Visiting profile of {name}",
    selectAll: "Select all",
    selectRow: "Select row",
    name: "Name",
    phone: "Phone",
    role: "Role",
    status: "Status",
    joined: "Joined",
    profile: "Profile",
    view: "View",
    openMenu: "Open menu",
    actions: "Actions",
    visitProfile: "Visit Profile",
    suspend: "Suspend",
    reactivate: "Reactivate",
    delete: "Delete",
    filterByNameOrEmail: "Filter by name or email...",
    roleFilter: "Role",
    allRoles: "All Roles",
    employers: "Employers",
    sellers: "Sellers",
    columns: "Columns",
    deleteUser: "Delete User",
    deletePromptPrefix: "Are you sure you want to delete",
    deletePromptSuffix: "? This action cannot be undone.",
    cancel: "Cancel",
    noResults: "No results.",
    selectedRows: "{selected} of {total} row(s) selected.",
    previous: "Previous",
    next: "Next",
  },
  fr: {
    breadcrumb: "Utilisateurs",
    title: "Utilisateurs",
    description: "Gerez tous les employeurs et vendeurs inscrits.",
    suspendedToast: "{name} a ete suspendu.",
    reactivatedToast: "{name} a ete reactive.",
    deletedToast: "{name} a ete supprime.",
    visitingProfileToast: "Ouverture du profil de {name}",
    selectAll: "Tout selectionner",
    selectRow: "Selectionner la ligne",
    name: "Nom",
    phone: "Telephone",
    role: "Role",
    status: "Statut",
    joined: "Inscrit le",
    profile: "Profil",
    view: "Voir",
    openMenu: "Ouvrir le menu",
    actions: "Actions",
    visitProfile: "Visiter le profil",
    suspend: "Suspendre",
    reactivate: "Reactiver",
    delete: "Supprimer",
    filterByNameOrEmail: "Filtrer par nom ou e-mail...",
    roleFilter: "Role",
    allRoles: "Tous les roles",
    employers: "Employeurs",
    sellers: "Vendeurs",
    columns: "Colonnes",
    deleteUser: "Supprimer l'utilisateur",
    deletePromptPrefix: "Voulez-vous vraiment supprimer",
    deletePromptSuffix: "? Cette action est irreversible.",
    cancel: "Annuler",
    noResults: "Aucun resultat.",
    selectedRows: "{selected} sur {total} ligne(s) selectionnee(s).",
    previous: "Precedent",
    next: "Suivant",
  },
  ar: {
    breadcrumb: "المستخدمون",
    title: "المستخدمون",
    description: "ادارة جميع اصحاب العمل والبائعين المسجلين.",
    suspendedToast: "تم ايقاف {name}.",
    reactivatedToast: "تمت اعادة تفعيل {name}.",
    deletedToast: "تم حذف {name}.",
    visitingProfileToast: "جار فتح ملف {name}",
    selectAll: "تحديد الكل",
    selectRow: "تحديد الصف",
    name: "الاسم",
    phone: "الهاتف",
    role: "الدور",
    status: "الحالة",
    joined: "تاريخ الانضمام",
    profile: "الملف",
    view: "عرض",
    openMenu: "فتح القائمة",
    actions: "الاجراءات",
    visitProfile: "زيارة الملف",
    suspend: "ايقاف",
    reactivate: "اعادة التفعيل",
    delete: "حذف",
    filterByNameOrEmail: "تصفية حسب الاسم او البريد...",
    roleFilter: "الدور",
    allRoles: "كل الادوار",
    employers: "اصحاب العمل",
    sellers: "البائعون",
    columns: "الاعمدة",
    deleteUser: "حذف المستخدم",
    deletePromptPrefix: "هل تريد حذف",
    deletePromptSuffix: "؟ لا يمكن التراجع عن هذا الاجراء.",
    cancel: "الغاء",
    noResults: "لا توجد نتائج.",
    selectedRows: "تم تحديد {selected} من {total} صف.",
    previous: "السابق",
    next: "التالي",
  },
};

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
  const { language, t } = useI18n();
  const copy = superAdminUsersCopy[language];
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
        ? t(copy.suspendedToast, { name: user.name })
        : t(copy.reactivatedToast, { name: user.name })
    );
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!userToDelete) return;
    setData((prev) => prev.filter((u) => u.id !== userToDelete.id));
    toast.success(t(copy.deletedToast, { name: userToDelete.name }));
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleVisitProfile = (user: User) => {
    // In a real app: router.push(`/admin/users/${user.id}`)
    toast(t(copy.visitingProfileToast, { name: user.name }), { icon: "👤" });
  };

  // ── Columns ─────────────────────────────────────────────────────────────────

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox className="cursor-pointer" aria-label={copy.selectAll} />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="cursor-pointer"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={copy.selectRow}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: copy.name,
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
      header: copy.phone,
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("phone")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: copy.role,
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
      header: copy.status,
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
      header: copy.joined,
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
      header: copy.profile,
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
            {copy.view}
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
                <span className="sr-only">{copy.openMenu}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{copy.actions}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                inset=""
                onClick={() => handleVisitProfile(user)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {copy.visitProfile}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                inset=""
                onClick={() => handleSuspend(user)}
              >
                <ShieldOff className="mr-2 h-4 w-4" />
                {user.status === "active" ? copy.suspend : copy.reactivate}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                inset=""
                onClick={() => openDeleteDialog(user)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {copy.delete}
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
    <SuperAdminSidebarLayout breadcrumbTitle={copy.breadcrumb}>
      <h1 className="text-2xl font-bold">{copy.title}</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        {copy.description}
      </p>

      <div className="w-full">
        {/* Toolbar */}
        <div className="flex items-center py-4 gap-3">
          <Input
            placeholder={copy.filterByNameOrEmail}
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
                {copy.roleFilter} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  table.getColumn("role")?.setFilterValue(undefined)
                }
              >
                {copy.allRoles}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  table.getColumn("role")?.setFilterValue("employer")
                }
              >
                {copy.employers}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  table.getColumn("role")?.setFilterValue("seller")
                }
              >
                {copy.sellers}
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
                {copy.columns} <ChevronDown className="ml-2 h-4 w-4" />
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
              <DialogTitle>{copy.deleteUser}</DialogTitle>
              <DialogDescription className="mb-3">
                {copy.deletePromptPrefix}{" "}
                <span className="font-semibold text-foreground">
                  {userToDelete?.name}
                </span>
                {copy.deletePromptSuffix}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline" size="lg">
                  {copy.cancel}
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                size="lg"
                onClick={handleDelete}
              >
                {copy.delete}
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
                    {copy.noResults}
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