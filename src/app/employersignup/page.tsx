"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRegisterEmployerMutation } from "@/Redux/Services/AuthApi";
import { useAppDispatch } from "@/Redux/hooks";
import { setCredentials } from "@/Redux/Slices/AuthSlice";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  User,
  Loader2,
  FileText,
  CheckCircle2,
  MapPin,
  Briefcase,
} from "lucide-react";

interface EmployerSignupPageProps {
  className?: string;
  params?: { [key: string]: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const EmployerSignupPage: React.FC<EmployerSignupPageProps> = ({
  className,
  // Destructure Next.js props to prevent them from being spread to DOM elements
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: _params,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams: _searchParams,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerEmployer, { isLoading: isPending }] =
    useRegisterEmployerMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const companyName = formData.get("companyName") as string;
    const description = formData.get("description") as string;
    const website = formData.get("website") as string;
    const location = formData.get("location") as string;
    const industry = formData.get("industry") as string;
    const companyLogo = formData.get("companyLogo") as string;

    // Client-side validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      const result = await registerEmployer({
        name,
        email,
        password,
        companyName,
        description,
        website: website || undefined,
        location,
        industry,
        companyLogo: companyLogo || undefined,
      }).unwrap();

      dispatch(setCredentials({ user: result.user }));
      toast.success("Employer Account Created Successfully! 🎉");
      router.push("/employer");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message =
        err?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col lg:py-12 items-center justify-center px-4 bg-linear-to-br from-background via-background to-muted/30">
      <h1 className="sr-only">
        Create Your Employer Account - Saleh Marketplace
      </h1>

      <div className={cn("flex flex-col gap-6 w-full max-w-2xl", className)}>
        {/* Logo/Brand Section */}
        <div className="text-center space-y-2 mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="w-10 h-10 text-primary" aria-hidden="true" />
            <h2 className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Become an Employer
            </h2>
          </div>
          <p className="text-muted-foreground text-sm lg:text-base">
            Post jobs and find the perfect candidates for your company
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm font-medium">Post Unlimited Jobs</p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm font-medium">Access Top Talent</p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm font-medium">Manage Applications</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl p-px bg-transparent shadow-2xl">
          {/* Card content */}
          <div className="relative z-10 text-black dark:text-white rounded-xl p-6 h-full">
            <Card className="border-0 shadow-none">
              <CardHeader className="space-y-3 pb-6">
                <div className="absolute top-0 left-0 w-20 h-20 bg-primary/20 blur-3xl rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <CardTitle className="text-2xl font-bold text-center">
                  Create your employer account
                </CardTitle>
                <CardDescription className="text-center">
                  Fill in your details below to start hiring
                </CardDescription>
              </CardHeader>
              <CardContent className="">
                <form
                  onSubmit={handleSubmit}
                  aria-label="Employer registration form"
                >
                  <div className="flex flex-col gap-6">
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Personal Information
                      </h3>

                      {/* Full Name */}
                      <div className="grid gap-3">
                        <Label htmlFor="name" className="text-sm font-medium">
                          <User
                            className="w-4 h-4 inline mr-2"
                            aria-hidden="true"
                          />
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          className="h-11"
                          placeholder="John Doe"
                          required
                          autoComplete="name"
                          aria-required="true"
                          aria-label="Full name"
                          disabled={isPending}
                        />
                      </div>

                      {/* Email */}
                      <div className="grid gap-3">
                        <Label htmlFor="email" className="text-sm font-medium">
                          <Mail
                            className="w-4 h-4 inline mr-2"
                            aria-hidden="true"
                          />
                          Email Address{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          className="h-11"
                          placeholder="employer@company.com"
                          required
                          autoComplete="email"
                          aria-required="true"
                          aria-label="Email address"
                          disabled={isPending}
                        />
                      </div>

                      {/* Password Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Password */}
                        <div className="grid gap-3">
                          <Label
                            htmlFor="password"
                            className="text-sm font-medium"
                          >
                            <Lock
                              className="w-4 h-4 inline mr-2"
                              aria-hidden="true"
                            />
                            Password <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="h-11 pr-10"
                              required
                              autoComplete="new-password"
                              aria-required="true"
                              aria-label="Password"
                              disabled={isPending}
                              minLength={8}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                              disabled={isPending}
                            >
                              {showPassword ? (
                                <EyeOff
                                  className="h-4 w-4 text-muted-foreground"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Eye
                                  className="h-4 w-4 text-muted-foreground"
                                  aria-hidden="true"
                                />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="grid gap-3">
                          <Label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium"
                          >
                            <Lock
                              className="w-4 h-4 inline mr-2"
                              aria-hidden="true"
                            />
                            Confirm Password{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="h-11 pr-10"
                              required
                              autoComplete="new-password"
                              aria-required="true"
                              aria-label="Confirm password"
                              disabled={isPending}
                              minLength={8}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              aria-label={
                                showConfirmPassword
                                  ? "Hide password"
                                  : "Show password"
                              }
                              disabled={isPending}
                            >
                              {showConfirmPassword ? (
                                <EyeOff
                                  className="h-4 w-4 text-muted-foreground"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Eye
                                  className="h-4 w-4 text-muted-foreground"
                                  aria-hidden="true"
                                />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 8 characters
                      </p>
                    </div>

                    {/* Company Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Company Information
                      </h3>

                      {/* Company Name */}
                      <div className="grid gap-3">
                        <Label
                          htmlFor="companyName"
                          className="text-sm font-medium"
                        >
                          <Building2
                            className="w-4 h-4 inline mr-2"
                            aria-hidden="true"
                          />
                          Company Name{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          type="text"
                          className="h-11"
                          placeholder="Acme Corporation"
                          required
                          autoComplete="organization"
                          aria-required="true"
                          aria-label="Company name"
                          disabled={isPending}
                        />
                      </div>

                      {/* Location and Industry */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Location */}
                        <div className="grid gap-3">
                          <Label
                            htmlFor="location"
                            className="text-sm font-medium"
                          >
                            <MapPin
                              className="w-4 h-4 inline mr-2"
                              aria-hidden="true"
                            />
                            Location <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="location"
                            name="location"
                            type="text"
                            className="h-11"
                            placeholder="New York, NY"
                            required
                            aria-required="true"
                            aria-label="Company location"
                            disabled={isPending}
                          />
                        </div>

                        {/* Industry */}
                        <div className="grid gap-3">
                          <Label
                            htmlFor="industry"
                            className="text-sm font-medium"
                          >
                            <Briefcase
                              className="w-4 h-4 inline mr-2"
                              aria-hidden="true"
                            />
                            Industry <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="industry"
                            name="industry"
                            type="text"
                            className="h-11"
                            placeholder="Technology"
                            required
                            aria-required="true"
                            aria-label="Industry"
                            disabled={isPending}
                          />
                        </div>
                      </div>

                      {/* Company Logo URL */}
                      {/* <div className="grid gap-3">
                        <Label
                          htmlFor="companyLogo"
                          className="text-sm font-medium"
                        >
                          <ImageIcon
                            className="w-4 h-4 inline mr-2"
                            aria-hidden="true"
                          />
                          Company Logo URL{" "}
                          <span className="text-muted-foreground">
                            (Optional)
                          </span>
                        </Label>
                        <Input
                          id="companyLogo"
                          name="companyLogo"
                          type="url"
                          className="h-11"
                          placeholder="https://example.com/logo.png"
                          aria-label="Company logo URL"
                          disabled={isPending}
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter a public URL to your company logo
                        </p>
                      </div> */}

                      {/* Company Description */}
                      <div className="grid gap-3">
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium"
                        >
                          <FileText
                            className="w-4 h-4 inline mr-2"
                            aria-hidden="true"
                          />
                          Company Description{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          className="min-h-25 resize-none"
                          placeholder="Tell job seekers about your company..."
                          required
                          aria-required="true"
                          aria-label="Company description"
                          disabled={isPending}
                          maxLength={1000}
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum 1000 characters
                        </p>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-2 text-sm">
                      <p className="text-muted-foreground leading-relaxed">
                        By creating an account, you agree to our{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:underline font-medium"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-primary hover:underline font-medium"
                        >
                          Privacy Policy
                        </Link>
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-11 text-base bg-primary hover:bg-primary/90 transition-all duration-200"
                      size="lg"
                      disabled={isPending}
                      aria-label="Create employer account"
                    >
                      {isPending ? (
                        <>
                          <Loader2
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <Building2
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          Create Employer Account
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">
                    Already have an employer account?{" "}
                  </span>
                  <Link
                    href="/login"
                    className="font-semibold text-primary hover:underline transition-colors"
                  >
                    Sign in
                  </Link>
                </div>

                {/* Job Seeker Link */}
                <div className="mt-4 text-center text-sm">
                  <span className="text-muted-foreground">
                    Looking for a job?{" "}
                  </span>
                  <Link
                    href="/register"
                    className="font-semibold text-primary hover:underline transition-colors"
                  >
                    Create a job seeker account
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            Need help?{" "}
            <Link href="/help" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default EmployerSignupPage;
