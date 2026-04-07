"use client";
import React, { useEffect, useState, type ChangeEvent } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import { useUpdateSponsorMutation } from "@/Redux/Services/SponsorApi";
import toast from "react-hot-toast";
import Image from "next/image";
import { type Language, useI18n } from "@/context/I18nContext";

type SponsorSheetModel = {
  id?: string;
  _id?: string;
  image?: string;
  sponsorLink?: string;
  description?: string | null;
  isActive?: boolean;
  ownerId?: string;
};

const updateSponsorCopy: Record<Language, Record<string, string>> = {
  en: {
    updated: "Sponsor updated successfully",
    updateFailed: "Failed to update sponsor",
    editTitle: "Edit Sponsor",
    editDescription: "Update sponsor details. Click save when done.",
    imageUrl: "Image URL",
    sponsorPreviewAlt: "Sponsor preview",
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
    updated: "Sponsor mis a jour avec succes",
    updateFailed: "Echec de mise a jour du sponsor",
    editTitle: "Modifier le sponsor",
    editDescription: "Mettez a jour les details puis enregistrez.",
    imageUrl: "URL de l'image",
    sponsorPreviewAlt: "Apercu du sponsor",
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
    updated: "تم تحديث الراعي بنجاح",
    updateFailed: "فشل تحديث الراعي",
    editTitle: "تعديل الراعي",
    editDescription: "قم بتحديث التفاصيل ثم اضغط حفظ.",
    imageUrl: "رابط الصورة",
    sponsorPreviewAlt: "معاينة الراعي",
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

interface UpdateSponsorUiProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sponsor: SponsorSheetModel | null;
}

export default function UpdateSponsorUi({
  open,
  onOpenChange,
  sponsor,
}: UpdateSponsorUiProps) {
  const { language } = useI18n();
  const copy = updateSponsorCopy[language];
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(sponsor?.image || "");
  const [link, setLink] = useState(sponsor?.sponsorLink || "");
  const [description, setDescription] = useState(sponsor?.description || "");
  const [isActive, setIsActive] = useState(sponsor?.isActive ?? true);
  const [ownerId, setOwnerId] = useState(sponsor?.ownerId || "");

  const [updateSponsor, { isLoading }] = useUpdateSponsorMutation();

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      return;
    }

    setImagePreview(sponsor?.image || "");
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sponsor) return;

    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("sponsorLink", link);
    formData.append("isActive", String(isActive));
    if (description.trim()) formData.append("description", description.trim());
    if (ownerId.trim()) formData.append("ownerId", ownerId.trim());

    try {
      await updateSponsor({
        id: sponsor.id || sponsor._id || "",
        body: formData,
      }).unwrap();

      toast.success(copy.updated);
      onOpenChange(false);
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message === "string"
          ? (error as { data: { message: string } }).data.message
          : copy.updateFailed;
      toast.error(message);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="">
        <form onSubmit={handleUpdate}>
          <SheetHeader className="">
            <SheetTitle className="">{copy.editTitle}</SheetTitle>
            <SheetDescription className="">
              {copy.editDescription}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-4 px-6">
            {/* Image URL */}
            <div className="grid gap-3">
              <Label htmlFor="edit-img">{copy.imageUrl}</Label>
              <Input
                id="edit-img"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <div className="flex items-center justify-center h-20 w-full rounded-md border bg-muted overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt={copy.sponsorPreviewAlt}
                    width={240}
                    height={80}
                    unoptimized
                    className="h-full w-full object-contain p-2"
                  />
                </div>
              ) : null}
            </div>

            {/* Link */}
            <div className="grid gap-3">
              <Label htmlFor="edit-link">{copy.sponsorLink}</Label>
              <Input
                id="edit-link"
                placeholder="https://sponsor-website.com"
                value={link}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-3">
              <Label htmlFor="edit-description">{copy.description}</Label>
              <Input
                id="edit-description"
                placeholder={copy.descriptionPlaceholder}
                value={description}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
              />
            </div>

            {/* Owner ID */}
            <div className="grid gap-3">
              <Label htmlFor="edit-ownerId">{copy.ownerId}</Label>
              <Input
                id="edit-ownerId"
                placeholder={copy.ownerPlaceholder}
                value={ownerId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOwnerId(e.target.value)}
                required
              />
            </div>

            {/* isActive toggle */}
            <div className="flex items-center gap-3 py-1">
              <Checkbox
                id="edit-isActive"
                checked={isActive}
                onCheckedChange={(val: boolean | "indeterminate") => setIsActive(!!val)}
                className="cursor-pointer"
              />
              <Label
                htmlFor="edit-isActive"
                className="cursor-pointer font-normal"
              >
                {copy.activeLabel}
              </Label>
            </div>
          </div>

          <SheetFooter className="space-y-2">
            <SheetClose asChild>
              <Button variant="outline" type="button">
                {copy.cancel}
              </Button>
            </SheetClose>
            {isLoading ? (
              <ButtonLoading />
            ) : (
              <Button type="submit" size="lg" variant="primary">
                {copy.save}
              </Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}