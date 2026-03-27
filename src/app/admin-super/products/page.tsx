"use client";

import { useState } from "react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import { createProductColumns } from "@/components/ProductRow";

import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useUpdateProductStatusMutation,
} from "@/Redux/Services/ProductsApi";

import { Product } from "@/lib/DatabaseTypes";
import SuperAdminSidebarLayout from "@/components/SuperAdminSidebarLayout";
import { type Language, useI18n } from "@/context/I18nContext";

const superAdminProductsCopy: Record<Language, Record<string, string>> = {
  en: {
    title: "Products",
    description: "View and organize all products.",
    deleted: "Product deleted successfully",
    deleteFailed: "Failed to delete product",
    updated: "Status updated successfully",
    updateFailed: "Failed to update status",
    searchByName: "Search by name...",
    columns: "Columns",
    noResults: "No results.",
    selectedRows: "{selected} of {total} row(s) selected.",
    previous: "Previous",
    next: "Next",
  },
  fr: {
    title: "Produits",
    description: "Afficher et organiser tous les produits.",
    deleted: "Produit supprime avec succes",
    deleteFailed: "Echec de suppression du produit",
    updated: "Statut mis a jour avec succes",
    updateFailed: "Echec de mise a jour du statut",
    searchByName: "Rechercher par nom...",
    columns: "Colonnes",
    noResults: "Aucun resultat.",
    selectedRows: "{selected} sur {total} ligne(s) selectionnee(s).",
    previous: "Precedent",
    next: "Suivant",
  },
  ar: {
    title: "المنتجات",
    description: "عرض وتنظيم جميع المنتجات.",
    deleted: "تم حذف المنتج بنجاح",
    deleteFailed: "فشل حذف المنتج",
    updated: "تم تحديث الحالة بنجاح",
    updateFailed: "فشل تحديث الحالة",
    searchByName: "ابحث بالاسم...",
    columns: "الاعمدة",
    noResults: "لا توجد نتائج.",
    selectedRows: "تم تحديد {selected} من {total} صف.",
    previous: "السابق",
    next: "التالي",
  },
};

export default function AdminProducts() {
  const { language, t } = useI18n();
  const copy = superAdminProductsCopy[language];

  const [deleteProduct] = useDeleteProductMutation();
  const [updateProductStatus] = useUpdateProductStatusMutation();

  const [data, setData] = useState<Product[]>([]);
  const { data: productsData, isLoading } = useGetAllProductsQuery(undefined);
  const products = productsData?.content || [];

  const [sorting, setSorting] = useState<any[]>([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<any>({});
  const [rowSelection, setRowSelection] = useState<any>({});


  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId).unwrap();
      setData((prev) => prev.filter((p) => p.id !== productId));
      toast.success(copy.deleted);
    } catch (error: any) {
      toast.error(error?.data?.message || copy.deleteFailed);
    }
  };

  const handleStatusChange = async (productId: string, newStatus: string) => {
    const previousData = [...data];

    setData((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, available: newStatus === "active" }
          : product,
      ),
    );

    try {
      await updateProductStatus({
        id: productId,
        available: newStatus === "active",
      }).unwrap();

      toast.success(copy.updated);
    } catch (error: any) {
      setData(previousData);
      toast.error(error?.data?.message || copy.updateFailed);
    }
  };

  const columns = createProductColumns({
    handleStatusChange,
    handleDelete,
    showEdit: false,
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
    <SuperAdminSidebarLayout breadcrumbTitle={copy.title}>
      <h1 className="text-2xl font-bold">{copy.title}</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        {copy.description}
      </p>

      <div className="w-full">
        {/* Top Controls */}
        <div className="flex items-center justify-between py-4">
          <Input
            type="text"
            placeholder={copy.searchByName}
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(event: any) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          <div className="flex items-center gap-3">
          

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
                      onCheckedChange={(value: any) =>
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
    </SuperAdminSidebarLayout>
  );
}
