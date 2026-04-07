"use client";
import { useCallback, useMemo, useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  ChevronDown,
  ExternalLink,
  Trash2,
} from "lucide-react";
import SuperAdminSidebarLayout from "@/components/SuperAdminSidebarLayout";
import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import { Sponsor } from "@/lib/DatabaseTypes";
import toast from "react-hot-toast";

type SponsorRow = Sponsor & { isActive: boolean };
import {
  useDeleteSponsorMutation,
  useGetsponsorsQuery,
  useUpdateSponsorStatusMutation,
} from "@/Redux/Services/SponsorApi";

import CreateSponsorModal from "./components/CreateSponsorModal";
import UpdateSponsorUi from "../components/UpdateSponsorUI";
import Image from "next/image";
import { type Language, useI18n } from "@/context/I18nContext";

const superAdminSponsorsCopy: Record<Language, Record<string, string>> = {
  en: {
    breadcrumb: "Sponsors",
    title: "Sponsors",
    description: "View, manage and organize all platform sponsors.",
    deleted: "Sponsor deleted successfully",
    deleteFailed: "Failed to delete sponsor",
    statusUpdated: "Sponsor status updated successfully",
    statusUpdateFailed: "Failed to update sponsor status",
    selectAll: "Select all",
    selectRow: "Select row",
    logo: "Logo",
    sponsorLogoAlt: "Sponsor logo",
    notAvailable: "N/A",
    link: "Link",
    descriptionCol: "Description",
    ownerId: "Owner ID",
    status: "Status",
    active: "Active",
    suspended: "Suspended",
    openMenu: "Open menu",
    actions: "Actions",
    edit: "Edit",
    activate: "Activate",
    deactivate: "Deactivate",
    delete: "Delete",
    statusFilter: "Status",
    all: "All",
    columns: "Columns",
    deleteTitle: "Delete Sponsor",
    deletePrompt:
      "Are you sure you want to delete this sponsor? This action cannot be undone.",
    cancel: "Cancel",
    noResults: "No results.",
    selectedRows: "{selected} of {total} row(s) selected.",
    previous: "Previous",
    next: "Next",
  },
  fr: {
    breadcrumb: "Sponsors",
    title: "Sponsors",
    description:
      "Afficher, gerer et organiser tous les sponsors de la plateforme.",
    deleted: "Sponsor supprime avec succes",
    deleteFailed: "Echec de suppression du sponsor",
    statusUpdated: "Statut du sponsor mis a jour avec succes",
    statusUpdateFailed: "Echec de mise a jour du statut du sponsor",
    selectAll: "Tout selectionner",
    selectRow: "Selectionner la ligne",
    logo: "Logo",
    sponsorLogoAlt: "Logo sponsor",
    notAvailable: "N/A",
    link: "Lien",
    descriptionCol: "Description",
    ownerId: "ID proprietaire",
    status: "Statut",
    active: "Actif",
    suspended: "Suspendu",
    openMenu: "Ouvrir le menu",
    actions: "Actions",
    edit: "Modifier",
    activate: "Activer",
    deactivate: "Desactiver",
    delete: "Supprimer",
    statusFilter: "Statut",
    all: "Tous",
    columns: "Colonnes",
    deleteTitle: "Supprimer le sponsor",
    deletePrompt:
      "Voulez-vous vraiment supprimer ce sponsor ? Cette action est irreversible.",
    cancel: "Annuler",
    noResults: "Aucun resultat.",
    selectedRows: "{selected} sur {total} ligne(s) selectionnee(s).",
    previous: "Precedent",
    next: "Suivant",
  },
  ar: {
    breadcrumb: "الرعاة",
    title: "الرعاة",
    description: "عرض وادارة وتنظيم جميع رعاة المنصة.",
    deleted: "تم حذف الراعي بنجاح",
    deleteFailed: "فشل حذف الراعي",
    statusUpdated: "تم تحديث حالة الراعي بنجاح",
    statusUpdateFailed: "فشل تحديث حالة الراعي",
    selectAll: "تحديد الكل",
    selectRow: "تحديد الصف",
    logo: "الشعار",
    sponsorLogoAlt: "شعار الراعي",
    notAvailable: "غير متاح",
    link: "الرابط",
    descriptionCol: "الوصف",
    ownerId: "معرف المالك",
    status: "الحالة",
    active: "نشط",
    suspended: "معلق",
    openMenu: "فتح القائمة",
    actions: "الاجراءات",
    edit: "تعديل",
    activate: "تفعيل",
    deactivate: "تعطيل",
    delete: "حذف",
    statusFilter: "الحالة",
    all: "الكل",
    columns: "الاعمدة",
    deleteTitle: "حذف الراعي",
    deletePrompt:
      "هل انت متاكد من حذف هذا الراعي؟ لا يمكن التراجع عن هذا الاجراء.",
    cancel: "الغاء",
    noResults: "لا توجد نتائج.",
    selectedRows: "تم تحديد {selected} من {total} صف.",
    previous: "السابق",
    next: "التالي",
  },
};

export default function SuperAdminSponsors() {
  const { language, t } = useI18n();
  const copy = superAdminSponsorsCopy[language];
  const { data: sponsorsData, isLoading, isFetching } = useGetsponsorsQuery();
  const sponsors = sponsorsData?.content ?? [];
  const [deleteSponsor] = useDeleteSponsorMutation();
  const [updateSponsorStatus] = useUpdateSponsorStatusMutation();

  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<SponsorRow | null>(
    null,
  );

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sponsorToDelete, setSponsorToDelete] = useState<SponsorRow | null>(
    null,
  );

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openDeleteDialog = (sponsor: SponsorRow) => {
    setSponsorToDelete(sponsor);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!sponsorToDelete) return;
    try {
      await deleteSponsor(sponsorToDelete.id).unwrap();
    } catch {
      toast.error(copy.deleteFailed);
    } finally {
      setDeleteDialogOpen(false);
      setSponsorToDelete(null);
    }
  };

  const handleToggleStatus = useCallback(async (sponsor: SponsorRow) => {
    try {
      await updateSponsorStatus({
        id: sponsor.id,
        isActive: !sponsor.isActive,
      }).unwrap();
      toast.success(copy.statusUpdated);
    } catch {
      toast.error(copy.statusUpdateFailed);
    }
  }, [copy.statusUpdateFailed, copy.statusUpdated, updateSponsorStatus]);

  // ── Columns ───────────────────────────────────────────────────────────────

  const columns = useMemo<ColumnDef<SponsorRow>[]>(
    () => [
      {
        accessorKey: "image",
        header: copy.logo,
        cell: ({ row }) => {
          const imgSrc: string = row.getValue("image");
          return (
            <div className="flex items-center justify-center h-10 w-16 rounded-md border bg-muted overflow-hidden">
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={copy.sponsorLogoAlt}
                  width={64}
                  height={40}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/64x40?text=N/A";
                  }}
                />
              ) : (
                <span className="text-xs text-muted-foreground">
                  {copy.notAvailable}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: () => <span className="hidden md:inline">Name</span>,
        cell: ({ row }) => (
          <div className="text-sm hidden md:block text-green-600 font-semibold">
            {row.getValue("name")}
          </div>
        ),
      },
      {
        accessorKey: "sponsorLink",
        header: copy.link,
        cell: ({ row }) => {
          const href: string = row.getValue("sponsorLink");
          return href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400 max-w-45 truncate"
            >
              <ExternalLink className="h-3 w-3 shrink-0" />
              {href.replace(/^https?:\/\//, "")}
            </a>
          ) : (
            <span className="text-sm text-muted-foreground">
              {copy.notAvailable}
            </span>
          );
        },
      },
      {
        accessorKey: "description",
        header: copy.descriptionCol,
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground max-w-50 truncate">
            {row.getValue("description") || copy.notAvailable}
          </div>
        ),
      },
      {
        accessorKey: "isActive",
        header: copy.status,
        cell: ({ row }) => {
          const active: boolean = row.getValue("isActive");
          return (
            <Badge
              variant="outline"
              className={
                active
                  ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
              }
            >
              {active ? copy.active : copy.suspended}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const sponsor: SponsorRow = row.original;
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
              <DropdownMenuContent className="" align="end">
                <DropdownMenuLabel>{copy.actions}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  inset
                  onClick={() => {
                    setSelectedSponsor(sponsor);
                    setEditSheetOpen(true);
                  }}
                >
                  {copy.edit}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  inset
                  onClick={() => handleToggleStatus(sponsor)}
                >
                  {sponsor.isActive ? copy.deactivate : copy.activate}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  inset
                  onClick={() => openDeleteDialog(sponsor)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {copy.delete}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [copy, handleToggleStatus],
  );

  // ── Table ─────────────────────────────────────────────────────────────────

  const table = useReactTable<SponsorRow>({
    data: sponsors,
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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SuperAdminSidebarLayout breadcrumbTitle={copy.breadcrumb}>
      <h1 className="text-2xl font-bold">{copy.title}</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        {copy.description}
      </p>

      <div className="w-full">
        {/* Toolbar */}
        <div className="flex items-center py-4 gap-3">
          {/* Create */}
          <CreateSponsorModal />

          {/* Status filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="cursor-pointer">
                {copy.statusFilter} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="" align="start">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  table.getColumn("isActive")?.setFilterValue(undefined)
                }
              >
                {copy.all}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  table.getColumn("isActive")?.setFilterValue(true)
                }
              >
                {copy.active}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  table.getColumn("isActive")?.setFilterValue(false)
                }
              >
                {copy.suspended}
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
            <DropdownMenuContent className={""} align="end">
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

        {/* Edit Sheet (isolated component) */}
        <UpdateSponsorUi
          key={selectedSponsor?.id ?? "none"}
          open={editSheetOpen}
          onOpenChange={setEditSheetOpen}
          sponsor={selectedSponsor}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>{copy.deleteTitle}</DialogTitle>
              <DialogDescription className="mb-3">
                {copy.deletePrompt}
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
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading || isFetching ? (
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
