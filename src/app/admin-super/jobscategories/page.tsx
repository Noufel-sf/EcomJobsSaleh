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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, ChevronDown } from "lucide-react";
import SuperAdminSidebarLayout from "@/components/SuperAdminSidebarLayout";
import { useAppSelector } from "@/Redux/hooks";
import toast from "react-hot-toast";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/Redux/Services/JobApi";
import { JobCategory } from "@/lib/DatabaseTypes";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AdminDataTableSkeleton from "@/components/AdminDataTableSkeleton";
import { type Language, useI18n } from "@/context/I18nContext";

const superAdminJobCategoriesCopy: Record<Language, Record<string, string>> = {
  en: {
    breadcrumb: "Jobs Categories",
    title: "Jobs Categories",
    description: "View and organize all job categories.",
    created: "Category created successfully",
    updated: "Category updated successfully",
    deleted: "Category deleted successfully",
    updateFailed: "Failed to update category",
    deleteFailed: "Failed to delete category",
    selectAll: "Select all",
    selectRow: "Select row",
    name: "Name",
    desc: "Description",
    openMenu: "Open menu",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    createNew: "Create a new category",
    createCategory: "Create Category",
    editCategory: "Edit Category",
    createDescription: "Create a new category. Click save when you are done.",
    editDescription: "Edit category. Click save when you are done.",
    cancel: "Cancel",
    saveChanges: "Save changes",
    columns: "Columns",
    noResults: "No results.",
    selectedRows: "{selected} of {total} row(s) selected.",
    previous: "Previous",
    next: "Next",
    titleLabel: "Title",
  },
  fr: {
    breadcrumb: "Categories emplois",
    title: "Categories emplois",
    description: "Afficher et organiser toutes les categories d'emploi.",
    created: "Categorie creee avec succes",
    updated: "Categorie mise a jour avec succes",
    deleted: "Categorie supprimee avec succes",
    updateFailed: "Echec de mise a jour de la categorie",
    deleteFailed: "Echec de suppression de la categorie",
    selectAll: "Tout selectionner",
    selectRow: "Selectionner la ligne",
    name: "Nom",
    desc: "Description",
    openMenu: "Ouvrir le menu",
    actions: "Actions",
    edit: "Modifier",
    delete: "Supprimer",
    createNew: "Creer une nouvelle categorie",
    createCategory: "Creer une categorie",
    editCategory: "Modifier la categorie",
    createDescription: "Creez une categorie puis cliquez sur enregistrer.",
    editDescription: "Modifiez la categorie puis cliquez sur enregistrer.",
    cancel: "Annuler",
    saveChanges: "Enregistrer",
    columns: "Colonnes",
    noResults: "Aucun resultat.",
    selectedRows: "{selected} sur {total} ligne(s) selectionnee(s).",
    previous: "Precedent",
    next: "Suivant",
    titleLabel: "Titre",
  },
  ar: {
    breadcrumb: "فئات الوظائف",
    title: "فئات الوظائف",
    description: "عرض وتنظيم جميع فئات الوظائف.",
    created: "تم انشاء الفئة بنجاح",
    updated: "تم تحديث الفئة بنجاح",
    deleted: "تم حذف الفئة بنجاح",
    updateFailed: "فشل تحديث الفئة",
    deleteFailed: "فشل حذف الفئة",
    selectAll: "تحديد الكل",
    selectRow: "تحديد الصف",
    name: "الاسم",
    desc: "الوصف",
    openMenu: "فتح القائمة",
    actions: "الاجراءات",
    edit: "تعديل",
    delete: "حذف",
    createNew: "انشاء فئة جديدة",
    createCategory: "انشاء فئة",
    editCategory: "تعديل الفئة",
    createDescription: "انشئ فئة جديدة ثم اضغط حفظ.",
    editDescription: "عدّل الفئة ثم اضغط حفظ.",
    cancel: "الغاء",
    saveChanges: "حفظ التغييرات",
    columns: "الاعمدة",
    noResults: "لا توجد نتائج.",
    selectedRows: "تم تحديد {selected} من {total} صف.",
    previous: "السابق",
    next: "التالي",
    titleLabel: "العنوان",
  },
};

export default function SuperAdminJobsCategories() {
  const { language, t } = useI18n();
  const copy = superAdminJobCategoriesCopy[language];
  const { data: categoriesData, isLoading } = useGetAllCategoriesQuery();
  const categories = categoriesData?.content || [];

  useEffect(() => {
    if (categoriesData?.content) {
      setData(categoriesData.content);
    }
  }, [categoriesData]);

  const [data, setData] = useState(categories);
  const [editMode, setEditMode] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | null>(
    null,
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  const [deleteCategory] = useDeleteCategoryMutation();
  const [createCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newCategory = await createCategory({
        categories: title,
        description: description,
      }).unwrap();
      setData((prev) => [...prev, newCategory]);
      toast.success(copy.created);
      setOpen(false);
      setTitle("");
      setDescription("");
    } catch (error: unknown) {
      toast.error(error?.data?.message);
    }
  };

  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
    id: string,
  ) => {
    e.preventDefault();
    if (!selectedCategory) return;

    try {
      const updated = await updateCategory({
        id: selectedCategory.id,
        categories: title,
        description: description,
      }).unwrap();

      setData((prev) =>
        prev.map((category) =>
          category.id === id ? { ...category, ...updated } : category,
        ),
      );
      setTitle("");
      setDescription("");

      toast.success(copy.updated);
      setSelectedCategory(null);
      setEditSheetOpen(false);
      setEditMode(false);
    } catch (error: any) {
      toast.error(error?.data?.message || copy.updateFailed);
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId).unwrap();
      setData((prev) => prev.filter((c) => c.id !== categoryId));
      toast.success(copy.deleted);
    } catch (error: any) {
      toast.error(error?.data?.message || copy.deleteFailed);
    }
  };

  const user = useAppSelector((state) => state.auth.user);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

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
      accessorKey: "categories",
      header: copy.name,
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("categories")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: copy.desc,
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue("description") || "-"}
        </div>
      ),
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const category = row.original;
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
            <DropdownMenuContent className={""} align="end">
              <DropdownMenuLabel>{copy.actions}</DropdownMenuLabel>
              <DropdownMenuSeparator className={""} />
              <DropdownMenuItem
                className="cursor-pointer"
                inset=""
                onClick={() => {
                  setSelectedCategory(category);
                  setTitle(category.categories);
                  setDescription(category.description || "");
                  setEditMode(true);
                  setEditSheetOpen(true);
                }}
              >
                {copy.edit}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                inset=""
                onClick={() => handleDelete(category.id)}
              >
                {copy.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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

  return (
    <SuperAdminSidebarLayout breadcrumbTitle={copy.breadcrumb}>
      <h1 className="text-2xl font-bold">{copy.title}</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        {copy.description}
      </p>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" size="lg" className="">
                {copy.createNew}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleCreate}>
                <DialogHeader className="">
                  <DialogTitle className="">
                    {editMode ? copy.editCategory : copy.createCategory}
                  </DialogTitle>
                  <DialogDescription className="mb-3">
                    {editMode
                      ? copy.editDescription
                      : copy.createDescription}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label className="" htmlFor="categories">
                      {copy.name}
                    </Label>
                    <Input
                      id="categories"
                      name="categories"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">{copy.desc}</Label>
                    <Input
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-5">
                  <DialogClose asChild>
                    <Button variant="outline" size="lg">
                      {copy.cancel}
                    </Button>
                  </DialogClose>
                  {isLoading ? (
                    <ButtonLoading />
                  ) : (
                    <Button
                      type="submit"
                      className={""}
                      variant="primary"
                      size="lg"
                    >
                      {copy.saveChanges}
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
            <DropdownMenuContent className="" align="end">
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

        <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
          <SheetContent className="">
            <form onSubmit={handleUpdate}>
              <SheetHeader className="">
                <SheetTitle className="">{copy.editCategory}</SheetTitle>
                <SheetDescription className="">
                  {copy.editDescription}
                </SheetDescription>
              </SheetHeader>

              <div className="grid gap-4 py-4 px-6">
                <div className="grid gap-3">
                  <Label className="" htmlFor="title">
                    {copy.titleLabel}
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label className="" htmlFor="description">
                    {copy.desc}
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <SheetFooter className="space-y-2">
                <SheetClose asChild>
                  <Button className="" variant="outline">
                    {copy.cancel}
                  </Button>
                </SheetClose>
                {isLoading ? (
                  <ButtonLoading />
                ) : (
                  <Button
                    className=""
                    type="submit"
                    size="lg"
                    variant="primary"
                  >
                    {copy.saveChanges}
                  </Button>
                )}
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        <div className="rounded-md border">
          <Table className="">
            <TableHeader className="">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow className="" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead className="" key={header.id}>
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
                  <TableRow
                    className=""
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="" key={cell.id}>
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
