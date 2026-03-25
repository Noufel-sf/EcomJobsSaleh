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
      toast.success("Sponsor updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update sponsor");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="">
        <form onSubmit={handleUpdate}>
          <SheetHeader>
            <SheetTitle>Edit Sponsor</SheetTitle>
            <SheetDescription>
              Update sponsor details. Click save when done.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-4 px-6">
            {/* Image URL */}
            <div className="grid gap-3">
              <Label htmlFor="edit-img">Image URL</Label>
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
                    alt="Sponsor preview"
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
              <Label htmlFor="edit-link">Sponsor Link</Label>
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
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="Short description of the sponsor"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Owner ID */}
            <div className="grid gap-3">
              <Label htmlFor="edit-ownerId">Owner ID</Label>
              <Input
                id="edit-ownerId"
                placeholder="User or organization ID"
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
                Active (visible to users)
              </Label>
            </div>
          </div>

          <SheetFooter className="space-y-2">
            <SheetClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </SheetClose>
            {/* {isLoading ? (
              <ButtonLoading />
            ) : ( */}
              <Button type="submit" size="lg" variant="primary">
                Save changes
              </Button>
            {/* )} */}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}