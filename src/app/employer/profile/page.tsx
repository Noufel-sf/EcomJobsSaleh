"use client";

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
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { updateUser } from "@/Redux/Slices/AuthSlice";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type EmployerProfileFields = {
  companyName?: string;
  description?: string;
  website?: string;
  location?: string;
  industry?: string;
};

export default function EmployerProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const employerData = (user ?? {}) as EmployerProfileFields;

  const [updateEmployerProfile, { isLoading: isSavingProfile }] =
    useUpdateEmployerProfileMutation();
  const [updateEmployerPassword, { isLoading: isSavingPassword }] =
    useUpdateEmployerPasswordMutation();

  const profileForm = useForm<EmployerProfileFormValues>({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      companyName: "",
      description: "",
      website: "",
      location: "",
      industry: "",
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

  useEffect(() => {
    if (!user) return;

    profileForm.reset({
      name: user.name ?? "",
      email: user.email ?? "",
      companyName: employerData.companyName ?? "",
      description: employerData.description ?? "",
      website: employerData.website ?? "",
      location: employerData.location ?? "",
      industry: employerData.industry ?? "",
    });
  }, [
    user,
    employerData.companyName,
    employerData.description,
    employerData.website,
    employerData.location,
    employerData.industry,
    profileForm,
  ]);

//   const onSubmitProfile = async (values: EmployerProfileFormValues) => {
//     try {
//       const response = await updateEmployerProfile(values).unwrap();
//       if (user) {
//         dispatch(updateUser({ ...user, name: values.name, email: values.email }));
//       }
//       toast.success(response?.message || "Profile updated successfully.");
//     } catch (error: unknown) {
     
//       toast.error(message || "Failed to update profile.");
//     }
//   };

//   const onSubmitPassword = async (values: EmployerPasswordFormValues) => {
//     try {
//       const response = await updateEmployerPassword({
//         currentPassword: values.currentPassword,
//         newPassword: values.newPassword,
//       }).unwrap();

//       passwordForm.reset({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//       toast.success(response?.message || "Password updated successfully.");
//     } catch (error: unknown) {
     
//       toast.error(message || "Failed to update password.");
//     }
//   };

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
            <form >
              <Card className="">
                <CardHeader className="">
                  <CardTitle className="">Edit Profile</CardTitle>
                  <CardDescription className="">
                    Update your personal and company information.
                  </CardDescription>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="employer-name">Full Name</Label>
                    <Input
                      id="employer-name"
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
                    <Label htmlFor="employer-email">Email</Label>
                    <Input
                      id="employer-email"
                      type="email"
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
                    <Label htmlFor="company-industry">Industry</Label>
                    <Input
                      id="company-industry"
                      {...profileForm.register("industry")}
                      placeholder="e.g. Technology"
                    />
                    {profileForm.formState.errors.industry && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.industry.message}
                      </p>
                    )}
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

                  <div className="grid gap-2">
                    <Label htmlFor="company-website">Website</Label>
                    <Input
                      id="company-website"
                      type="url"
                      {...profileForm.register("website")}
                      placeholder="https://example.com"
                    />
                    {profileForm.formState.errors.website && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.website.message}
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
            <form >
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
