"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Store,
  User,
  Phone,
  FileText,
  Upload,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector } from "@/Redux/hooks";
import {
  useGetSellerInfoQuery,
  useUpdateSellerInfoMutation,
  useUpdateSellerImageMutation,
} from "@/Redux/Services/SellerApi";

export default function StorePage() {
  const user = useAppSelector((state) => state.auth.user);
  const sellerId = user?.userId;

  // Fetch current seller information
  const {
    data: sellerInfo,
    isLoading: isLoadingInfo,
    error,
  } = useGetSellerInfoQuery(sellerId || "", {
    skip: !sellerId,
  });

  // Mutations
  const [updateSellerInfo, { isLoading: isUpdating }] =
    useUpdateSellerInfoMutation();
  const [updateSellerImage, { isLoading: isUploadingImage }] =
    useUpdateSellerImageMutation();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    storeName: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize form data when seller info is loaded
  useEffect(() => {
    if (sellerInfo && !isInitialized) {
      setFormData({
        firstName: sellerInfo.firstName || "",
        lastName: sellerInfo.lastName || "",
        phone: sellerInfo.phone?.toString() || "",
        storeName: sellerInfo.storeName || "",
        description: sellerInfo.description || "",
      });
      
      if (sellerInfo.img) {
        setImagePreview(sellerInfo.img);
      }
      
      setIsInitialized(true);
    }
  }, [sellerInfo, isInitialized]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!sellerId) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const result = await updateSellerInfo({
        sellerId,
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          storeName: formData.storeName,
          description: formData.description,
        },
      }).unwrap();

      toast.success(result.message || "Store information updated successfully!");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message =
        err?.data?.message || "Failed to update store information";
      toast.error(message);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!imageFile || !sellerId) {
      toast.error("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const result = await updateSellerImage({
        sellerId,
        formData,
      }).unwrap();

      toast.success(result.message || "Store image updated successfully!");
      setImageFile(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message = err?.data?.message || "Failed to upload image";
      toast.error(message);
    }
  };

  if (isLoadingInfo) {
    return (
      <AdminSidebarLayout breadcrumbTitle="Store Settings">
        <div className="flex items-center justify-center min-h-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminSidebarLayout>
    );
  }

  if (error) {
    return (
      <AdminSidebarLayout breadcrumbTitle="Store Settings">
        <div className="flex flex-col items-center justify-center min-h-100 gap-4">
          <p className="text-destructive text-lg">Failed to load store information</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </AdminSidebarLayout>
    );
  }

  return (
    <AdminSidebarLayout breadcrumbTitle="Store Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Store Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your store information and branding
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Store Image Card */}
          <Card className="lg:col-span-1 gap-5">
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Store Logo
              </CardTitle>
              <CardDescription className="">
                Upload a logo for your store (Max 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Preview */}
              <div className="flex justify-center">
                <div className="relative w-40 h-40 rounded-lg border-2 border-dashed border-border overflow-hidden bg-muted flex items-center justify-center">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Store logo preview"
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Store className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">No image</p>
                    </div>
                  )}
                </div>
              </div>

              {/* File Input */}
              <div className="grid gap-2">
                <Label htmlFor="storeImage" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-accent transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Choose Image</span>
                  </div>
                </Label>
                <Input
                  id="storeImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isUploadingImage}
                />
                {imageFile && (
                  <p className="text-xs text-muted-foreground text-center">
                    {imageFile.name}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="">
              {isUploadingImage ? (
                <Button disabled className="w-full">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </Button>
              ) : (
                <Button
                  onClick={handleImageUpload}
                  disabled={!imageFile}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Store Information Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Store Information
              </CardTitle>
              <CardDescription className="">
                Update your store and personal details
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {/* Store Name */}
                <div className="grid gap-3">
                  <Label htmlFor="storeName" className="text-sm font-medium">
                    <Store className="w-4 h-4 inline mr-2" />
                    Store Name
                  </Label>
                  <Input
                    id="storeName"
                    name="storeName"
                    type="text"
                    placeholder="My Awesome Store"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    disabled={isUpdating}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be displayed to customers
                  </p>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="grid gap-3">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      <User className="w-4 h-4 inline mr-2" />
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={isUpdating}
                      required
                      className="h-11"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="grid gap-3">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      <User className="w-4 h-4 inline mr-2" />
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={isUpdating}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="grid gap-3">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isUpdating}
                    required
                    className="h-11"
                  />
                </div>

                {/* Description */}
                <div className="grid gap-3">
                  <Label htmlFor="description" className="text-sm font-medium">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Store Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Tell customers about your store..."
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isUpdating}
                    rows={5}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    A brief description of your store and what you sell (max 500
                    characters)
                  </p>
                </div>

                {/* Store Stats (Read-only) */}
                {sellerInfo && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {sellerInfo.total_orders || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Orders
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {sellerInfo.successful_orders || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Successful
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">
                        {sellerInfo.waiting_orders || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Waiting</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        ${sellerInfo.total_sales?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Sales
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (sellerInfo) {
                      setFormData({
                        firstName: sellerInfo.firstName || "",
                        lastName: sellerInfo.lastName || "",
                        phone: sellerInfo.phone?.toString() || "",
                        storeName: sellerInfo.storeName || "",
                        description: sellerInfo.description || "",
                      });
                    }
                  }}
                  disabled={isUpdating}
                >
                  Reset
                </Button>
                {isUpdating ? (
                  <Button disabled>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </Button>
                ) : (
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AdminSidebarLayout>
  );
}
