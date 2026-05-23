"use client";

import dynamic from "next/dynamic";

type CategoryCard = {
  id: string;
  title: string;
  href: string;
  img?: string;
  accent: string;
};

const LazyCategorysCarousel = dynamic(() => import("./CategorysCarousel"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`category-skeleton-${index}`}
          className="h-28 animate-pulse rounded-2xl border bg-muted"
        />
      ))}
    </div>
  ),
});

export default function DeferredCategorysCarousel({
  categories,
}: {
  categories: CategoryCard[];
}) {
  return <LazyCategorysCarousel categories={categories} />;
}
