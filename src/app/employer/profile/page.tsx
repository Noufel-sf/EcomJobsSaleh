"use client";

import Image from "next/image";
import EmployerSidebarLayout from "@/components/EmployerSidebarLayout";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/Redux/hooks";
import {
  useUpdateEmployerPasswordMutation,
  useUpdateEmployerProfileMutation,
} from "@/Redux/Services/JobApi";
import {
  employerPasswordSchema,
  employerProfileSchema,
  type EmployerPasswordFormValues,
  type EmployerProfileFormValues,
} from "@/lib/zodValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type ChangeEvent } from "react";
import { Image as ImageIcon, Upload } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

type EmployerProfileFields = {
  id?: string;
  name?: string;
  logo?: string;
  description?: string;
  location?: string;
  specialization?: string;
  jobs?: Array<{ id?: string }>;
};

export default function EmployerProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const employerData = (user ?? {}) as EmployerProfileFields;
  const companyData = employerData;

  const [updateEmployerProfile, { isLoading: isSavingProfile }] =
    useUpdateEmployerProfileMutation();
  const [updateEmployerPassword, { isLoading: isSavingPassword }] =
    useUpdateEmployerPasswordMutation();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const profileForm = useForm<EmployerProfileFormValues>({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      logo: "",
      description: "",
      location: "",
      specialization: "",
    },
  });

  const passwordForm = useForm<EmployerPasswordFormValues>({
    resolver: zodResolver(employerPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const logoUrlValue = useWatch({
    control: profileForm.control,
    name: "logo",
  });

  useEffect(() => {
    if (!user) return;

    profileForm.reset({
      name: user.name ?? "",
      email: user.email ?? "",
      logo: companyData.logo ?? "",
      description: companyData.description ?? "",
      location: companyData.location ?? "",
      specialization: companyData.specialization ?? "",
    });
  }, [
    user,
    companyData.id,
    companyData.name,
    companyData.logo,
    companyData.description,
    companyData.location,
    companyData.specialization,
    profileForm,
  ]);

  const handleLogoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setLogoFile(null);
      setLogoPreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setLogoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview((reader.result as string) || "");
    };
    reader.readAsDataURL(file);
  };

  const onProfileSubmit = async (values: EmployerProfileFormValues) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("email", values.email);

      if (values.companyId) formData.append("id", values.companyId);
      if (values.companyName)
        formData.append("companyName", values.companyName);
      if (logoFile) {
        formData.append("logo", logoFile);
      } else if (values.logo) {
        formData.append("logo", values.logo);
      }
      if (values.description)
        formData.append("description", values.description);
      if (values.website) formData.append("website", values.website);
      if (values.location) formData.append("location", values.location);
      if (values.specialization) {
        formData.append("specialization", values.specialization);
        formData.append("industry", values.specialization);
      }

      await updateEmployerProfile(formData).unwrap();

      toast.success("Profile updated successfully");
      setLogoFile(null);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Failed to update employer profile", error);
    }
  };

  const onPasswordSubmit = async (values: EmployerPasswordFormValues) => {
    try {
      await updateEmployerPassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();

      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error) {
      toast.error("Failed to update password");
      console.error("Failed to update employer password", error);
    }
  };

  return (
    <EmployerSidebarLayout breadcrumbTitle="Profile">
      <h1 className="text-2xl font-bold">Employer Profile</h1>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        Manage your account, company details, and password.
      </p>

      <section className="w-full max-w-4xl">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="">
            <TabsTrigger className="" value="profile">
              Profile
            </TabsTrigger>
            <TabsTrigger className="" value="password">
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
              <Card className="">
                <CardHeader className="">
                  <CardTitle className="">Edit Profile</CardTitle>
                  <CardDescription className="">
                    Update your personal and company information.
                  </CardDescription>
                </CardHeader>

                <CardContent className="grid mt-2 grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="employer-name">Company Name</Label>
                    <Input
                      id="employer-name"
                      placeholder="Your company name"
                      {...profileForm.register("name")}
                      required
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                <div className="grid gap-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      {...profileForm.register("companyName")}
                      placeholder="Your company name"
                    />
                    {profileForm.formState.errors.companyName && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="employer-email">Email</Label>
                    <Input
                      id="employer-email"
                      type="email"
                      placeholder="you@example.com"
                      {...profileForm.register("email")}
                      required
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="company-specialization">
                      Specialization
                    </Label>
                    <Input
                      id="company-specialization"
                      {...profileForm.register("specialization")}
                      placeholder="e.g. Fintech, E-commerce"
                    />
                    {profileForm.formState.errors.specialization && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.specialization.message}
                      </p>
                    )}
                  </div>

                

                  <div className="grid gap-2 md:col-span-2">
                    <Label>Company Logo Image</Label>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="relative h-24 w-24 overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted">
                        {logoPreview || logoUrlValue || companyData.logo ? (
                          <Image
                            src={
                              logoPreview ||
                              logoUrlValue ||
                              companyData.logo ||
                              ""
                            }
                            alt="Company logo preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-6 w-6" />
                            <span className="mt-1 text-[10px]">No logo</span>
                          </div>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <Label
                          htmlFor="company-logo-file"
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-accent transition-colors">
                            <Upload className="h-4 w-4" />
                            <span>Choose Image</span>
                          </div>
                        </Label>
                        <Input
                          id="company-logo-file"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoFileChange}
                        />
                        {logoFile && (
                          <p className="text-xs text-muted-foreground">
                            {logoFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="company-location">Location</Label>
                    <Input
                      id="company-location"
                      {...profileForm.register("location")}
                      placeholder="e.g. Algiers, Algeria"
                    />
                    {profileForm.formState.errors.location && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.location.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="company-description">
                      Company Description
                    </Label>
                    <Textarea
                      id="company-description"
                      {...profileForm.register("description")}
                      rows={5}
                      placeholder="Describe your company and what you do."
                    />
                    {profileForm.formState.errors.description && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="mt-4">
                  {isSavingProfile ? (
                    <ButtonLoading />
                  ) : (
                    <Button type="submit" variant="primary" size="lg">
                      Save Changes
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="password" className="mt-4">
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
              <Card className="">
                <CardHeader className="">
                  <CardTitle className="">Change Password</CardTitle>
                  <CardDescription className="">
                    Keep your account secure by using a strong password.
                  </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4 max-w-xl">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      {...passwordForm.register("currentPassword")}
                      required
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-red-500">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      {...passwordForm.register("newPassword")}
                      required
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-red-500">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      {...passwordForm.register("confirmPassword")}
                      required
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="mt-4">
                  {isSavingPassword ? (
                    <ButtonLoading />
                  ) : (
                    <Button type="submit" variant="primary" size="lg">
                      Save Password
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      </section>
    </EmployerSidebarLayout>
  );
}
