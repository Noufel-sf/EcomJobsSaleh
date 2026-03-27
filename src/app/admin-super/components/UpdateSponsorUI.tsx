"use client";
import React, { useEffect, useState } from "react";
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
// import { useUpdateSponsorMutation } from "@/Redux/Services/SponsorApi";
import toast from "react-hot-toast";
import { Sponsor } from "@/lib/DatabaseTypes";
import Image from "next/image";
import { type Language, useI18n } from "@/context/I18nContext";

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
  sponsor: Sponsor | null;
  onUpdated: (updated: Sponsor) => void;
}

export default function UpdateSponsorUi({
  open,
  onOpenChange,
  sponsor,
  onUpdated,
}: UpdateSponsorUiProps) {
  const { language } = useI18n();
  const copy = updateSponsorCopy[language];
  const [imgUrl, setImgUrl] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [ownerId, setOwnerId] = useState("");

//   const [updateSponsor, { isLoading }] = useUpdateSponsorMutation();

  // Populate form when a sponsor is selected
  useEffect(() => {
    if (sponsor) {
      setImgUrl(sponsor.img || "");
      setLink(sponsor.link || "");
      setDescription(sponsor.description || "");
      setIsActive(sponsor.isActive ?? true);
      setOwnerId(sponsor.ownerId || "");
    }
  }, [sponsor]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sponsor) return;

    try {
      const updated = await updateSponsor({
        id: sponsor.id,
        img: imgUrl,
        link,
        description,
        isActive,
        ownerId,
      }).unwrap();

      onUpdated(updated);
      toast.success(copy.updated);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || copy.updateFailed);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="">
        <form onSubmit={handleUpdate}>
          <SheetHeader>
            <SheetTitle>{copy.editTitle}</SheetTitle>
            <SheetDescription>
              {copy.editDescription}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-4 px-6">
            {/* Image URL */}
            <div className="grid gap-3">
              <Label htmlFor="edit-img">{copy.imageUrl}</Label>
              <Input
                id="edit-img"
                placeholder="https://example.com/logo.png"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                required
              />
              {imgUrl && (
                <div className="flex items-center justify-center h-20 w-full rounded-md border bg-muted overflow-hidden">
                  <Image
                    src={imgUrl}
                    alt={copy.sponsorPreviewAlt}
                    className="h-full object-contain"
                    width={120}
                    height={40}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Link */}
            <div className="grid gap-3">
              <Label htmlFor="edit-link">{copy.sponsorLink}</Label>
              <Input
                id="edit-link"
                placeholder="https://sponsor-website.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
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
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Owner ID */}
            <div className="grid gap-3">
              <Label htmlFor="edit-ownerId">{copy.ownerId}</Label>
              <Input
                id="edit-ownerId"
                placeholder={copy.ownerPlaceholder}
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                required
              />
            </div>

            {/* isActive toggle */}
            <div className="flex items-center gap-3 py-1">
              <Checkbox
                id="edit-isActive"
                checked={isActive}
                onCheckedChange={(val) => setIsActive(!!val)}
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
            {/* {isLoading ? (
              <ButtonLoading />
            ) : ( */}
              <Button type="submit" size="lg" variant="primary">
                {copy.save}
              </Button>
            {/* )} */}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}