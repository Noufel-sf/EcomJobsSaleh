import Link from "next/link";
import { Button } from "./ui/button";
import LocalizedSectionTitle from "./LocalizedSectionTitle";
import DeferredCategorysCarousel from "./DeferredCategorysCarousel";

const fakeCategories = [
    { id: "1", title: "Electronics", href: "/products?category=electronics",img:"/phone.png" },
];

export default function CategorysSection() {
  return (
    <section className="mx-auto container px-6 py-12" aria-labelledby="categories-heading">
      <div className="mb-6 flex items-center justify-between">
        <LocalizedSectionTitle
          id="categories-heading"
          labels={{
            en: "Browse Categories",
            fr: "Parcourir les categories",
            ar: "تصفح الفئات",
          }}
        />

        <Link href="/products" prefetch className="hidden text-sm font-medium text-primary hover:underline sm:inline-flex">
          View all
        </Link>
      </div>

      <div className="rounded-3xl  sm:p-6">
        <DeferredCategorysCarousel categories={fakeCategories} />
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
