import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import DeferredBestSellingCarousel from "./DeferredBestSellingCarousel";
import LocalizedSectionTitle from "./LocalizedSectionTitle";
import type { Product } from "@/lib/DatabaseTypes";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";

async function getBestSellingProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products/bestSelling`, {
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

export default async function BestSellingSection() {
  const products = await getBestSellingProducts();

  return (
    <section
      className="py-20 bg-linear-to-b from-background to-muted/20"
      aria-labelledby="best-selling-heading"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="max-w-4xl">
            <LocalizedSectionTitle
              id="best-selling-heading"
              className="mb-6"
              labels={{
                en: "Best Selling Products",
                fr: "Produits les plus vendus",
                ar: "المنتجات الاكثر مبيعا",
              }}
            />
          </div>
        </div>

        {/* Carousel */}
        {products.length > 0 ? (
          <>
            <DeferredBestSellingCarousel products={products} />

            {/* CTA */}
            <div className="text-center">
              <Link href="/products" prefetch className="inline-block">
                <Button
                  size="lg"
                  variant="default"
                  className="mt-8 bg-primary hover:bg-primary/90 transition-colors"
                  aria-label="Browse all available products"
                >
                  View All Products
                  <ShoppingCart className="w-5 h-5 ml-2" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="mb-12 text-center py-8 text-muted-foreground">
            <p>No products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}