"use client";
"use no memo";
import { useState, useEffect } from "react";
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable,
  useReactTable,
  type VisibilityState,
  flexRender,
} from "@tanstack/react-table";
import Image from "next/image";

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
import toast from "react-hot-toast";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import {
  useGetAllClassificationsQuery,
  useAddClassificationMutation,
  useDeleteClassificationMutation,
  useUpdateClassificationMutation,
} from "@/Redux/Services/ClassificationApi";
import { Classification } from "@/lib/DatabaseTypes";

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

const superAdminProductCategoriesCopy: Record<
  Language,
  Record<string, string>
> = {
  en: {
    breadcrumb: "Products Categories",
    title: "Categories",
    description: "View and organize all categories.",
    img: "Image",
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
    editDescription: "Edit category. Click save when done.",
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
    breadcrumb: "Categories produits",
    title: "Categories",
    description: "Afficher et organiser toutes les categories.",
    img: "Image",
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
    breadcrumb: "فئات المنتجات",
    title: "الفئات",
    description: "عرض وتنظيم جميع الفئات.",
    img: "الصورة",
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

export default function SuperAdminCategories() {
  const { language, t } = useI18n();
  const copy = superAdminProductCategoriesCopy[language];
  const { data: categoriesData, isLoading } = useGetAllClassificationsQuery();
  const [data, setData] = useState<Classification[]>([]);

  useEffect(() => {
    if (categoriesData?.content) {
      setData(
        categoriesData.content.map((category) => ({
          ...category,
          desc: category.desc ?? null,
        })),
      );
    }
  }, [categoriesData]);
  const [editMode, setEditMode] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<Classification | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [open, setOpen] = useState(false);

  const [deleteCategory] = useDeleteClassificationMutation();
  const [createCategory] = useAddClassificationMutation();
  const [updateCategory] = useUpdateClassificationMutation();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageFile(null);
    setImagePreview("");
    setSelectedCategory(null);
    setEditMode(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5MB or smaller.");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview((reader.result as string) || "");
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", title);
      formData.append("desc", description);

      if (imageFile) {
        formData.append("img", imageFile);
      }

      const newCategory = await createCategory({ body: formData }).unwrap();
      setData((prev) => [
        ...prev,
        { ...newCategory, desc: newCategory.desc ?? null },
      ]);
      toast.success(copy.created);
      setOpen(false);
      resetForm();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || copy.updateFailed);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCategory) return;

    try {
      const formData = new FormData();
      formData.append("name", title);
      formData.append("desc", description);

      if (imageFile) {
        formData.append("img", imageFile);
      }

      const updatedCategory = await updateCategory({
        id: selectedCategory.id,
        body: formData,
      }).unwrap();

      setData((prev) =>
        prev.map((category) =>
          category.id === selectedCategory.id
            ? {
                ...category,
                ...updatedCategory,
                desc: updatedCategory.desc ?? null,
              }
            : category,
        ),
      );
      resetForm();

      toast.success(copy.updated);
      setEditSheetOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || copy.updateFailed);
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId).unwrap();
      setData((prev) => prev.filter((c) => c.id !== categoryId));
      toast.success(copy.deleted);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || copy.deleteFailed);
    }
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = [
    {
      id: "select",
      header: ({ table }: { table: TanstackTable<Classification> }) => (
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
      cell: ({ row }: { row: Row<Classification> }) => (
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
      accessorKey: "img",
      header: copy.img,
      cell: ({ row }: { row: Row<Classification> }) => (
        <Image
          width={48}
          height={48}
          className="w-12 h-12 object-cover rounded"
          src={row.getValue("img")}
          alt="category img"
        />
      ),
    },

    {
      accessorKey: "name",
      header: copy.name,
      cell: ({ row }: { row: Row<Classification> }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "desc",
      header: copy.desc,
      cell: ({ row }: { row: Row<Classification> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue("desc")}
        </div>
      ),
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<Classification> }) => {
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
                inset
                onClick={() => {
                  setSelectedCategory(category);
                  setTitle(category.name);
                  setDescription(category.desc ?? "");
                  setEditMode(true);
                  setEditSheetOpen(true);
                }}
              >
                {copy.edit}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                inset
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
          <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
              setOpen(nextOpen);
              if (!nextOpen) {
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="primary"
                size="lg"
                className=""
                onClick={() => {
                  resetForm();
                }}
              >
                {copy.createNew}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
              <form onSubmit={handleCreate}>
                <DialogHeader className="">
                  <DialogTitle className="">
                    {editMode ? copy.editCategory : copy.createCategory}
                  </DialogTitle>
                  <DialogDescription className="mb-3">
                    {editMode ? copy.editDescription : copy.createDescription}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label className="" htmlFor="img">
                      {copy.img}
                    </Label>
                    <Input
                      id="img"
                      name="img"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {(imagePreview || selectedCategory?.img) && (
                      <img
                        src={imagePreview || selectedCategory?.img || ""}
                        alt={title || copy.img}
                        className="h-28 w-28 rounded-md border object-cover"
                      />
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Label className="" htmlFor="title">
                      {copy.name}
                    </Label>
                    <Input
                      id="title"
                      name="title"
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

        <Sheet
          open={editSheetOpen}
          onOpenChange={(nextOpen) => {
            setEditSheetOpen(nextOpen);
            if (!nextOpen) {
              resetForm();
            }
          }}
        >
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
                  <Label className="" htmlFor="edit-img">
                    {copy.img}
                  </Label>
                  <Input
                    id="edit-img"
                    name="edit-img"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {(imagePreview || selectedCategory?.img) && (
                    <img
                      src={imagePreview || selectedCategory?.img || ""}
                      alt={title || copy.img}
                      className="h-28 w-28 rounded-md border object-cover"
                    />
                  )}
                </div>
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
