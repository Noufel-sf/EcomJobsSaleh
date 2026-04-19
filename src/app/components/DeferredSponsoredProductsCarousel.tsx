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
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
      aria-hidden="true"
    >
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <ProductCardSkeleton key={`sponsored-products-skeleton-${index}`} />
      ))}
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