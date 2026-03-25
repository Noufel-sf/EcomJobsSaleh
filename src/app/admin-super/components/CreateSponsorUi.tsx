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
import { ButtonLoading } from "@/components/ui/ButtonLoading";
// import { useAddSponsorMutation } from "@/Redux/Services/SponsorApi";
import toast from "react-hot-toast";
import { Sponsor } from "@/lib/DatabaseTypes";
import Image from "next/image";

interface CreateSponsorUiProps {
  onCreated: (sponsor: Sponsor) => void;
}

export default function CreateSponsorUi({ onCreated }: CreateSponsorUiProps) {
  const [open, setOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [ownerId, setOwnerId] = useState("");

//   const [createSponsor, { isLoading }] = useAddSponsorMutation();

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
      const newSponsor = await createSponsor({
        img: imgUrl,
        link,
        description,
        isActive,
        ownerId,
      }).unwrap();

      onCreated(newSponsor);
      toast.success("Sponsor created successfully");
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create sponsor");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" size="lg">
          Add New Sponsor
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleCreate}>
          <DialogHeader>
            <DialogTitle>Create Sponsor</DialogTitle>
            <DialogDescription className="mb-3">
              Fill in the sponsor details. Click save when you are done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Image URL */}
            <div className="grid gap-3">
              <Label htmlFor="img">Image URL</Label>
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
                    alt="Preview"
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
              <Label htmlFor="link">Sponsor Link</Label>
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
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Short description of the sponsor"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Owner ID */}
            <div className="grid gap-3">
              <Label htmlFor="ownerId">Owner ID</Label>
              <Input
                id="ownerId"
                name="ownerId"
                placeholder="User or organization ID"
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
                onCheckedChange={(val) => setIsActive(!!val)}
                className="cursor-pointer"
              />
              <Label htmlFor="isActive" className="cursor-pointer font-normal">
                Active (visible to users)
              </Label>
            </div>
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline" size="lg" type="button" onClick={resetForm}>
                Cancel
              </Button>
            </DialogClose>
            {/* {isLoading ? (
              <ButtonLoading /> */}
            {/* ) : ( */}
              <Button type="submit" variant="primary" size="lg">
                Save changes
              </Button>
            {/* )} */}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}