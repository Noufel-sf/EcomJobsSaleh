"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
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
// import { useAppDispatch } from "@/Redux/hooks";
import { useRegisterEmployerCompanyMutation } from "@/Redux/Services/AuthApi";
// import { setCredentials } from "@/Redux/Slices/AuthSlice";
import {
  Lock,
  Mail,
  Phone,
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
import Image from "next/image";
import { type Language, useI18n } from "@/context/I18nContext";

interface EmployerSignupPageProps {
  className?: string;
  params?: { [key: string]: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const employerSignupCopy: Record<Language, Record<string, string>> = {
  en: {
    passwordMismatch: "Passwords do not match",
    passwordMin: "Password must be at least 8 characters",
    success: "Employer Account Created Successfully!",
    failed: "Registration failed. Please try again.",
    pageTitle: "Create Your Employer Account - Saleh Marketplace",
    heroTitle: "Become an Employer",
    heroSubtitle: "Post jobs and find the perfect candidates for your company",
    benefit1: "Post Unlimited Jobs",
    benefit2: "Access Top Talent",
    benefit3: "Manage Applications",
    cardTitle: "Create your employer account",
    cardDescription: "Fill in your details below to start hiring",
    formAria: "Employer registration form",
    personalInfo: "Personal Information",
    companyName: "Company Name",
    fullNamePlaceholder: "John Doe",
    fullNameAria: "Company name",
    email: "Email Address",
    emailPlaceholder: "employer@company.com",
    emailAria: "Email address",
    phone: "Phone Number",
    phonePlaceholder: "+213 555 123 456",
    phoneAria: "Company phone number",
    password: "Password",
    confirmPassword: "Confirm Password",
    passwordAria: "Password",
    confirmPasswordAria: "Confirm password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    passwordHint: "Password must be at least 8 characters",
    companyInfo: "Company Information",
    location: "Location",
    locationPlaceholder: "New York, NY",
    locationAria: "Company location",
    specialization: "Specialization",
    specializationPlaceholder: "Fintech, E-commerce",
    specializationAria: "Company specialization",
    logo: "Logo",
    logoPreviewAlt: "Logo preview",
    companyDescription: "Company Description",
    descriptionPlaceholder: "Tell job seekers about your company...",
    descriptionAria: "Company description",
    maxChars: "Maximum 1000 characters",
    termsPrefix: "By creating an account, you agree to our",
    terms: "Terms of Service",
    and: "and",
    privacy: "Privacy Policy",
    submitAria: "Create employer account",
    creating: "Creating Account...",
    createAccount: "Create Employer Account",
    alreadyHave: "Already have an employer account?",
    signIn: "Sign in",
    lookingForJob: "Looking for a job?",
    createJobSeeker: "Create a job seeker account",
    needHelp: "Need help?",
    contactSupport: "Contact our support team",
  },
  fr: {
    passwordMismatch: "Les mots de passe ne correspondent pas",
    passwordMin: "Le mot de passe doit contenir au moins 8 caracteres",
    success: "Compte employeur cree avec succes!",
    failed: "Echec de l'inscription. Veuillez reessayer.",
    pageTitle: "Creez votre compte employeur - Saleh Marketplace",
    heroTitle: "Devenir employeur",
    heroSubtitle: "Publiez des offres et trouvez les meilleurs candidats",
    benefit1: "Publiez des offres illimitees",
    benefit2: "Accedez aux meilleurs talents",
    benefit3: "Gerez les candidatures",
    cardTitle: "Creez votre compte employeur",
    cardDescription: "Remplissez vos informations pour commencer a recruter",
    formAria: "Formulaire d'inscription employeur",
    personalInfo: "Informations personnelles",
    companyName: "Nom de l'entreprise",
    fullNamePlaceholder: "John Doe",
    fullNameAria: "Nom de l'entreprise",
    email: "Adresse e-mail",
    emailPlaceholder: "employeur@entreprise.com",
    emailAria: "Adresse e-mail",
    phone: "Numero de telephone",
    phonePlaceholder: "+33 6 00 00 00 00",
    phoneAria: "Numero de telephone de l'entreprise",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    passwordAria: "Mot de passe",
    confirmPasswordAria: "Confirmer le mot de passe",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
    passwordHint: "Le mot de passe doit contenir au moins 8 caracteres",
    companyInfo: "Informations de l'entreprise",
    location: "Emplacement",
    locationPlaceholder: "Paris, France",
    locationAria: "Emplacement de l'entreprise",
    specialization: "Specialisation",
    specializationPlaceholder: "Fintech, E-commerce",
    specializationAria: "Specialisation de l'entreprise",
    logo: "Logo",
    logoPreviewAlt: "Apercu du logo",
    companyDescription: "Description de l'entreprise",
    descriptionPlaceholder: "Parlez de votre entreprise aux candidats...",
    descriptionAria: "Description de l'entreprise",
    maxChars: "Maximum 1000 caracteres",
    termsPrefix: "En creant un compte, vous acceptez nos",
    terms: "Conditions d'utilisation",
    and: "et",
    privacy: "Politique de confidentialite",
    submitAria: "Creer un compte employeur",
    creating: "Creation du compte...",
    createAccount: "Creer un compte employeur",
    alreadyHave: "Vous avez deja un compte employeur ?",
    signIn: "Se connecter",
    lookingForJob: "Vous cherchez un emploi ?",
    createJobSeeker: "Creer un compte candidat",
    needHelp: "Besoin d'aide ?",
    contactSupport: "Contacter notre equipe support",
  },
  ar: {
    passwordMismatch: "كلمتا المرور غير متطابقتين",
    passwordMin: "يجب ان تتكون كلمة المرور من 8 احرف على الاقل",
    success: "تم انشاء حساب صاحب العمل بنجاح",
    failed: "فشل التسجيل. يرجى المحاولة مرة اخرى.",
    pageTitle: "انشئ حساب صاحب العمل - صالح ماركت",
    heroTitle: "كن صاحب عمل",
    heroSubtitle: "انشر وظائف واعثر على المرشحين المناسبين لشركتك",
    benefit1: "انشر وظائف غير محدودة",
    benefit2: "الوصول الى افضل المواهب",
    benefit3: "ادارة طلبات التوظيف",
    cardTitle: "انشئ حساب صاحب العمل",
    cardDescription: "املأ بياناتك بالاسفل لبدء التوظيف",
    formAria: "نموذج تسجيل صاحب العمل",
    personalInfo: "المعلومات الشخصية",
    companyName: "اسم الشركة",
    fullNamePlaceholder: "شركة مثال",
    fullNameAria: "اسم الشركة",
    email: "البريد الالكتروني",
    emailPlaceholder: "employer@company.com",
    emailAria: "البريد الالكتروني",
    phone: "رقم الهاتف",
    phonePlaceholder: "+213 555 123 456",
    phoneAria: "رقم هاتف الشركة",
    password: "كلمة المرور",
    confirmPassword: "تاكيد كلمة المرور",
    passwordAria: "كلمة المرور",
    confirmPasswordAria: "تاكيد كلمة المرور",
    showPassword: "اظهار كلمة المرور",
    hidePassword: "اخفاء كلمة المرور",
    passwordHint: "يجب ان تتكون كلمة المرور من 8 احرف على الاقل",
    companyInfo: "معلومات الشركة",
    location: "الموقع",
    locationPlaceholder: "الجزائر، الجزائر",
    locationAria: "موقع الشركة",
    specialization: "التخصص",
    specializationPlaceholder: "التقنية المالية، التجارة الالكترونية",
    specializationAria: "تخصص الشركة",
    logo: "الشعار",
    logoPreviewAlt: "معاينة الشعار",
    companyDescription: "وصف الشركة",
    descriptionPlaceholder: "اخبر الباحثين عن العمل عن شركتك...",
    descriptionAria: "وصف الشركة",
    maxChars: "الحد الاقصى 1000 حرف",
    termsPrefix: "بانشاء حساب، فانك توافق على",
    terms: "شروط الخدمة",
    and: "و",
    privacy: "سياسة الخصوصية",
    submitAria: "انشاء حساب صاحب العمل",
    creating: "جار انشاء الحساب...",
    createAccount: "انشاء حساب صاحب العمل",
    alreadyHave: "لديك حساب صاحب عمل بالفعل؟",
    signIn: "تسجيل الدخول",
    lookingForJob: "تبحث عن وظيفة؟",
    createJobSeeker: "انشئ حساب باحث عن عمل",
    needHelp: "تحتاج مساعدة؟",
    contactSupport: "تواصل مع فريق الدعم",
  },
};

const EmployerSignupPage: React.FC<EmployerSignupPageProps> = ({
  className,
  // Destructure Next.js props to prevent them from being spread to DOM elements
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: _params,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams: _searchParams,
}) => {
  // const dispatch = useAppDispatch();
  const router = useRouter();
  const { language } = useI18n();
  const copy = employerSignupCopy[language];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoUrl, setLogoUrl] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [registerEmployerCompany, { isLoading: isPending }] =
    useRegisterEmployerCompanyMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (logoUrl) {
      formData.append("logo", logoUrl);
    }

    if (password !== confirmPassword) {
      toast.error(copy.passwordMismatch);
      return;
    }

    if (password.length < 8) {
      toast.error(copy.passwordMin);
      return;
    }

    try {
      // @ts-expect-error RTK Query handles FormData at runtime
      await registerEmployerCompany(formData).unwrap();
      toast.success(copy.success);
      router.push("/employer");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message = err?.data?.message || copy.failed;
      toast.error(message);
    }
  };
  const handleLogoChange = (file: File | undefined) => {
    setLogoUrl(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  const removeLogo = () => {
    setLogoUrl(null);
    setLogoPreview(null);
  };

  return (
    <main className="min-h-screen flex flex-col lg:py-12 items-center justify-center px-4 bg-linear-to-br from-background via-background to-muted/30">
      <h1 className="sr-only">
        {copy.pageTitle}
      </h1>

      <div className={cn("flex flex-col gap-6 w-full max-w-2xl", className)}>
        {/* Logo/Brand Section */}
        <div className="text-center space-y-2 mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="w-10 h-10 text-primary" aria-hidden="true" />
            <h2 className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {copy.heroTitle}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm lg:text-base">
            {copy.heroSubtitle}
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm font-medium">{copy.benefit1}</p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm font-medium">{copy.benefit2}</p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm font-medium">{copy.benefit3}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl p-px bg-transparent shadow-2xl">
          {/* Card content */}
          <div className="relative z-10 text-black dark:text-white rounded-xl p-6 h-full">
            <Card className="border-0 shadow-none">
              <CardHeader className="space-y-3 pb-6">
                <div className="absolute top-0 left-0 w-20 h-20 bg-primary/20 blur-3xl rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <CardTitle className="text-2xl font-bold text-center">
                  {copy.cardTitle}
                </CardTitle>
                <CardDescription className="text-center">
                  {copy.cardDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="">
                <form
                  onSubmit={handleSubmit}
                  aria-label={copy.formAria}
                >
                  <div className="flex flex-col gap-6">
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        {copy.personalInfo}
                      </h3>

                      {/* Full Name */}
                      <div className="grid gap-3">
                        <Label htmlFor="name" className="text-sm font-medium">
                          <User
                            className="w-4 h-4 inline mr-2"
                            aria-hidden="true"
                          />
                          {copy.companyName}{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          className="h-11"
                          placeholder={copy.fullNamePlaceholder}
                          required
                          autoComplete="name"
                          aria-required="true"
                          aria-label={copy.fullNameAria}
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
                          {copy.email}{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          className="h-11"
                          placeholder={copy.emailPlaceholder}
                          required
                          autoComplete="email"
                          aria-required="true"
                          aria-label={copy.emailAria}
                          disabled={isPending}
                        />
                      </div>

                      {/* Phone */}
                      <div className="grid gap-3">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          <Phone
                            className="w-4 h-4 inline mr-2"
                            aria-hidden="true"
                          />
                          {copy.phone} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          className="h-11"
                          placeholder={copy.phonePlaceholder}
                          required
                          autoComplete="tel"
                          aria-required="true"
                          aria-label={copy.phoneAria}
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
                            {copy.password}{" "}
                            <span className="text-destructive">*</span>
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
                              aria-label={copy.passwordAria}
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
                                showPassword ? copy.hidePassword : copy.showPassword
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
                            {copy.confirmPassword}{" "}
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
                              aria-label={copy.confirmPasswordAria}
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
                                  ? copy.hidePassword
                                  : copy.showPassword
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
                        {copy.passwordHint}
                      </p>
                    </div>

                    {/* Company Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        {copy.companyInfo}
                      </h3>

                      {/* Location and Specialization */}
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
                            {copy.location}{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="location"
                            name="location"
                            type="text"
                            className="h-11"
                            placeholder={copy.locationPlaceholder}
                            required
                            aria-required="true"
                            aria-label={copy.locationAria}
                            disabled={isPending}
                          />
                        </div>

                        {/* Specialization */}
                        <div className="grid gap-3">
                          <Label
                            htmlFor="specialization"
                            className="text-sm font-medium"
                          >
                            <Briefcase
                              className="w-4 h-4 inline mr-2"
                              aria-hidden="true"
                            />
                            {copy.specialization}{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="specialization"
                            name="specialization"
                            type="text"
                            className="h-11"
                            placeholder={copy.specializationPlaceholder}
                            required
                            aria-required="true"
                            aria-label={copy.specializationAria}
                            disabled={isPending}
                          />
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <Label className="" htmlFor="logo">
                          {copy.logo}
                        </Label>
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleLogoChange(e.target.files?.[0])
                          }
                          className="cursor-pointer"
                        />
                        {logoPreview && (
                          <div className="relative w-fit">
                            <Image
                              width={400}
                              height={300}
                              src={logoPreview}
                              alt={copy.logoPreviewAlt}
                              className="w-48 h-32 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={removeLogo}
                              className="absolute top-1 cursor-pointer right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>

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
                          {copy.companyDescription}{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          className="min-h-25 resize-none"
                          placeholder={copy.descriptionPlaceholder}
                          required
                          aria-required="true"
                          aria-label={copy.descriptionAria}
                          disabled={isPending}
                          maxLength={1000}
                        />
                        <p className="text-xs text-muted-foreground">
                          {copy.maxChars}
                        </p>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-2 text-sm">
                      <p className="text-muted-foreground leading-relaxed">
                        {copy.termsPrefix}{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:underline font-medium"
                        >
                          {copy.terms}
                        </Link>{" "}
                        {copy.and}{" "}
                        <Link
                          href="/privacy"
                          className="text-primary hover:underline font-medium"
                        >
                          {copy.privacy}
                        </Link>
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-11 text-base bg-primary hover:bg-primary/90 transition-all duration-200"
                      size="lg"
                      disabled={isPending}
                      aria-label={copy.submitAria}
                    >
                      {isPending ? (
                        <>
                          <Loader2
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                          {copy.creating}
                        </>
                      ) : (
                        <>
                          <Building2
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          {copy.createAccount}
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">
                    {copy.alreadyHave}{" "}
                  </span>
                  <Link
                    href="/login"
                    className="font-semibold text-primary hover:underline transition-colors"
                  >
                    {copy.signIn}
                  </Link>
                </div>

                {/* Job Seeker Link */}
                <div className="mt-4 text-center text-sm">
                  <span className="text-muted-foreground">
                    {copy.lookingForJob}{" "}
                  </span>
                  <Link
                    href="/register"
                    className="font-semibold text-primary hover:underline transition-colors"
                  >
                    {copy.createJobSeeker}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            {copy.needHelp}{" "}
            <Link href="/help" className="text-primary hover:underline">
              {copy.contactSupport}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default EmployerSignupPage;
