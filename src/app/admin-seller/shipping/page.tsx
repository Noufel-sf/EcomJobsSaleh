"use client";

import { useState, useMemo, useEffect } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronDown,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  Edit,
  AlertCircle,
} from "lucide-react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import toast from "react-hot-toast";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import {
  useGetAllShippingSellerStatesQuery,
  useUpdateShippingsMutation,
  ShippingState,
} from "@/Redux/Services/ShippingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Language, useI18n } from "@/context/I18nContext";

const shippingCopy: Record<Language, Record<string, string>> = {
  en: {
    active: "Active",
    inactive: "Inactive",
    changeStatus: "Change Status",
    title: "Shipping States",
    subtitle: "View and track all shipping states.",
    save: "Save Changes",
    saving: "Saving...",
    noStates: "No states found.",
    localPriceUpdated: "Price updated locally",
    allUpdated: "All states updated successfully!",
    updateFailed: "Update failed",
    code: "Code",
    stateName: "State Name",
    price: "Shipping Price",
    status: "Status",
    actions: "Actions",
    editPrice: "Edit Price",
  },
  fr: {
    active: "Actif",
    inactive: "Inactif",
    changeStatus: "Changer le statut",
    title: "Wilayas de livraison",
    subtitle: "Consultez et suivez tous les etats de livraison.",
    save: "Enregistrer",
    saving: "Enregistrement...",
    noStates: "Aucun etat trouve.",
    localPriceUpdated: "Prix mis a jour localement",
    allUpdated: "Tous les etats ont ete mis a jour !",
    updateFailed: "Echec de mise a jour",
    code: "Code",
    stateName: "Nom de la wilaya",
    price: "Prix de livraison",
    status: "Statut",
    actions: "Actions",
    editPrice: "Modifier le prix",
  },
  ar: {
    active: "نشط",
    inactive: "غير نشط",
    changeStatus: "تغيير الحالة",
    title: "ولايات الشحن",
    subtitle: "عرض وتتبع جميع حالات الشحن.",
    save: "حفظ التغييرات",
    saving: "جار الحفظ...",
    noStates: "لا توجد ولايات.",
    localPriceUpdated: "تم تحديث السعر محليا",
    allUpdated: "تم تحديث جميع الولايات بنجاح!",
    updateFailed: "فشل التحديث",
    code: "الرمز",
    stateName: "اسم الولاية",
    price: "سعر الشحن",
    status: "الحالة",
    actions: "الاجراءات",
    editPrice: "تعديل السعر",
  },
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400";
    case "Inactive":
      return "bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-400";
    default:
      return "";
  }
};

export default function ShippingManagement() {
  const { language } = useI18n();
  const copy = shippingCopy[language];
  const ownerId = "019c52df-1e7a-7006-ac12-aa2be28f77b4";

  const { data: statesData, isLoading } =
    useGetAllShippingSellerStatesQuery(ownerId);

  const [updatePrice, { isLoading: isUpdating }] = useUpdateShippingsMutation();

  // 🔥 Editable Local State
  const [editableStates, setEditableStates] = useState<ShippingState[]>([]);

  useEffect(() => {
    if (statesData) {
      setEditableStates(statesData);
    }
  }, [statesData]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<ShippingState | null>(
    null,
  );
  const [priceInput, setPriceInput] = useState("");

  const statistics = useMemo(() => {
    const total = editableStates.length;
    const active = editableStates.filter((s) => s.available).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [editableStates]);

  // 🔥 Update price locally
  const handleUpdatePrice = (e: React.FormEvent) => {
    e.preventDefault();

    setEditableStates((prev) =>
      prev.map((s) =>
        s.id === selectedState?.id
          ? { ...s, price: parseFloat(priceInput) }
          : s,
      ),
    );

    toast.success(copy.localPriceUpdated);

    setEditDialogOpen(false);
    setPriceInput("");
    setSelectedState(null);
  };

  // 🔥 Save ALL states to backend
  const handleUpdateStates = async () => {
    try {
      const payload = editableStates.map((state) => ({
        stateID: state.id,
        price: state.price,
        available: state.availavle,
      }));

      await updatePrice({
        ownerId,
        payload,
      }).unwrap();

      toast.success(copy.allUpdated);
    } catch (error: any) {
      toast.error(error?.data?.message || copy.updateFailed);
    }
  };

  const columns = [
    {
      id: "select",
      header: ({ table }: any) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          className="cursor-pointer"
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          className="cursor-pointer"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: copy.code,
    },
    {
      accessorKey: "name",
      header: copy.stateName,
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.nameAr}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: copy.price,
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-green-600">
            {row.original.price.toFixed(2)} DA
          </span>
        </div>
      ),
    },
    {
      accessorKey: "availavle",
      header: copy.status,
      cell: ({ row }: any) => {
        const state = row.original;
        const status = state.availavle ? copy.active : copy.inactive;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="default" className="h-8 px-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(
                    status,
                  )}`}
                >
                  {status}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{copy.changeStatus}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  setEditableStates((prev) =>
                    prev.map((s) =>
                      s.id === state.id ? { ...s, availavle: true } : s,
                    ),
                  )
                }
              >
                {copy.active}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setEditableStates((prev) =>
                    prev.map((s) =>
                      s.id === state.id ? { ...s, available: false } : s,
                    ),
                  )
                }
              >
                {copy.inactive}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "actions",
      header: copy.actions,
      cell: ({ row }: any) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setSelectedState(row.original);
            setPriceInput(row.original.price.toString());
            setEditDialogOpen(true);
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          {copy.editPrice}
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: editableStates,
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
    <AdminSidebarLayout breadcrumbTitle="Shipping Management">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{copy.title}</h1>
        <p className="text-gray-700 dark:text-gray-400 mb-4">
          {copy.subtitle}
        </p>


        <div className="flex justify-end">
          <Button
            size={"lg"}
            className={""}
            variant="primary"
            onClick={handleUpdateStates}
            disabled={isUpdating}
          >
            {isUpdating ? copy.saving : copy.save}
          </Button>
        </div>

        {/* TABLE DESIGN UNTOUCHED */}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
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
                  <TableRow key={row.id}>
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
                    {copy.noStates}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* DIALOG UNTOUCHED */}

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <form onSubmit={handleUpdatePrice}>
              <DialogHeader>
                <DialogTitle>Update Shipping Price</DialogTitle>
                <DialogDescription>
                  Set the shipping price for {selectedState?.name}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <Label htmlFor="price">Shipping Price (DA)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div className="space-x-2">
          <Button
            variant="primary"
            size="lg"
            className={""}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            size="lg"
            variant="primary"
            className={""}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </AdminSidebarLayout>
  );
}
