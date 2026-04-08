"use client";
"use no memo";

import { useEffect, useMemo, useState } from "react";
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
  ChevronDown,
  ExternalLink,
  MoreHorizontal,
  ShieldOff,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import SuperAdminSidebarLayout from "@/components/SuperAdminSidebarLayout";
import { type Language, useI18n } from "@/context/I18nContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteAdminUserMutation,
  useGetAllEmployersQuery,
  useUpdateAdminEmployersStatusMutation,
} from "@/Redux/Services/UsersApi";

const employersCopy: Record<Language, Record<string, string>> = {
  en: {
    breadcrumb: "Employers",
    title: "Employers",
    description: "Manage all registered employers.",
    suspendedToast: "{name} has been suspended.",
    reactivatedToast: "{name} has been reactivated.",
    deletedToast: "{name} has been deleted.",
    visitingProfileToast: "Visiting profile of {name}",
    selectAll: "Select all",
    selectRow: "Select row",
    name: "Name",
    phone: "Phone",
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
    columns: "Columns",
    deleteUser: "Delete Employer",
    deletePromptPrefix: "Are you sure you want to delete",
    deletePromptSuffix: "? This action cannot be undone.",
    cancel: "Cancel",
    noResults: "No results.",
    selectedRows: "{selected} of {total} row(s) selected.",
    previous: "Previous",
    next: "Next",
  },
  fr: {
    breadcrumb: "Employeurs",
    title: "Employeurs",
    description: "Gerez tous les employeurs inscrits.",
    suspendedToast: "{name} a ete suspendu.",
    reactivatedToast: "{name} a ete reactive.",
    deletedToast: "{name} a ete supprime.",
    visitingProfileToast: "Ouverture du profil de {name}",
    selectAll: "Tout selectionner",
    selectRow: "Selectionner la ligne",
    name: "Nom",
    phone: "Telephone",
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
    columns: "Colonnes",
    deleteUser: "Supprimer l'employeur",
    deletePromptPrefix: "Voulez-vous vraiment supprimer",
    deletePromptSuffix: "? Cette action est irreversible.",
    cancel: "Annuler",
    noResults: "Aucun resultat.",
    selectedRows: "{selected} sur {total} ligne(s) selectionnee(s).",
    previous: "Precedent",
    next: "Suivant",
  },
  ar: {
    breadcrumb: "اصحاب العمل",
    title: "اصحاب العمل",
    description: "ادارة جميع اصحاب العمل المسجلين.",
    suspendedToast: "تم ايقاف {name}.",
    reactivatedToast: "تمت اعادة تفعيل {name}.",
    deletedToast: "تم حذف {name}.",
    visitingProfileToast: "جار فتح ملف {name}",
    selectAll: "تحديد الكل",
    selectRow: "تحديد الصف",
    name: "الاسم",
    phone: "الهاتف",
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
    columns: "الاعمدة",
    deleteUser: "حذف صاحب العمل",
    deletePromptPrefix: "هل تريد حذف",
    deletePromptSuffix: "؟ لا يمكن التراجع عن هذا الاجراء.",
    cancel: "الغاء",
    noResults: "لا توجد نتائج.",
    selectedRows: "تم تحديد {selected} من {total} صف.",
    previous: "السابق",
    next: "التالي",
  },
};

type UserStatus = "active" | "suspended" | string;

interface Employer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "employer";
  status: UserStatus;
  createdAt: string;
  avatar: string;
}

export default function SuperAdminEmployers() {
  const { language, t } = useI18n();
  const copy = employersCopy[language];
  const { data: EmployersData, isLoading } = useGetAllEmployersQuery(undefined);
  const employers = useMemo(() => EmployersData?.content ?? [], [EmployersData]);
  const [updateEmployerStatus] = useUpdateAdminEmployersStatusMutation();
  const [deleteAdminUser] = useDeleteAdminUserMutation();
  const [tableData, setTableData] = useState<Employer[]>([]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Employer | null>(null);

  useEffect(() => {
    setTableData(employers as Employer[]);
  }, [employers]);

  const handleSuspend = async (user: Employer) => {
    const nextStatus: UserStatus =
      user.status === "active" ? "suspended" : "active";

    try {
      await updateEmployerStatus({
        id: user.id,
        isActive: user.status === "active" ? false : true,
      }).unwrap();

      setTableData((prev) =>
        prev.map((item) =>
          item.id === user.id ? { ...item, status: nextStatus } : item,
        ),
      );

      toast.success(
        nextStatus === "suspended"
          ? t(copy.suspendedToast, { name: user.name })
          : t(copy.reactivatedToast, { name: user.name }),
      );
    } catch {
      toast.error("Failed to update employer status.");
    }
  };

  const openDeleteDialog = (user: Employer) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteAdminUser(userToDelete.id).unwrap();
      setTableData((prev) => prev.filter((item) => item.id !== userToDelete.id));
      toast.success(t(copy.deletedToast, { name: userToDelete.name }));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch {
      toast.error("Failed to delete employer.");
    }
  };

  const handleVisitProfile = (user: Employer) => {
    toast(t(copy.visitingProfileToast, { name: user.name }));
  };

  const columns = [
    {
      id: "select",
      header: ({ table }: { table: TanstackTable<Employer> }) => (
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
      cell: ({ row }: { row: Row<Employer> }) => (
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
      accessorKey: "name",
      header: copy.name,
      cell: ({ row }: { row: Row<Employer> }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
           
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
      cell: ({ row }: { row: Row<Employer> }) => (
        <div className="text-sm">{row.getValue("phone")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: copy.status,
      cell: ({ row }: { row: Row<Employer> }) => {
        const status = row.getValue("status") as UserStatus;
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
      cell: ({ row }: { row: Row<Employer> }) => (
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
      cell: ({ row }: { row: Row<Employer> }) => {
        const user = row.original;
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
      cell: ({ row }: { row: Row<Employer> }) => {
        const user = row.original;
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
            <DropdownMenuContent align="end" className="">
              <DropdownMenuLabel>{copy.actions}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                inset
                onClick={() => handleVisitProfile(user)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {copy.visitProfile}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                inset
                onClick={() => handleSuspend(user)}
              >
                <ShieldOff className="mr-2 h-4 w-4" />
                {user.status === "active" ? copy.suspend : copy.reactivate}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                inset
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

  const table = useReactTable({
    data: tableData,
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
    <SuperAdminSidebarLayout breadcrumbTitle={copy.breadcrumb}>
      <h1 className="text-2xl font-bold">{copy.title}</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        {copy.description}
      </p>

      <div className="w-full">
        <div className="flex items-center py-4 gap-3">
          <Input
            placeholder={copy.filterByNameOrEmail}
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("name")?.setFilterValue(e.target.value)
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

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-106.25">
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
              <Button variant="destructive" size="lg" onClick={handleDelete}>
                {copy.delete}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                    {copy.noResults}
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
