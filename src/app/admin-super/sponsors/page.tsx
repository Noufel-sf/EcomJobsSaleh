"use client";
import { useState, useEffect } from "react";
import React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ChevronDown, ExternalLink, Trash2 } from "lucide-react";
import SuperAdminSidebarLayout from "@/components/SuperAdminSidebarLayout";
import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import { Sponsor } from "@/lib/DatabaseTypes";
import toast from "react-hot-toast";

type SponsorRow = Sponsor & { isActive: boolean };

export const MOCK_SPONSORS: SponsorRow[] = [
  {
    id: "1",
    name: "Google",
    img: "/hero2.png",
    link: "https://google.com",
    description: "Search engine and cloud services provider.",
    isActive: true,
    ownerId: "user_001",
  },
  {
    id: "2",
    name: "Amazon",
    img: "/hero2.png",
    link: "https://amazon.com",
    description: "E-commerce and cloud computing giant.",
    isActive: true,
    ownerId: "user_002",
  },
  {
    id: "3",
    name: "Netflix",
    img: "/hero2.png",
    link: "https://netflix.com",
    description: "Streaming platform for movies and series.",
    isActive: false,
    ownerId: "user_003",
  },
  {
    id: "4",
    name: "Notion",
    img: "/hero2.png",
    link: "https://notion.so",
    description: "All-in-one workspace for notes and projects.",
    isActive: true,
    ownerId: "user_004",
  },
  {
    id: "5",
    name: "Shopify",
    img: "/hero2.png",
    link: "https://shopify.com",
    description: "E-commerce platform for online stores.",
    isActive: true,
    ownerId: "user_005",
  },
  {
    id: "6",
    name: "Dropbox",
    img: "/hero2.png",
    link: "https://dropbox.com",
    description: "Cloud storage and file sharing service.",
    isActive: false,
    ownerId: "user_006",
  },
];








// import {
//   useGetAllSponsorsQuery,
//   useDeleteSponsorMutation,
// } from "@/Redux/Services/SponsorApi";

import CreateSponsorUi from "../components/CreateSponsorUi";
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
    inactive: "Inactive",
    openMenu: "Open menu",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    statusFilter: "Status",
    all: "All",
    columns: "Columns",
    deleteTitle: "Delete Sponsor",
    deletePrompt: "Are you sure you want to delete this sponsor? This action cannot be undone.",
    cancel: "Cancel",
    noResults: "No results.",
    selectedRows: "{selected} of {total} row(s) selected.",
    previous: "Previous",
    next: "Next",
  },
  fr: {
    breadcrumb: "Sponsors",
    title: "Sponsors",
    description: "Afficher, gerer et organiser tous les sponsors de la plateforme.",
    deleted: "Sponsor supprime avec succes",
    deleteFailed: "Echec de suppression du sponsor",
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
    inactive: "Inactif",
    openMenu: "Ouvrir le menu",
    actions: "Actions",
    edit: "Modifier",
    delete: "Supprimer",
    statusFilter: "Statut",
    all: "Tous",
    columns: "Colonnes",
    deleteTitle: "Supprimer le sponsor",
    deletePrompt: "Voulez-vous vraiment supprimer ce sponsor ? Cette action est irreversible.",
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
    inactive: "غير نشط",
    openMenu: "فتح القائمة",
    actions: "الاجراءات",
    edit: "تعديل",
    delete: "حذف",
    statusFilter: "الحالة",
    all: "الكل",
    columns: "الاعمدة",
    deleteTitle: "حذف الراعي",
    deletePrompt: "هل انت متاكد من حذف هذا الراعي؟ لا يمكن التراجع عن هذا الاجراء.",
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
//   const { data: sponsorsData, isLoading } = useGetAllSponsorsQuery();

//   useEffect(() => {
//     if (sponsorsData?.content) {
//       setData(sponsorsData.content);
//     }
//   }, [sponsorsData]);

  const [data, setData] = useState<SponsorRow[]>(
    MOCK_SPONSORS.map((sponsor) => ({ ...sponsor, isActive: sponsor.isActive ?? true }))
  );
  const [isLoading, setIsLoading] = useState(true);

  // Temporary loading simulation until backend integration is ready.
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Edit sheet state
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<SponsorRow | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sponsorToDelete, setSponsorToDelete] = useState<SponsorRow | null>(null);

//   const [deleteSponsor] = useDeleteSponsorMutation();

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCreated = (newSponsor: Sponsor) => {
    setData((prev) => [...prev, { ...newSponsor, isActive: true }]);
  };

  const handleUpdated = (updated: Sponsor) => {
    setData((prev) =>
      prev.map((s) => (s.id === updated.id ? { ...s, ...updated, isActive: s.isActive } : s))
    );
  };

  const openDeleteDialog = (sponsor: SponsorRow) => {
    setSponsorToDelete(sponsor);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!sponsorToDelete) return;
    try {
      setData((prev) => prev.filter((s) => s.id !== sponsorToDelete.id));
      toast.success(copy.deleted);
    } catch {
      toast.error(copy.deleteFailed);
    } finally {
      setDeleteDialogOpen(false);
      setSponsorToDelete(null);
    }
  };

  // ── Columns ───────────────────────────────────────────────────────────────

  const columns: ColumnDef<SponsorRow>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox className="cursor-pointer" aria-label={copy.selectAll} />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="cursor-pointer"
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean | "indeterminate") => row.toggleSelected(!!value)}
          aria-label={copy.selectRow}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // Sponsor image + link preview
    {
      accessorKey: "img",
      header: copy.logo,
      cell: ({ row }) => {
        const imgSrc: string = row.getValue("img");
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
              <span className="text-xs text-muted-foreground">{copy.notAvailable}</span>
            )}
          </div>
        );
      },
    },

    // Sponsor link
    {
      accessorKey: "link",
      header: copy.link,
      cell: ({ row }) => {
        const href: string = row.getValue("link");
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
          <span className="text-sm text-muted-foreground">{copy.notAvailable}</span>
        );
      },
    },

    // Description
    {
      accessorKey: "description",
      header: copy.descriptionCol,
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-50 truncate">
          {row.getValue("description") || copy.notAvailable}
        </div>
      ),
    },

    // Owner ID
    {
      accessorKey: "ownerId",
      header: copy.ownerId,
      cell: ({ row }) => (
        <div className="text-sm font-mono text-muted-foreground">
          {row.getValue("ownerId") || copy.notAvailable}
        </div>
      ),
    },

    // isActive badge
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
            {active ? copy.active : copy.inactive}
          </Badge>
        );
      },
    },

    // Actions
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
  ];

  // ── Table ─────────────────────────────────────────────────────────────────

  const table = useReactTable<SponsorRow>({
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
          <CreateSponsorUi onCreated={handleCreated} />

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
                {copy.inactive}
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
          open={editSheetOpen}
          onOpenChange={setEditSheetOpen}
          sponsor={selectedSponsor}
          onUpdated={handleUpdated}
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
              ) 
              : (
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