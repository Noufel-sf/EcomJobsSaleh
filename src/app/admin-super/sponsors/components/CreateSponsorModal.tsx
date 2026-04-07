"use client";

import { useEffect, useState, type ChangeEvent } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import { useCreateSponsorMutation } from "@/Redux/Services/SponsorApi";
import toast from "react-hot-toast";
import Image from "next/image";
import { type Language, useI18n } from "@/context/I18nContext";


const createSponsorCopy: Record<Language, Record<string, string>> = {
  en: {
    created: "Sponsor created successfully",
    createFailed: "Failed to create sponsor",
    addNew: "Add New Sponsor",
    createTitle: "Create Sponsor",
    createDescription: "Fill in the sponsor details. Click save when you are done.",
    name: "Name",
    namePlaceholder: "Sponsor name",
    imageUrl: "Image URL",
    sponsorLink: "Sponsor Link",
    description: "Description",
    descriptionPlaceholder: "Short description of the sponsor",
    ownerId: "Owner ID",
    ownerPlaceholder: "User or organization ID",
    activeLabel: "Active (visible to users)",
    cancel: "Cancel",
    save: "Save changes",
  },
  fr: {
    created: "Sponsor cree avec succes",
    createFailed: "Echec de creation du sponsor",
    addNew: "Ajouter un sponsor",
    createTitle: "Creer un sponsor",
    createDescription: "Renseignez les details du sponsor puis enregistrez.",
    name: "Nom",
    namePlaceholder: "Nom du sponsor",
    imageUrl: "URL de l'image",
    sponsorLink: "Lien du sponsor",
    description: "Description",
    descriptionPlaceholder: "Courte description du sponsor",
    ownerId: "ID proprietaire",
    ownerPlaceholder: "ID utilisateur ou organisation",
    activeLabel: "Actif (visible pour les utilisateurs)",
    cancel: "Annuler",
    save: "Enregistrer",
  },
  ar: {
    created: "تم انشاء الراعي بنجاح",
    createFailed: "فشل انشاء الراعي",
    addNew: "اضافة راع جديد",
    createTitle: "انشاء راع",
    createDescription: "املأ تفاصيل الراعي ثم اضغط حفظ.",
    name: "الاسم",
    namePlaceholder: "اسم الراعي",
    imageUrl: "رابط الصورة",
    sponsorLink: "رابط الراعي",
    description: "الوصف",
    descriptionPlaceholder: "وصف قصير للراعي",
    ownerId: "معرف المالك",
    ownerPlaceholder: "معرف المستخدم او المؤسسة",
    activeLabel: "نشط (مرئي للمستخدمين)",
    cancel: "الغاء",
    save: "حفظ التغييرات",
  },
};


export default function CreateSponsorModal() {
  const { language } = useI18n();
  const copy = createSponsorCopy[language];
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [sponsorLink, setSponsorLink] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [createSponsor, { isLoading }] = useCreateSponsorMutation();

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleActiveChange = (checked: boolean | "indeterminate") => {
    setIsActive(!!checked);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview("");
    }
  };

  const resetForm = () => {
    setName("");
    setImageFile(null);
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview("");
    setSponsorLink("");
    setDescription("");
    setIsActive(true);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", imageFile);
    formData.append("sponsorLink", sponsorLink);
    formData.append("isActive", String(isActive));
    if (description.trim()) formData.append("description", description.trim());

    try {
       await createSponsor(formData).unwrap();
      toast.success(copy.created);
      setOpen(false);
      resetForm();
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message === "string"
          ? (error as { data: { message: string } }).data.message
          : copy.createFailed;
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" size="lg">
          {copy.addNew}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-120">
        <form onSubmit={handleCreate}>
          <DialogHeader>
            <DialogTitle>{copy.createTitle}</DialogTitle>
            <DialogDescription className="mb-3">{copy.createDescription}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">{copy.name}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                placeholder={copy.namePlaceholder}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="image">{copy.imageUrl}</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {imagePreview ? (
                <div className="flex items-center justify-center h-20 w-full rounded-md border bg-muted overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={240}
                    height={80}
                    unoptimized
                    className="h-full w-full object-contain p-2"
                  />
                </div>
              ) : null}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="sponsorLink">{copy.sponsorLink}</Label>
              <Input
                id="sponsorLink"
                value={sponsorLink}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSponsorLink(e.target.value)
                }
                placeholder="https://sponsor-website.com"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">{copy.description}</Label>
              <Input
                id="description"
                value={description}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDescription(e.target.value)
                }
                placeholder={copy.descriptionPlaceholder}
              />
            </div>

        
            <div className="flex items-center gap-3 py-1">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={handleActiveChange}
                className="cursor-pointer"
              />
              <Label htmlFor="isActive" className="cursor-pointer font-normal">
                {copy.activeLabel}
              </Label>
            </div>
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline" size="lg" type="button" onClick={resetForm}>
                {copy.cancel}
              </Button>
            </DialogClose>
            {isLoading ? (
              <ButtonLoading />
            ) : (
              <Button type="submit" variant="primary" size="lg">
                {copy.save}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
