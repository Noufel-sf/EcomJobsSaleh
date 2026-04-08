"use client";
"use no memo";

import { useCallback, useMemo, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, ChevronDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import SuperAdminSidebarLayout from "@/components/SuperAdminSidebarLayout";
import {
  useGetNotAvailableProductsQuery,
  useUpdateProductStatusMutation,
} from "@/Redux/Services/ProductsApi";
import { type Language, useI18n } from "@/context/I18nContext";
import { Product } from "@/lib/DatabaseTypes";

const notActiveProductsCopy: Record<Language, Record<string, string>> = {
  en: {
    pageTitle: "Not Active Products",
    pageDescription: "Review products that are currently unavailable.",
    updated: "Product status updated successfully",
    updateFailed: "Failed to update product status",
    selectAll: "Select all",
    selectRow: "Select row",
    image: "Image",
    name: "Name",
    price: "Price",
    status: "Status",
    actions: "Actions",
    activate: "Activate",
    openMenu: "Open menu",
    searchName: "Search by name...",
    columns: "Columns",
    noResults: "No not-active products found.",
    selectedRows: "{selected} of {total} row(s) selected.",
    previous: "Previous",
    next: "Next",
    inactive: "Inactive",
    active: "Active",
    notAvailable: "Not available",
  },
  fr: {
    pageTitle: "Produits non actifs",
    pageDescription: "Consultez les produits actuellement indisponibles.",
    updated: "Statut du produit mis a jour",
    updateFailed: "Echec de mise a jour du statut",
    selectAll: "Tout selectionner",
    selectRow: "Selectionner la ligne",
    image: "Image",
    name: "Nom",
    price: "Prix",
    status: "Statut",
    actions: "Actions",
    activate: "Activer",
    openMenu: "Ouvrir le menu",
    searchName: "Rechercher par nom...",
    columns: "Colonnes",
    noResults: "Aucun produit non actif trouve.",
    selectedRows: "{selected} sur {total} ligne(s) selectionnee(s).",
    previous: "Precedent",
    next: "Suivant",
    inactive: "Inactif",
    active: "Actif",
    notAvailable: "Non disponible",
  },
  ar: {
    pageTitle: "المنتجات غير النشطة",
    pageDescription: "مراجعة المنتجات غير المتاحة حاليا.",
    updated: "تم تحديث حالة المنتج بنجاح",
    updateFailed: "فشل تحديث حالة المنتج",
    selectAll: "تحديد الكل",
    selectRow: "تحديد الصف",
    image: "الصورة",
    name: "الاسم",
    price: "السعر",
    status: "الحالة",
    actions: "الاجراءات",
    activate: "تفعيل",
    openMenu: "فتح القائمة",
    searchName: "ابحث بالاسم...",
    columns: "الاعمدة",
    noResults: "لا توجد منتجات غير نشطة.",
    selectedRows: "تم تحديد {selected} من {total} صف.",
    previous: "السابق",
    next: "التالي",
    inactive: "غير نشط",
    active: "نشط",
    notAvailable: "غير متاح",
  },
};

export default function SuperAdminNotActiveProducts() {
  const { language, t } = useI18n();
  const copy = notActiveProductsCopy[language];

  const { data: productsData, isLoading } =
    useGetNotAvailableProductsQuery(undefined);
  const [updateProductStatus] = useUpdateProductStatusMutation();

  const products = productsData?.content ?? [];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const handleActivate = useCallback(
    async (productId: string) => {
      try {
        await updateProductStatus({ id: productId, available: true }).unwrap();
        toast.success(copy.updated);
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || copy.updateFailed);
      }
    },
    [copy.updated, copy.updateFailed, updateProductStatus],
  );

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }: { table: TanstackTable<Product> }) => (
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
        cell: ({ row }: { row: Row<Product> }) => (
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
        accessorKey: "mainImage",
        header: copy.image,
        cell: ({ row }: { row: Row<Product> }) => {
          const src = row.getValue("mainImage") as string;
          return (
            <div className="flex items-center">
              <Image
                src={src}
                alt={row.original.name}
                width={48}
                height={48}
                className="h-12 w-12 rounded-md object-cover border"
              />
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: copy.name,
        cell: ({ row }: { row: Row<Product> }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "price",
        header: copy.price,
        cell: ({ row }: { row: Row<Product> }) => (
          <div className="text-sm text-emerald-600 font-semibold">
            {row.getValue("price")}
          </div>
        ),
      },
      {
        accessorKey: "available",
        header: copy.status,
        cell: ({ row }: { row: Row<Product> }) => {
          const product = row.original;

          return (
            <span className="inline-flex items-center rounded-md border border-transparent bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400">
              {product.available ? copy.active : copy.notAvailable}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: copy.actions,
        enableHiding: false,
        cell: ({ row }: { row: Row<Product> }) => {
          const product = row.original;

          return (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
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
                    onClick={() => handleActivate(product.id)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {copy.activate}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [
      copy.active,
      copy.actions,
      copy.activate,
      copy.image,
      copy.name,
      copy.notAvailable,
      copy.openMenu,
      copy.price,
      copy.selectAll,
      copy.selectRow,
      copy.status,
      handleActivate,
    ],
  );

  const table = useReactTable({
    data: products,
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
    <SuperAdminSidebarLayout breadcrumbTitle={copy.pageTitle}>
      <h1 className="text-2xl font-bold">{copy.pageTitle}</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        {copy.pageDescription}
      </p>

      <div className="w-full">
        <div className="flex items-center py-4 gap-3">
          <Input
            placeholder={copy.searchName}
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
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize cursor-pointer"
                    checked={col.getIsVisible()}
                    onCheckedChange={(value: boolean) =>
                      col.toggleVisibility(!!value)
                    }
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
