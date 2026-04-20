"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/lib/DatabaseTypes";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useDeferredVisibility } from "./lazy/useDeferredVisibility";

const SponsoredProductsCarousel = dynamic(
  () => import("./SponsoredProductsCarousel"),
  {
    ssr: false,
  },
);

const skeletonCount = 5;

function CarouselFallback() {
  return (
    <div className="min-h-90" aria-hidden="true">
      <div className="heading mb-6 flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 px-2 rounded-lg bg-orange-500" />
          <div className="w-8 h-8 px-2 rounded-lg bg-orange-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-[30px] md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={`sponsored-products-skeleton-${index}`} />
        ))}
      </div>
    </div>
  );
}

export default function DeferredSponsoredProductsCarousel({
  sponsoredProducts,
}: {
  sponsoredProducts: Product[];
}) {
  const { containerRef, isVisible } = useDeferredVisibility<HTMLDivElement>();

  return (
    <div ref={containerRef}>
      {isVisible ? (
        <SponsoredProductsCarousel sponsoredProducts={sponsoredProducts} />
      ) : (
        <CarouselFallback />
      )}
    </div>
  );
}