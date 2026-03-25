"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Store,
  User,
  Phone,
  Lock,
  FileText,
  Upload,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector } from "@/Redux/hooks";
// import { useCreateStoreMutation } from "@/Redux/Services/SellerApi";

// ─── Step indicator ───────────────────────────────────────────────────────────

const steps = ["Your Info", "Security", "Store Details", "Finishing Up"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold
                  transition-all duration-300
                  ${done ? "bg-emerald-500 text-white" : active ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"}
                `}
              >
                {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide ${active ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 h-px mb-5 mx-1 transition-all duration-500 ${done ? "bg-emerald-400" : "bg-zinc-200 dark:bg-zinc-700"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  icon: Icon,
  hint,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-zinc-400" />}
        {label}
      </Label>
      {children}
      {hint && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500">{hint}</p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CreateStorePage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = false;

//   const [createStore, { isLoading }] = useCreateStoreMutation();

  const [step, setStep] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    description: "",
  });

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    if (step === 0) {
      if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    if (step === 1) {
      if (!form.password.trim() || !form.confirmPassword.trim()) {
        toast.error("Please create and confirm your password");
        return;
      }
      if (form.password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }
    if (step === 2) {
      if (!form.storeName.trim()) {
        toast.error("Store name is required");
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    if (!user?.userId) {
      toast.error("You must be logged in");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("firstName", form.firstName);
      payload.append("lastName", form.lastName);
      payload.append("phone", form.phone);
      payload.append("storeName", form.storeName);
      payload.append("description", form.description);
      if (imageFile) payload.append("image", imageFile);

    //   await createStore({ userId: user.userId, formData: payload }).unwrap();

      toast.success("Your store is live! 🎉");
      router.push("/seller/dashboard");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4 py-16">
      {/* Background decoration */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-100/60 dark:bg-emerald-900/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-sky-100/50 dark:bg-sky-900/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-white shadow-lg mb-4">
            <Store className="w-6 h-6 text-white dark:text-zinc-900" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Open your store
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
            Set up your storefront in a few simple steps.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/60 dark:shadow-black/40 border border-zinc-100 dark:border-zinc-800 p-8">
          <StepIndicator current={step} />

          {/* ── Step 0: Personal Info ── */}
          {step === 0 && (
            <div className="grid gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" icon={User}>
                  <Input
                    name="firstName"
                    placeholder="John"
                    value={form.firstName}
                    onChange={handleChange}
                    className="h-11"
                    required
                  />
                </Field>
                <Field label="Last Name" icon={User}>
                  <Input
                    name="lastName"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={handleChange}
                    className="h-11"
                    required
                  />
                </Field>
              </div>

              <Field
                label="Phone Number"
                icon={Phone}
                hint="Customers may use this to contact you."
              >
                <Input
                  name="phone"
                  type="tel"
                  placeholder="+213 555 123 456"
                  value={form.phone}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </Field>
            </div>
          )}

          {/* ── Step 1: Security ── */}
          {step === 1 && (
            <div className="grid gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <Field
                label="Create Password"
                icon={Lock}
                hint="Use at least 8 characters."
              >
                <Input
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </Field>

              <Field label="Confirm Password" icon={Lock}>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </Field>
            </div>
          )}

          {/* ── Step 2: Store Details ── */}
          {step === 2 && (
            <div className="grid gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <Field
                label="Store Name"
                icon={Store}
                hint="This is how customers will find you."
              >
                <Input
                  name="storeName"
                  placeholder="My Awesome Store"
                  value={form.storeName}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </Field>

              <Field
                label="Description"
                icon={FileText}
                hint="Tell customers what makes your store special. (max 500 chars)"
              >
                <Textarea
                  name="description"
                  placeholder="We sell handcrafted goods made with love..."
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <p className="text-xs text-zinc-400 text-right -mt-1">
                  {form.description.length}/500
                </p>
              </Field>
            </div>
          )}

          {/* ── Step 3: Logo upload + Review ── */}
          {step === 3 && (
            <div className="grid gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Logo upload */}
              <div className="flex flex-col items-center gap-4">
                <label htmlFor="storeImage" className="cursor-pointer group">
                  <div
                    className={`
                      relative w-28 h-28 rounded-2xl border-2 border-dashed
                      flex items-center justify-center overflow-hidden
                      transition-all duration-200
                      ${imagePreview ? "border-primary bg-primary/10 " : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 group-hover:border-zinc-400"}
                    `}
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Store logo"
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-zinc-400">
                        <Upload className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Upload logo</span>
                      </div>
                    )}
                  </div>
                </label>
                <input
                  id="storeImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {imageFile ? (
                  <p className="text-xs text-primary font-medium">
                    ✓ {imageFile.name}
                  </p>
                ) : (
                  <p className="text-xs text-zinc-400">Optional — you can add it later</p>
                )}
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
                {[
                  { label: "Name", value: `${form.firstName} ${form.lastName}` },
                  { label: "Phone", value: form.phone },
                  { label: "Password", value: form.password ? "********" : "—" },
                  { label: "Store", value: form.storeName },
                  {
                    label: "Description",
                    value: form.description || "—",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 px-4 py-3"
                  >
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider shrink-0">
                      {label}
                    </span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 text-right truncate max-w-[220px]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 gap-3">
            {step > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1"
              >
                Back
              </Button>
            ) : (
              <div className="flex-1" />
            )}

            {step < steps.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-primary hover:bg-primary/30 text-white h-11"
              >
                Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-primary text-white h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Creating store...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-4 h-4" />
                    Launch my store
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-zinc-400 mt-6">
          Already have a store?{" "}
          <a
            href="/seller/dashboard"
            className="text-zinc-700 dark:text-zinc-300 font-medium hover:underline"
          >
            Go to dashboard
          </a>
        </p>
      </div>
    </div>
  );
}