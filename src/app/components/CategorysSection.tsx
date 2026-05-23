import Link from "next/link";
import { Button } from "./ui/button";
import LocalizedSectionTitle from "./LocalizedSectionTitle";
import DeferredCategorysCarousel from "./DeferredCategorysCarousel";
import type { Classification } from "@/lib/DatabaseTypes";

type ClassificationsResponse = {
  content?: Classification[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";

const categoryAccents = [
  "bg-sky-50 border-sky-200",
  "bg-emerald-50 border-emerald-200",
  "bg-amber-50 border-amber-200",
  "bg-rose-50 border-rose-200",
  "bg-indigo-50 border-indigo-200",
  "bg-teal-50 border-teal-200",
];

async function getClassifications(): Promise<Classification[]> {
  try {
    const response = await fetch(`${API_URL}/classifications`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as ClassificationsResponse;
    return data.content ?? [];
  } catch {
    return [];
  }
}

export default async function CategorysSection() {
  const classifications = await getClassifications();
  const categories = classifications.map((classification, index) => ({
    id: classification.id,
    title: classification.name,
    href: `/products?classification=${classification.id}`,
    img: classification.img ?? "/phone.png",
    accent: categoryAccents[index % categoryAccents.length],
  }));

  return (
    <section className="mx-auto container px-6 py-12" aria-labelledby="categories-heading">
      <div className="mb-6 flex items-center justify-between">
        <LocalizedSectionTitle
          id="categories-heading"
          labels={{
            en: "Browse Categories",
            fr: "Parcourir les categories",
            ar: "تصفح الفئات المنتجات",
          }}
        />

        <Link href="/products" prefetch className="hidden text-sm font-medium text-primary hover:underline sm:inline-flex">
          View all
        </Link>
      </div>

      <div className="rounded-3xl  sm:p-6">
        <DeferredCategorysCarousel categories={categories} />
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Button asChild size="lg" variant="default" className="bg-primary hover:bg-primary/90">
          <Link href="/products" prefetch>
            View all categories
          </Link>
        </Button>
      </div>
    </section>
  );
}
