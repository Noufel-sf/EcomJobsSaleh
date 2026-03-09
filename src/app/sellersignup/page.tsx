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
import { useRegisterSellerMutation } from "@/Redux/Services/AuthApi";
import { useAppDispatch } from "@/Redux/hooks";
import { setCredentials } from "@/Redux/Slices/AuthSlice";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Store,
  User,
  Phone,
  Loader2,
  FileText,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

interface SellerSignupPageProps {
  className?: string;
  params?: { [key: string]: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const SellerSignupPage: React.FC<SellerSignupPageProps> = ({
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
  const [registerSeller, { isLoading: isPending }] =
    useRegisterSellerMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const description = formData.get("description") as string;
    const storeName = formData.get("storeName") as string;

    // Client-side validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return { error: "Passwords do not match", success: false };
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return {
        error: "Password must be at least 8 characters",
        success: false,
      };
    }

    try {
      const result = await registerSeller({
        firstName,
        lastName,
        email,
        phone,
        password,
        description: description || undefined,
        storeName: storeName || undefined,
      }).unwrap();

      dispatch(setCredentials({ user: result.user }));
      toast.success("Seller Account Created Successfully! 🎉");
      router.push("/admin-seller");
      return { error: null, success: true };
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
        Create Your Seller Account - Saleh Marketplace
      </h1>

      <div
        className={cn("flex flex-col gap-6 w-full max-w-2xl", className)}
      >
        {/* Logo/Brand Section */}
        <div className="text-center space-y-2 mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Store className="w-10 h-10 text-primary" aria-hidden="true" />
            <h2 className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Become a Seller
            </h2>
          </div>
          <p className="text-muted-foreground text-sm lg:text-base">
            Join our marketplace and start selling your products today
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm font-medium">Free Registration</p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm font-medium">Easy Dashboard</p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm font-medium">24/7 Support</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl p-px bg-transparent shadow-2xl">
          {/* Card content */}
          <div className="relative z-10 text-black dark:text-white rounded-xl p-6 h-full">
            <Card className="border-0 shadow-none">
              <CardHeader className="space-y-3 pb-6">
                <div className="absolute top-0 left-0 w-20 h-20 bg-primary/20 blur-3xl rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <CardTitle className="text-2xl font-bold text-center">
                  Create your seller account
                </CardTitle>
                <CardDescription className="text-center">
                  Fill in your details below to start your selling journey
                </CardDescription>
              </CardHeader>
              <CardContent className="">
                <form
                  onSubmit={handleSubmit}
                  aria-label="Seller registration form"
                >
                  <div className="flex flex-col gap-6">
                    {/* Store Name Field */}
                    <div className="grid gap-3">
                      <Label
                        htmlFor="storeName"
                        className="text-sm font-medium"
                      >
                        <ShoppingBag
                          className="w-4 h-4 inline mr-2"
                          aria-hidden="true"
                        />
                        Store Name{" "}
                        <span className="text-muted-foreground">
                          (Optional)
                        </span>
                      </Label>
                      <Input
                        id="storeName"
                        name="storeName"
                        type="text"
                        className="h-11"
                        placeholder="My Awesome Store"
                        autoComplete="organization"
                        aria-label="Store name"
                        disabled={isPending}
                      />
                      <p className="text-xs text-muted-foreground">
                        This will be displayed on your store profile
                      </p>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* First Name */}
                      <div className="grid gap-3">
                        <Label
                          htmlFor="firstName"
                          className="text-sm font-medium"
                        >
                          <User
                            className="w-4 h-4 inline mr-2"
                            aria-hidden="true"
                          />
                          First Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          className="h-11"
                          placeholder="John"
                          required
                          autoComplete="given-name"
                          aria-required="true"
                          aria-label="First name"
                          disabled={isPending}
                        />
                      </div>

                      {/* Last Name */}
                      <div className="grid gap-3">
                        <Label
                          htmlFor="lastName"
                          className="text-sm font-medium"
                        >
                          <User
                            className="w-4 h-4 inline mr-2"
                            aria-hidden="true"
                          />
                          Last Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          className="h-11"
                          placeholder="Doe"
                          required
                          autoComplete="family-name"
                          aria-required="true"
                          aria-label="Last name"
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    {/* Email Field */}
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
                        placeholder="seller@example.com"
                        required
                        autoComplete="email"
                        aria-required="true"
                        aria-label="Email address"
                        disabled={isPending}
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="grid gap-3">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        <Phone
                          className="w-4 h-4 inline mr-2"
                          aria-hidden="true"
                        />
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="h-11"
                        placeholder="+1234567890"
                        required
                        autoComplete="tel"
                        aria-required="true"
                        aria-label="Phone number"
                        disabled={isPending}
                      />
                      <p className="text-xs text-muted-foreground">
                        This will be used for order notifications
                      </p>
                    </div>

                    {/* Store Description */}
                    <div className="grid gap-3">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        <FileText
                          className="w-4 h-4 inline mr-2"
                          aria-hidden="true"
                        />
                        Store Description{" "}
                        <span className="text-muted-foreground">
                          (Optional)
                        </span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        className="min-h-25 resize-none"
                        placeholder="Tell customers about your store and what makes it special..."
                        aria-label="Store description"
                        disabled={isPending}
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum 500 characters
                      </p>
                    </div>

                    {/* Password Field */}
                    <div className="grid gap-3">
                      <Label htmlFor="password" className="text-sm font-medium">
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
                      <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters
                      </p>
                    </div>

                    {/* Confirm Password Field */}
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
                      aria-label="Create seller account"
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
                          <Store className="mr-2 h-4 w-4" aria-hidden="true" />
                          Create Seller Account
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">
                    Already have a seller account?{" "}
                  </span>
                  <Link
                    href="/login"
                    className="font-semibold text-primary hover:underline transition-colors"
                  >
                    Sign in
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
            <Link href="/helpcenter" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SellerSignupPage;
