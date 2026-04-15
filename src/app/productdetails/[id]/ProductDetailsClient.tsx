"use client";

import { useState, memo, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Mail, Phone, Store, ShoppingCart } from "lucide-react";
import { useAddToCartMutation } from "@/Redux/Services/CartApi";
import { shopOwnerInfo } from "@/lib/data";
import { type Product } from "@/lib/DatabaseTypes";
import { type Language, useI18n } from "@/context/I18nContext";

const ProductImageGallery = dynamic(() => import("./ProductImageGallery"), {
  loading: () => (
    <div className="w-full aspect-square rounded-lg border border-border bg-muted animate-pulse" />
  ),
});

type ProductDetailsClientProps = {
  initialProduct: Product | null;
};

const productMessages: Record<
  Language,
  {
    notFoundTitle: string;
    notFoundDescription: string;
    backToHome: string;
    home: string;
    categories: string;
    productImages: string;
    previousImage: string;
    nextImage: string;
    thumbnails: string;
    previousSlideMessage: string;
    nextSlideMessage: string;
    selectSize: string;
    selectProductSize: string;
    availableSizes: string;
    selectColor: string;
    selectProductColor: string;
    availableColors: string;
    colorLabel: string;
    priceLabel: string;
    emailLabel: string;
    callLabel: string;
    addToCart: string;
    buyNow: string;
    addProductToCart: string;
    buyProductNow: string;
    addedToCart: string;
    failedToAddToCart: string;
  }
> = {
  en: {
    notFoundTitle: "404 - Product Not Found",
    notFoundDescription:
      "Sorry, the product you are looking for does not exist.",
    backToHome: "Back to Home",
    home: "Home",
    categories: "Categories",
    productImages: "Product images",
    previousImage: "Previous image",
    nextImage: "Next image",
    thumbnails: "Product thumbnail images",
    previousSlideMessage: "View previous product image",
    nextSlideMessage: "View next product image",
    selectSize: "Select Size",
    selectProductSize: "Select product size",
    availableSizes: "Available sizes",
    selectColor: "Select Color",
    selectProductColor: "Select product color",
    availableColors: "Available colors",
    colorLabel: "Color {color}",
    priceLabel: "Price: ${price}",
    emailLabel: "Email {name}",
    callLabel: "Call {name}",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    addProductToCart: "Add product to cart",
    buyProductNow: "Buy product now",
    addedToCart: "Added to cart",
    failedToAddToCart: "Failed to add to cart",
  },
  fr: {
    notFoundTitle: "404 - Produit introuvable",
    notFoundDescription: "Desole, le produit que vous recherchez n'existe pas.",
    backToHome: "Retour a l'accueil",
    home: "Accueil",
    categories: "Categories",
    productImages: "Images du produit",
    previousImage: "Image precedente",
    nextImage: "Image suivante",
    thumbnails: "Miniatures du produit",
    previousSlideMessage: "Voir l'image precedente du produit",
    nextSlideMessage: "Voir l'image suivante du produit",
    selectSize: "Choisir la taille",
    selectProductSize: "Choisir la taille du produit",
    availableSizes: "Tailles disponibles",
    selectColor: "Choisir la couleur",
    selectProductColor: "Choisir la couleur du produit",
    availableColors: "Couleurs disponibles",
    colorLabel: "Couleur {color}",
    priceLabel: "Prix : ${price}",
    emailLabel: "Envoyer un email a {name}",
    callLabel: "Appeler {name}",
    addToCart: "Ajouter au panier",
    buyNow: "Acheter maintenant",
    addProductToCart: "Ajouter le produit au panier",
    buyProductNow: "Acheter ce produit maintenant",
    addedToCart: "Ajoute au panier",
    failedToAddToCart: "Echec de l'ajout au panier",
  },
  ar: {
    notFoundTitle: "404 - المنتج غير موجود",
    notFoundDescription: "عذرا، المنتج الذي تبحث عنه غير موجود.",
    backToHome: "العودة للرئيسية",
    home: "الرئيسية",
    categories: "الفئات",
    productImages: "صور المنتج",
    previousImage: "الصورة السابقة",
    nextImage: "الصورة التالية",
    thumbnails: "الصور المصغرة للمنتج",
    previousSlideMessage: "عرض صورة المنتج السابقة",
    nextSlideMessage: "عرض صورة المنتج التالية",
    selectSize: "اختر المقاس",
    selectProductSize: "اختر مقاس المنتج",
    availableSizes: "المقاسات المتاحة",
    selectColor: "اختر اللون",
    selectProductColor: "اختر لون المنتج",
    availableColors: "الالوان المتاحة",
    colorLabel: "اللون {color}",
    priceLabel: "السعر: ${price}",
    emailLabel: "ارسل بريدا الى {name}",
    callLabel: "اتصل بـ {name}",
    addToCart: "اضافة الى السلة",
    buyNow: "اشتر الآن",
    addProductToCart: "اضافة المنتج الى السلة",
    buyProductNow: "اشتر هذا المنتج الآن",
    addedToCart: "تمت الاضافة الى السلة",
    failedToAddToCart: "فشل اضافة المنتج الى السلة",
  },
};

const ProductDetailsClient = ({ initialProduct }: ProductDetailsClientProps) => {
  const { language, t } = useI18n();
  const copy = productMessages[language];

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [addToCart] = useAddToCartMutation();
  const singleProduct = initialProduct ?? undefined;

  const handleAddToCart = useCallback(async () => {
    if (!singleProduct) return;

    const { default: toast } = await import("react-hot-toast");

    try {
      await addToCart({
        productId: singleProduct.id,
        color: selectedColor,
        name: singleProduct.name,
        price: singleProduct.price,
        size: selectedSize,
        image: singleProduct.mainImage,
        quantity: 1,
      }).unwrap();

      toast.success(copy.addedToCart);
    } catch (error) {
      const typedError = error as { data?: { message?: string } };
      toast.error(typedError?.data?.message || copy.failedToAddToCart);
    }
  }, [
    singleProduct,
    addToCart,
    selectedSize,
    selectedColor,
    copy.addedToCart,
    copy.failedToAddToCart,
  ]);

  const productImages = singleProduct
    ? [singleProduct.mainImage, ...(singleProduct.extraImages ?? [])].filter(Boolean)
    : [];

  if (!singleProduct) {
    return (
      <main
        className="container mx-auto text-center py-16"
        role="alert"
        aria-live="polite"
      >
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          {copy.notFoundTitle}
        </h1>
        <p className="text-muted-foreground mb-6">{copy.notFoundDescription}</p>
        <Button
          asChild
          variant="default"
          size="default"
          className=""
          type="button"
        >
          <Link href="/">{copy.backToHome}</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto container px-4 lg:px-8 py-8">
      <nav
        className="text-sm text-muted-foreground mb-6"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center" role="list">
          <li>
            <Link href="/" className="hover:text-foreground transition">
              {copy.home}
            </Link>
          </li>
          <li aria-hidden="true" className="mx-2">
            /
          </li>
          <li>
            <Link
              href="/allproducts"
              className="hover:text-foreground transition"
            >
              {copy.categories}
            </Link>
          </li>
          <li aria-hidden="true" className="mx-2">
            /
          </li>
          <li aria-current="page">
            <span className="text-foreground font-medium">
              {singleProduct?.name}
            </span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductImageGallery
          productImages={productImages}
          productName={singleProduct?.name}
          copy={copy}
        />

        <section className="space-y-6" aria-label="Product information">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 leading-tight">
              {singleProduct?.name}
            </h1>
            <h2 className="text-lg font-semibold text-muted-foreground">
              {singleProduct?.prod_class}
            </h2>
            <p className="text-muted-foreground">{singleProduct?.bigDesc}</p>
          </div>

          {singleProduct?.sizes && singleProduct.sizes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">{copy.selectSize}</h3>
              <fieldset aria-label={copy.selectProductSize}>
                <legend className="sr-only">{copy.availableSizes}</legend>
                <div className="flex flex-wrap gap-2">
                  {singleProduct.sizes.map((size: string) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 cursor-pointer rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                        selectedSize === size
                          ? "border-primary bg-primary text-white"
                          : "bg-muted hover:bg-muted/50 text-foreground border-transparent"
                      }`}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {singleProduct?.colors && singleProduct.colors.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">
                {copy.selectColor}{" "}
                {selectedColor && (
                  <span className="font-normal text-muted-foreground">
                    - {selectedColor}
                  </span>
                )}
              </h3>

              <fieldset aria-label={copy.selectProductColor}>
                <legend className="sr-only">{copy.availableColors}</legend>
                <div className="flex flex-wrap gap-3">
                  {singleProduct.colors.map((color: string) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full transition-all focus:outline-none focus:ring-2 cursor-pointer ${
                        selectedColor === color
                          ? "ring-2 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-pressed={selectedColor === color}
                      aria-label={t(copy.colorLabel, { color })}
                    />
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          <div className="flex items-baseline gap-3">
            <span
              className="text-4xl font-bold text-orange-600"
              aria-label={t(copy.priceLabel, {
                price: singleProduct?.price ?? 0,
              })}
            >
              ${singleProduct?.price}
            </span>
          </div>

          <Separator className="" />

          <Card className="p-4 bg-muted/50">
            <div className="space-y-3">
              <Link href="/seller" className="no-underline">
                <div className="flex items-center gap-2 mb-3 hover:text-purple-600 transition-colors">
                  <Store
                    className="h-5 w-5 text-purple-600"
                    aria-hidden="true"
                  />
                  <h3 className="font-bold text-lg">{shopOwnerInfo.name}</h3>
                </div>
              </Link>

              <address className="space-y-2 text-sm not-italic">
                <div className="flex items-start gap-2">
                  <MapPin
                    className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-muted-foreground">
                    {shopOwnerInfo.location}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail
                    className="h-4 w-4 text-muted-foreground shrink-0"
                    aria-hidden="true"
                  />
                  <a
                    href={`mailto:${shopOwnerInfo.email}`}
                    className="text-muted-foreground hover:text-purple-600 transition"
                    aria-label={t(copy.emailLabel, {
                      name: shopOwnerInfo.name,
                    })}
                  >
                    {shopOwnerInfo.email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Phone
                    className="h-4 w-4 text-muted-foreground shrink-0"
                    aria-hidden="true"
                  />
                  <a
                    href={`tel:${shopOwnerInfo.phone}`}
                    className="text-muted-foreground hover:text-purple-600 transition"
                    aria-label={t(copy.callLabel, { name: shopOwnerInfo.name })}
                  >
                    {shopOwnerInfo.phone}
                  </a>
                </div>
              </address>
            </div>
          </Card>

          <Separator className="" />

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="default"
                size="lg"
                className="flex-1 p-3 text-base font-semibold"
                onClick={handleAddToCart}
                type="button"
                aria-label={copy.addProductToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" aria-hidden="true" />
                {copy.addToCart}
              </Button>

              <Link href="/completeorder" className="flex-1">
                <Button
                  size="lg"
                  variant="secondary"
                  className="flex-1 w-full text-base font-semibold"
                  type="button"
                  aria-label={copy.buyProductNow}
                >
                  {copy.buyNow}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default memo(ProductDetailsClient);
