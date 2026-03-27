'use client';

import { useState } from "react";
import { useGetSellerOrdersQuery,useUpdateOrderStatusMutation, useDeleteOrderMutation } from "@/Redux/Services/OrderApi";

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
import { ChevronDown, Download } from "lucide-react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import toast from "react-hot-toast";
import { getColumns } from "@/components/AdminOrderRow";
import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import type { Order } from "@/lib/DatabaseTypes";
import { type Language, useI18n } from "@/context/I18nContext";

const ordersCopy: Record<Language, Record<string, string>> = {
  en: {
    title: "Orders",
    subtitle: "View and track all user orders.",
    searchPlaceholder: "Search by first name...",
    export: "Export to CSV",
    columns: "Columns",
    noResults: "No results.",
    selectedRows: "{selected} of {total} row(s) selected.",
    previous: "Previous",
    next: "Next",
    updated: "Order status updated successfully",
    updateFailed: "Failed to update status",
    deleted: "Order deleted successfully",
    deleteFailed: "Failed to delete order",
    noDataExport: "No data to export",
    exported: "Orders exported successfully!",
    exportFailed: "Failed to export orders",
  },
  fr: {
    title: "Commandes",
    subtitle: "Consultez et suivez toutes les commandes utilisateurs.",
    searchPlaceholder: "Rechercher par prenom...",
    export: "Exporter en CSV",
    columns: "Colonnes",
    noResults: "Aucun resultat.",
    selectedRows: "{selected} sur {total} ligne(s) selectionnee(s).",
    previous: "Precedent",
    next: "Suivant",
    updated: "Statut de commande mis a jour",
    updateFailed: "Echec de mise a jour du statut",
    deleted: "Commande supprimee",
    deleteFailed: "Echec de suppression de commande",
    noDataExport: "Aucune donnee a exporter",
    exported: "Commandes exportees avec succes !",
    exportFailed: "Echec de l'export des commandes",
  },
  ar: {
    title: "الطلبات",
    subtitle: "عرض وتتبع جميع طلبات المستخدمين.",
    searchPlaceholder: "ابحث بالاسم الاول...",
    export: "تصدير CSV",
    columns: "الاعمدة",
    noResults: "لا توجد نتائج.",
    selectedRows: "تم تحديد {selected} من {total} صف.",
    previous: "السابق",
    next: "التالي",
    updated: "تم تحديث حالة الطلب بنجاح",
    updateFailed: "فشل تحديث الحالة",
    deleted: "تم حذف الطلب بنجاح",
    deleteFailed: "فشل حذف الطلب",
    noDataExport: "لا توجد بيانات للتصدير",
    exported: "تم تصدير الطلبات بنجاح!",
    exportFailed: "فشل تصدير الطلبات",
  },
};



export default function AdminAllOrders() {
  const { language, t } = useI18n();
  const copy = ordersCopy[language];

  const { data: ordersData, isLoading: ordersLoading } = useGetSellerOrdersQuery({Seller_id: "019d17a3-6d61-771a-abf9-8b588f9c6f83", size: 10});
  const orders = ordersData?.content || [];
  const [deleteOrderMutation] = useDeleteOrderMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();


  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [data, setData] = useState<Order[]>(orders);
  const [dialogOpen, setDialogOpen] = useState(false);

  

  const handleStatusChange = async (orderId: string, newStatus: string) => {

    const previousData = [...orders ];
    setData(prevData => 
      prevData.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    try {
      await updateOrderStatus({ orderId: orderId, status: newStatus }).unwrap();
      toast.success(copy.updated);
    } catch (error: any) {
      setData(previousData);
      toast.error(error?.data?.message || copy.updateFailed);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteOrderMutation(String(orderId)).unwrap();
      setData(prevData => prevData.filter(order => order.id !== orderId));
      toast.success(copy.deleted);
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || copy.deleteFailed);
    }
  }
 
  const exportToExcel = () => {
  try {
    if (!orders || orders.length === 0) {
      toast.error(copy.noDataExport);
      return;
    }

    const exportData = orders.map((order) => ({
      "Order ID": order.id,
      "Customer First Name": order.firstName || "N/A",
      "Customer Last Name": order.lastName || "N/A",
      "Phone Number": order.phoneNumber || "N/A",
      "State": order.state || "N/A",
      "City": order.city || "N/A",

      "Products Count": order.products?.length || 0,

      "Products": order.products
        ?.map(
          (item: any) =>
            `${item.product?.name || "Unknown"} (x${item.prodNb}) - Size: ${
              item.size || "-"
            } - Color: ${item.color || "-"}`
        )
        .join(" | ") || "N/A",

      "Products Cost": `${order.productsCost?.toFixed(2) || "0.00"} DA`,
      "Delivery Cost": `${order.deliveryCost?.toFixed(2) || "0.00"} DA`,
      "Total Cost": `${order.totalCost?.toFixed(2) || "0.00"} DA`,

      "Status":
        order.status?.charAt(0).toUpperCase() +
          order.status?.slice(1).toLowerCase() || "N/A",
    }));

    const headers = Object.keys(exportData[0]);

    const csvContent = [
      headers.join(","),
      ...exportData.map((row: any) =>
        headers
          .map((header) => {
            const value = row[header];

            return typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `orders_export_${new Date().toISOString().split("T")[0]}.csv`
    );

    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(copy.exported);
  } catch (error) {
    toast.error(copy.exportFailed);
    console.error("Export error:", error);
  }
  };


  const [sorting, setSorting] = useState<any[]>([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<any>({});
  const [rowSelection, setRowSelection] = useState<any>({});

  const columns = getColumns({
    handleStatusChange,
    setSelectedOrder,
    setDialogOpen,
    deleteOrder,
  });

  const table = useReactTable({
    data:orders,
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
    <AdminSidebarLayout breadcrumbTitle="Orders">
      <h1 className="text-2xl font-bold">{copy.title}</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        {copy.subtitle}
      </p>
      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          <Input
            type="text"
            placeholder={copy.searchPlaceholder}
            value={table.getColumn("firstName")?.getFilterValue() ?? ""}
            onChange={(event: any) =>
              table.getColumn("firstName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm hidden md:block"
          />
          <div className="flex items-center justify-between gap-3">

          <Button 
            variant="primary" 
            size="default"
            onClick={exportToExcel}
            className="ml-auto cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4" />
            {copy.export}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="ml-auto cursor-pointer">
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
                <TableRow key={headerGroup.id} className="">
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
              {ordersLoading ? (
                <AdminDataTableSkeleton />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className=""
                  >
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
                <TableRow className="">
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

        <OrderDetailsModal
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          selectedOrder={selectedOrder}
        />

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
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="cursor-pointer"
            >
              {copy.previous}
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="cursor-pointer"
            >
              {copy.next}
            </Button>
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  );
}
