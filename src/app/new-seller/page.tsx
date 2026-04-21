"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Mail,
  FileText,
  Upload,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useRegisterSellerMutation,
} from "@/Redux/Services/AuthApi";
import { type Language, useI18n } from "@/context/I18nContext";

// ─── Step indicator ───────────────────────────────────────────────────────────

const createStoreCopy: Record<Language, Record<string, string | string[]>> = {
  en: {
    step1: "Your Info",
    step2: "Security",
    step3: "Store Details",
    step4: "Finishing Up",
    imageTypeError: "Please select a valid image file",
    email: "Email Address",
    imageSizeError: "Image must be under 5MB",
    requiredFields: "Please fill in all required fields",
    passwordRequired: "Please create and confirm your password",
    passwordMin: "Password must be at least 8 characters",
    passwordMismatch: "Passwords do not match",
    storeNameRequired: "Store name is required",
    loginRequired: "You must be logged in",
    storeLive: "Your store is live!",
    genericError: "Something went wrong",
    title: "Open your store",
    subtitle: "Set up your storefront in a few simple steps.",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone Number",
    phoneHint: "Customers may use this to contact you.",
    createPassword: "Create Password",
    passwordHint: "Use at least 8 characters.",
    confirmPassword: "Confirm Password",
    storeName: "Store Name",
    storeHint: "This is how customers will find you.",
    description: "Description",
    descriptionHint:
      "Tell customers what makes your store special. (max 500 chars)",
    uploadLogo: "Upload logo",
    optionalLater: "Optional - you can add it later",
    nameSummary: "Name",
    phoneSummary: "Phone",
    passwordSummary: "Password",
    storeSummary: "Store",
    descriptionSummary: "Description",
    emptyValue: "-",
    back: "Back",
    continue: "Continue",
    emailPlaceholder: "enteryouremail@example.com",
    creatingStore: "Creating store...",
    launchStore: "Launch my store",
    alreadyStore: "Already have a store?",
    goDashboard: "Go to dashboard",
    firstNamePlaceholder: "John",
    lastNamePlaceholder: "Doe",
    phonePlaceholder: "+213 555 123 456",
    passwordPlaceholder: "Enter password",
    confirmPasswordPlaceholder: "Confirm password",
    storePlaceholder: "My Awesome Store",
    descriptionPlaceholder: "We sell handcrafted goods made with love...",
    storeLogoAlt: "Store logo",
  },
  fr: {
    step1: "Vos infos",
    step2: "Securite",
    step3: "Details boutique",
    step4: "Finalisation",
    imageTypeError: "Veuillez selectionner une image valide",
    imageSizeError: "L'image doit faire moins de 5 Mo",
    email: "Adresse email",
    requiredFields: "Veuillez remplir tous les champs obligatoires",
    passwordRequired: "Veuillez creer et confirmer votre mot de passe",
    passwordMin: "Le mot de passe doit contenir au moins 8 caracteres",
    passwordMismatch: "Les mots de passe ne correspondent pas",
    storeNameRequired: "Le nom de la boutique est requis",
    loginRequired: "Vous devez etre connecte",
    storeLive: "Votre boutique est en ligne!",
    genericError: "Une erreur est survenue",
    title: "Ouvrez votre boutique",
    subtitle: "Configurez votre boutique en quelques etapes simples.",
    firstName: "Prenom",
    lastName: "Nom",
    phone: "Numero de telephone",
    phoneHint: "Les clients peuvent vous contacter via ce numero.",
    createPassword: "Creer un mot de passe",
    passwordHint: "Utilisez au moins 8 caracteres.",
    confirmPassword: "Confirmer le mot de passe",
    storeName: "Nom de la boutique",
    storeHint: "C'est ainsi que les clients vous trouveront.",
    description: "Description",
    descriptionHint:
      "Dites aux clients ce qui rend votre boutique speciale. (max 500 caracteres)",
    uploadLogo: "Televerser le logo",
    optionalLater: "Optionnel - vous pouvez l'ajouter plus tard",
    nameSummary: "Nom",
    phoneSummary: "Telephone",
    passwordSummary: "Mot de passe",
    storeSummary: "Boutique",
    emailPlaceholder: "enteryouremail@example.com",
    descriptionSummary: "Description",
    emptyValue: "-",
    back: "Retour",
    continue: "Continuer",
    creatingStore: "Creation de la boutique...",
    launchStore: "Lancer ma boutique",
    alreadyStore: "Vous avez deja une boutique ?",
    goDashboard: "Aller au tableau de bord",
    firstNamePlaceholder: "Jean",
    lastNamePlaceholder: "Dupont",
    phonePlaceholder: "+33 6 00 00 00 00",
    passwordPlaceholder: "Entrez le mot de passe",
    confirmPasswordPlaceholder: "Confirmez le mot de passe",
    storePlaceholder: "Ma Super Boutique",
    descriptionPlaceholder:
      "Nous vendons des produits artisanaux faits avec amour...",
    storeLogoAlt: "Logo de la boutique",
  },
  ar: {
    step1: "بياناتك",
    step2: "الامان",
    step3: "تفاصيل المتجر",
    step4: "الخطوة الاخيرة",
    email: "البريد الالكتروني",
    emailHint: "سيتم استخدام هذا البريد الالكتروني لتسجيل الدخول",
    imageTypeError: "يرجى اختيار ملف صورة صالح",
    imageSizeError: "يجب ان يكون حجم الصورة اقل من 5 ميجابايت",
    requiredFields: "يرجى ملء جميع الحقول المطلوبة",
    passwordRequired: "يرجى انشاء كلمة المرور وتاكيدها",
    passwordMin: "يجب ان تتكون كلمة المرور من 8 احرف على الاقل",
    passwordMismatch: "كلمتا المرور غير متطابقتين",
    storeNameRequired: "اسم المتجر مطلوب",
    loginRequired: "يجب تسجيل الدخول",
    storeLive: "متجرك اصبح جاهزا!",
    genericError: "حدث خطا ما",
    emailPlaceholder: "ادخل بريدك الالكتروني@example.com",
    title: "افتح متجرك",
    subtitle: "جهز متجرك بخطوات بسيطة.",
    firstName: "الاسم الاول",
    lastName: "اسم العائلة",
    phone: "رقم الهاتف",
    phoneHint: "قد يستخدم العملاء هذا الرقم للتواصل معك.",
    createPassword: "انشاء كلمة المرور",
    passwordHint: "استخدم 8 احرف على الاقل.",
    confirmPassword: "تاكيد كلمة المرور",
    storeName: "اسم المتجر",
    storeHint: "بهذا الاسم سيعثر عليك العملاء.",
    description: "الوصف",
    descriptionHint: "اخبر العملاء لماذا متجرك مميز. (حد اقصى 500 حرف)",
    uploadLogo: "رفع الشعار",
    optionalLater: "اختياري - يمكنك اضافته لاحقا",
    nameSummary: "الاسم",
    phoneSummary: "الهاتف",
    passwordSummary: "كلمة المرور",
    storeSummary: "المتجر",
    descriptionSummary: "الوصف",
    emptyValue: "-",
    back: "رجوع",
    continue: "متابعة",
    creatingStore: "جار انشاء المتجر...",
    launchStore: "اطلاق متجري",
    alreadyStore: "لديك متجر بالفعل؟",
    goDashboard: "اذهب الى لوحة التحكم",
    firstNamePlaceholder: "محمد",
    lastNamePlaceholder: "بن علي",
    phonePlaceholder: "+213 555 123 456",
    passwordPlaceholder: "ادخل كلمة المرور",
    confirmPasswordPlaceholder: "اكد كلمة المرور",
    storePlaceholder: "متجري الرائع",
    descriptionPlaceholder: "نبيع منتجات يدوية مصنوعة بحب...",
    storeLogoAlt: "شعار المتجر",
  },
};

function StepIndicator({
  current,
  steps,
}: {
  current: number;
  steps: string[];
}) {
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
  const { language } = useI18n();
  const copy = createStoreCopy[language] as Record<string, string>;
  const steps = [copy.step1, copy.step2, copy.step3, copy.step4];
  const [registerSeller, { isLoading }] = useRegisterSellerMutation();

  const [step, setStep] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    description: "",
    email: "",
  });

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(copy.imageTypeError);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(copy.imageSizeError);
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    if (step === 0) {
      if (
        !form.firstName.trim() ||
        !form.lastName.trim() ||
        !form.email.trim() ||
        !form.phoneNumber.trim()
      ) {
        toast.error(copy.requiredFields);
        return;
      }
    }
    if (step === 1) {
      if (!form.password.trim() || !form.confirmPassword.trim()) {
        toast.error(copy.passwordRequired);
        return;
      }
      if (form.password.length < 8) {
        toast.error(copy.passwordMin);
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error(copy.passwordMismatch);
        return;
      }
    }
    if (step === 2) {
      if (!form.storeName.trim()) {
        toast.error(copy.storeNameRequired);
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      payload.append("firstName", form.firstName);
      payload.append("lastName", form.lastName);
      payload.append("phoneNumber", form.phoneNumber);
      payload.append("email", form.email);
      payload.append("password", form.password);
      payload.append("storeName", form.storeName);
      payload.append("description", form.description);
      if (imageFile) {
        payload.append("logo", imageFile);
      }

      await registerSeller(payload).unwrap();

      toast.success(copy.storeLive);
      router.push("/login");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || copy.genericError);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-white shadow-lg mb-4">
            <Store className="w-6 h-6 text-white dark:text-zinc-900" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {copy.title}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
            {copy.subtitle}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/60 dark:shadow-black/40 border border-zinc-100 dark:border-zinc-800 p-8">
          <StepIndicator current={step} steps={steps} />

          {/* ── Step 0: Personal Info ── */}
          {step === 0 && (
            <div className="grid gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <Field label={copy.firstName} icon={User}>
                  <Input
                    name="firstName"
                    placeholder={copy.firstNamePlaceholder}
                    value={form.firstName}
                    onChange={handleChange}
                    className="h-11"
                    required
                  />
                </Field>
                <Field label={copy.lastName} icon={User}>
                  <Input
                    name="lastName"
                    placeholder={copy.lastNamePlaceholder}
                    value={form.lastName}
                    onChange={handleChange}
                    className="h-11"
                    required
                  />
                </Field>
              </div>

              <Field label={copy.email} icon={Mail} hint={copy.emailHint}>
                <Input
                  name="email"
                  type="email"
                  placeholder={copy.emailPlaceholder}
                  value={form.email}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </Field>
              <Field label={copy.phone} icon={Phone} hint={copy.phoneHint}>
                <Input
                  name="phoneNumber"
                  type="tel"
                  placeholder={copy.phonePlaceholder}
                  value={form.phoneNumber}
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
                label={copy.createPassword}
                icon={Lock}
                hint={copy.passwordHint}
              >
                <Input
                  name="password"
                  type="password"
                  placeholder={copy.passwordPlaceholder}
                  value={form.password}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </Field>

              <Field label={copy.confirmPassword} icon={Lock}>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder={copy.confirmPasswordPlaceholder}
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
              <Field label={copy.storeName} icon={Store} hint={copy.storeHint}>
                <Input
                  name="storeName"
                  placeholder={copy.storePlaceholder}
                  value={form.storeName}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </Field>

              <Field
                label={copy.description}
                icon={FileText}
                hint={copy.descriptionHint}
              >
                <Textarea
                  name="description"
                  placeholder={copy.descriptionPlaceholder}
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
                        alt={copy.storeLogoAlt}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-zinc-400">
                        <Upload className="w-6 h-6" />
                        <span className="text-[10px] font-medium">
                          {copy.uploadLogo}
                        </span>
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
                  <p className="text-xs text-zinc-400">{copy.optionalLater}</p>
                )}
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
                {[
                  {
                    label: copy.nameSummary,
                    value: `${form.firstName} ${form.lastName}`,
                  },
                  { label: copy.phoneSummary, value: form.phoneNumber },
                  {
                    label: copy.passwordSummary,
                    value: form.password ? "********" : copy.emptyValue,
                  },
                  { label: copy.storeSummary, value: form.storeName },
                  {
                    label: copy.descriptionSummary,
                    value: form.description || copy.emptyValue,
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 px-4 py-3"
                  >
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider shrink-0">
                      {label}
                    </span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 text-right truncate max-w-55">
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
                {copy.back}
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
                {copy.continue}
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
                    {copy.creatingStore}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-4 h-4" />
                    {copy.launchStore}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-zinc-400 mt-6">
          {copy.alreadyStore}{" "}
          <Link
            href="/admin-seller"
            className="text-zinc-700 dark:text-zinc-300 font-medium hover:underline"
          >
            {copy.goDashboard}
          </Link>
        </p>
      </div>
    </div>
  );
}
