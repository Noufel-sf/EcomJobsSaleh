import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import DeferredSponsoredProductsCarousel from "@/components/DeferredSponsoredProductsCarousel";
import LocalizedSectionTitle from "./LocalizedSectionTitle";
import type { Product } from "@/lib/DatabaseTypes";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";

async function getSponsoredProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products/sponsored`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { content?: Product[] };
    return data.content ?? [];
  } catch {
    return [];
  }
}

export default async function SponsoredProducts() {
  const sponsoredProducts = await getSponsoredProducts();

  return (
    <section
      className="mx-auto container px-6 py-12"
      aria-labelledby="sponsored-products-heading"
    >
      <div className="mb-6 flex items-center justify-between">
        <LocalizedSectionTitle
          id="sponsored-products-heading"
          labels={{
            en: "Sponsored Products",
            fr: "Produits sponsorises",
            ar: "منتجات ممولة",
          }}
        />
      </div>

      {sponsoredProducts.length > 0 ? (
        <>
          <DeferredSponsoredProductsCarousel
            sponsoredProducts={sponsoredProducts}
          />

          <div className="text-center">
            <Link href="/products" prefetch>
              <Button
                size="lg"
                variant="default"
                className="mt-8 mx-auto bg-primary hover:bg-primary/90 flex items-center gap-2"
              >
                View All Products
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No sponsored products available at the moment.</p>
        </div>
      )}
    </section>
  );
}
