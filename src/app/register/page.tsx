"use client";

import Link from "next/link";
import { Building2, Store, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Language, useI18n } from "@/context/I18nContext";

const registerCopy: Record<
  Language,
  {
    title: string;
    subtitle: string;
    continue: string;
    accountTypes: Array<{ title: string; description: string; href: string; icon: typeof Store | typeof Building2 }>;
  }
> = {
  en: {
    title: "Create Your Account",
    subtitle:
      "Choose how you want to join. You will continue to the full signup form in the next step.",
    continue: "Continue",
    accountTypes: [
      {
        title: "Sign up as Seller",
        description:
          "Open your own store, add products, and manage your orders from one dashboard.",
        href: "/new-seller",
        icon: Store,
      },
      {
        title: "Sign up as Employer",
        description:
          "Create your company profile, post jobs, and review applications with ease.",
        href: "/new-employer",
        icon: Building2,
      },
    ],
  },
  fr: {
    title: "Creez votre compte",
    subtitle:
      "Choisissez comment vous souhaitez nous rejoindre. Vous continuerez vers le formulaire complet a l'etape suivante.",
    continue: "Continuer",
    accountTypes: [
      {
        title: "S'inscrire en tant que vendeur",
        description:
          "Ouvrez votre boutique, ajoutez des produits et gerez vos commandes depuis un seul tableau de bord.",
        href: "/new-seller",
        icon: Store,
      },
      {
        title: "S'inscrire en tant qu'employeur",
        description:
          "Creez le profil de votre entreprise, publiez des offres et gerez les candidatures facilement.",
        href: "/new-employer",
        icon: Building2,
      },
    ],
  },
  ar: {
    title: "انشئ حسابك",
    subtitle:
      "اختر طريقة الانضمام المناسبة لك. ستنتقل الى نموذج التسجيل الكامل في الخطوة التالية.",
    continue: "متابعة",
    accountTypes: [
      {
        title: "التسجيل كبائع",
        description:
          "افتح متجرك الخاص، اضف منتجاتك، وادِر طلباتك من لوحة تحكم واحدة.",
        href: "/new-seller",
        icon: Store,
      },
      {
        title: "التسجيل كصاحب عمل",
        description:
          "انشئ ملف شركتك، انشر الوظائف، وراجع الطلبات بسهولة.",
        href: "/new-employer",
        icon: Building2,
      },
    ],
  },
};

export default function RegisterPage() {
  const { language } = useI18n();
  const copy = registerCopy[language];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-16">
      <section className="mx-auto w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
            {copy.title}
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {copy.subtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {copy.accountTypes.map((type) => {
            const Icon = type.icon;

            return (
              <Card
                key={type.title}
                className="border-zinc-200 dark:border-zinc-800"
              >
                <CardHeader className="">
                  <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                  </div>
                  <CardTitle className="">{type.title}</CardTitle>
                  <CardDescription className="">
                    {type.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="">
                  <Button asChild className="w-full h-11">
                    <Link className="mt-5" href={type.href}>
                      {copy.continue}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
