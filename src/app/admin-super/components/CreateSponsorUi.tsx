"use client";
import React, { useState } from "react";
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
import type { CheckedState } from "@radix-ui/react-checkbox";
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
    imageUrl: "Image URL",
    previewAlt: "Preview",
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
    imageUrl: "URL de l'image",
    previewAlt: "Apercu",
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
    imageUrl: "رابط الصورة",
    previewAlt: "معاينة",
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

export default function CreateSponsorUi() {
  const { language } = useI18n();
  const copy = createSponsorCopy[language];
  const [open, setOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [ownerId, setOwnerId] = useState("");

  const [createSponsor] = useCreateSponsorMutation();

  const resetForm = () => {
    setImgUrl("");
    setLink("");
    setDescription("");
    setIsActive(true);
    setOwnerId("");
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData() ; 
      formData.append("image",imgUrl);
      formData.append("sponsorLink",link);
      formData.append("description",description);
      formData.append("isActive",isActive.toString());
      formData.append("ownerId",ownerId);
      await createSponsor(formData).unwrap();

      toast.success(copy.created);
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || copy.createFailed);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" size="lg">
          {copy.addNew}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleCreate}>
          <DialogHeader>
            <DialogTitle>{copy.createTitle}</DialogTitle>
            <DialogDescription className="mb-3">
              {copy.createDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Image URL */}
            <div className="grid gap-3">
              <Label htmlFor="img">{copy.imageUrl}</Label>
              <Input
                id="img"
                name="img"
                placeholder="https://example.com/logo.png"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                required
              />
              {imgUrl && (
                <div className="flex items-center justify-center h-20 w-full rounded-md border bg-muted overflow-hidden">
                  <Image
                    src={imgUrl}
                    alt={copy.previewAlt}
                    width={240}
                    height={80}
                    unoptimized
                    className="h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Link */}
            <div className="grid gap-3">
              <Label htmlFor="link">{copy.sponsorLink}</Label>
              <Input
                id="link"
                name="link"
                placeholder="https://sponsor-website.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-3">
              <Label htmlFor="description">{copy.description}</Label>
              <Input
                id="description"
                name="description"
                placeholder={copy.descriptionPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Owner ID */}
            <div className="grid gap-3">
              <Label htmlFor="ownerId">{copy.ownerId}</Label>
              <Input
                id="ownerId"
                name="ownerId"
                placeholder={copy.ownerPlaceholder}
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                required
              />
            </div>

            {/* isActive toggle */}
            <div className="flex items-center gap-3 py-1">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(val: CheckedState) => setIsActive(val === true)}
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
            {/* {isLoading ? (
              <ButtonLoading /> */}
            {/* ) : ( */}
              <Button type="submit" variant="primary" size="lg">
                {copy.save}
              </Button>
            {/* )} */}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}