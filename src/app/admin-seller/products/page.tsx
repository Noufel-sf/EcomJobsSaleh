"use client";
"use no memo";

import { useMemo, useState } from "react";
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type RowSelectionState,
  type SortingState,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import toast from "react-hot-toast";
import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import { createProductColumns } from "@/components/ProductRow";
import UpdateProductUi from "@/components/UpdateProductUi";
import CreateProductUi from "@/components/CreateProductUi";

import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateProductStatusMutation,
} from "@/Redux/Services/ProductsApi";
import { useAppSelector } from "@/Redux/hooks";

import { useGetAllClassificationsQuery } from "@/Redux/Services/ClassificationApi";
import { Categorie, Product } from "@/lib/DatabaseTypes";
import { type Language, useI18n } from "@/context/I18nContext";

const productsCopy: Record<Language, Record<string, string>> = {
  en: {
    title: "Products",
    subtitle: "View, create, and organize all products.",
    search: "Search by name...",
    columns: "Columns",
    noResults: "No results.",
    selectedRows: "{selected} of {total} row(s) selected.",
    previous: "Previous",
    next: "Next",
    created: "Product created successfully",
    updated: "Product updated successfully",
    updateFailed: "Failed to update product",
    deleted: "Product deleted successfully",
    deleteFailed: "Failed to delete product",
    statusUpdated: "Status updated successfully",
    statusFailed: "Failed to update status",
  },
  fr: {
    title: "Produits",
    subtitle: "Consultez, creez et organisez tous les produits.",
    search: "Rechercher par nom...",
    columns: "Colonnes",
    noResults: "Aucun resultat.",
    selectedRows: "{selected} sur {total} ligne(s) selectionnee(s).",
    previous: "Precedent",
    next: "Suivant",
    created: "Produit cree avec succes",
    updated: "Produit mis a jour",
    updateFailed: "Echec de mise a jour du produit",
    deleted: "Produit supprime",
    deleteFailed: "Echec de suppression du produit",
    statusUpdated: "Statut mis a jour",
    statusFailed: "Echec de mise a jour du statut",
  },
  ar: {
    title: "المنتجات",
    subtitle: "عرض وخلق وتنظيم جميع المنتجات.",
    search: "ابحث بالاسم...",
    columns: "الاعمدة",
    noResults: "لا توجد نتائج.",
    selectedRows: "تم تحديد {selected} من {total} صف.",
    previous: "السابق",
    next: "التالي",
    created: "تم انشاء المنتج بنجاح",
    updated: "تم تحديث المنتج بنجاح",
    updateFailed: "فشل تحديث المنتج",
    deleted: "تم حذف المنتج بنجاح",
    deleteFailed: "فشل حذف المنتج",
    statusUpdated: "تم تحديث الحالة بنجاح",
    statusFailed: "فشل تحديث الحالة",
  },
};

export default function AdminProducts() {
  const { language, t } = useI18n();
  const copy = productsCopy[language];
  const user = useAppSelector((state) => state.auth.user);
  const ownerId = user?.userId ?? "";
  const { data: categoriesData } = useGetAllClassificationsQuery(undefined);
  const categories = useMemo<Categorie[]>(
    () =>
      (categoriesData?.content ?? []).map((category) => ({
        ...category,
        desc: category.desc ?? null,
      })),
    [categoriesData],
  );

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProductStatus] = useUpdateProductStatusMutation();

  const { data: productsData, isLoading } = useGetAllProductsQuery(undefined);
  const products = useMemo(() => productsData?.content ?? [], [productsData]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleCreate = async (formData: FormData) => {
    try {
      await createProduct(formData).unwrap();
      toast.success(copy.created);
      setOpenCreate(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || copy.updateFailed);
    }
  };

  const handleUpdate = async (id: string, formData: FormData) => {
    try {
      await updateProduct({ id, formData }).unwrap();

      toast.success(copy.updated);
      setOpenEdit(false);
      setSelectedProduct(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || copy.updateFailed);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success(copy.deleted);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || copy.deleteFailed);
    }
  };

  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      await updateProductStatus({
        id: productId,
        available: newStatus === "active",
      }).unwrap();

      toast.success(copy.statusUpdated);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || copy.statusFailed);
    }
  };

  const columns = createProductColumns({
    handleStatusChange,
    handleDelete,
    onEdit: (product: Product) => {
      setSelectedProduct(product);
      setOpenEdit(true);
    },
  });

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <AdminSidebarLayout breadcrumbTitle="Products">
      <h1 className="text-2xl font-bold">{copy.title}</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        {copy.subtitle}
      </p>

      <div className="w-full">
        {/* Top Controls */}
        <div className="flex items-center justify-between py-4">
          <Input
            type="text"
            placeholder={copy.search}
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm hidden md:block"
          />

          <div className="flex items-center gap-3">
            <CreateProductUi
              open={openCreate}
              onOpenChange={setOpenCreate}
              categories={categories}
              onSubmit={handleCreate}
              loading={isCreating}
              ownerId={ownerId}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
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
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: boolean | "indeterminate") =>
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

        <UpdateProductUi
          open={openEdit}
          onOpenChange={setOpenEdit}
          ownerId={ownerId}
          categories={categories}
          initialProduct={selectedProduct ? { ...selectedProduct, prod_class: selectedProduct.prod_class ?? undefined } : null}
          onSubmit={handleUpdate}
          loading={isUpdating}
        />

        <div className="rounded-md border">
          <Table className="">
            <TableHeader className="">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow className="" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="">
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

            <TableBody className="">
              {isLoading ? (
                <AdminDataTableSkeleton />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow className="" key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className={""}>
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
              size="lg"
              className={""}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {copy.previous}
            </Button>
            <Button
              size="lg"
              variant="primary"
              className={""}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {copy.next}
            </Button>
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  );
}
