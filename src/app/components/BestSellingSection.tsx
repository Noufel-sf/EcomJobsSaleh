import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import BestSellingCarousel from "./BestSellingCarousel";
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
      className="mx-auto container px-6 py-12"
      aria-labelledby="best-selling-heading"
    >
      <div className="heading mb-6 flex items-center justify-between">
        <h2 id="best-selling-heading" className="capitalize text-2xl font-bold">
          Best Selling Products
        </h2>
      </div>

      {products.length > 0 ? (
        <>
          <BestSellingCarousel products={products} />

          <div className="text-center">
            <Link href="/products" prefetch>
              <Button
                size="lg"
                variant="default"
                className="mt-8 mx-auto bg-primary hover:bg-primary/90 flex items-center gap-2"
              >
                View All Best Selling Products
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No products available at the moment.</p>
        </div>
      )}
    </section>
  );
}