"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Package, Phone, Store } from "lucide-react";

import ProductCard from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type Language, useI18n } from "@/context/I18nContext";

type SellerViewModel = {
  id: string;
  storeName: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  img: string;
};

type SellerProductViewModel = {
  id: string;
  name: string;
  price: number;
  mainImage: string;
  smallDesc: string;
  available: boolean;
};

type SellerProfileClientProps = {
  sellerIdMissing: boolean;
  seller: SellerViewModel | null;
  sellerProducts: SellerProductViewModel[];
};

const sellerProfileCopy: Record<Language, Record<string, string>> = {
  en: {
    sellerNotFoundTitle: "Seller profile not found",
    missingIdDescription: "The seller id is missing from the route.",
    loadFailedDescription: "We could not load this seller from the backend.",
    backToProducts: "Back to products",
    sellerProfileBadge: "Seller profile",
    sellerProfileFallback: "Seller Profile",
    sellerDescriptionFallback: "No description available for this seller yet.",
    contactTitle: "Contact",
    emailLabel: "Email",
    phoneLabel: "Phone",
    storeLabel: "Store",
    addressLabel: "Address",
    notShared: "Not shared",
    addressFallback: "Location not shared",
    sellerProductsTitle: "Seller Products",
    emptyProducts: "No products found for this seller yet.",
  },
  fr: {
    sellerNotFoundTitle: "Profil vendeur introuvable",
    missingIdDescription: "L'identifiant du vendeur est manquant dans la route.",
    loadFailedDescription: "Impossible de charger ce vendeur depuis le backend.",
    backToProducts: "Retour aux produits",
    sellerProfileBadge: "Profil vendeur",
    sellerProfileFallback: "Profil vendeur",
    sellerDescriptionFallback: "Aucune description disponible pour ce vendeur.",
    contactTitle: "Contact",
    emailLabel: "Email",
    phoneLabel: "Telephone",
    storeLabel: "Boutique",
    addressLabel: "Adresse",
    notShared: "Non partage",
    addressFallback: "Localisation non partagee",
    sellerProductsTitle: "Produits du vendeur",
    emptyProducts: "Aucun produit trouve pour ce vendeur.",
  },
  ar: {
    sellerNotFoundTitle: "لم يتم العثور على ملف البائع",
    missingIdDescription: "معرف البائع غير موجود في الرابط.",
    loadFailedDescription: "تعذر تحميل هذا البائع من الخادم.",
    backToProducts: "الرجوع الى المنتجات",
    sellerProfileBadge: "ملف البائع",
    sellerProfileFallback: "ملف البائع",
    sellerDescriptionFallback: "لا يوجد وصف متاح لهذا البائع حاليا.",
    contactTitle: "التواصل",
    emailLabel: "البريد الالكتروني",
    phoneLabel: "الهاتف",
    storeLabel: "المتجر",
    addressLabel: "العنوان",
    notShared: "غير متاح",
    addressFallback: "الموقع غير متاح",
    sellerProductsTitle: "منتجات البائع",
    emptyProducts: "لا توجد منتجات لهذا البائع حاليا.",
  },
};

export default function SellerProfileClient({
  sellerIdMissing,
  seller,
  sellerProducts,
}: SellerProfileClientProps) {
  const { language } = useI18n();
  const copy = sellerProfileCopy[language];

  if (sellerIdMissing) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">{copy.sellerNotFoundTitle}</h1>
        <p className="mt-3 text-muted-foreground">{copy.missingIdDescription}</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.backToProducts}
        </Link>
      </main>
    );
  }

  if (!seller) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">{copy.sellerNotFoundTitle}</h1>
        <p className="mt-3 text-muted-foreground">{copy.loadFailedDescription}</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.backToProducts}
        </Link>
      </main>
    );
  }

  const displayName = seller.storeName || copy.sellerProfileFallback;
  const description = seller.description || copy.sellerDescriptionFallback;
  const email = seller.email || "";
  const phone = seller.phone || "";
  const address = seller.address || copy.addressFallback;

  return (
    <main className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.backToProducts}
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="overflow-hidden rounded-3xl border-nonep-0 text-white shadow-2xl shadow-slate-950/20">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[auto_1fr] lg:items-start">
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  <Store className="h-3.5 w-3.5" />
                  {copy.sellerProfileBadge}
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {displayName}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">{copy.contactTitle}</h2>
          <Separator className="my-4" />
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{copy.emailLabel}</div>
                <div className="text-muted-foreground">{email || copy.notShared}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{copy.phoneLabel}</div>
                <div className="text-muted-foreground">{phone || copy.notShared}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Store className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{copy.storeLabel}</div>
                <div className="text-muted-foreground">{displayName}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ArrowLeft className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{copy.addressLabel}</div>
                <div className="text-muted-foreground">{address}</div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{copy.sellerProductsTitle}</h2>
        </div>

        {sellerProducts.length === 0 ? (
          <div className="rounded-3xl border bg-card py-12 text-center text-muted-foreground">
            {copy.emptyProducts}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sellerProducts.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
