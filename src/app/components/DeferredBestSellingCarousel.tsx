"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/lib/DatabaseTypes";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useDeferredVisibility } from "./lazy/useDeferredVisibility";

const BestSellingCarousel = dynamic(() => import("./BestSellingCarousel"), {
  ssr: false,
});

const skeletonCount = 5;

function CarouselFallback() {
  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
      aria-hidden="true"
    >
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <ProductCardSkeleton key={`best-selling-skeleton-${index}`} />
      ))}
    </div>
  );
}

export default function DeferredBestSellingCarousel({
  products,
}: {
  products: Product[];
}) {
  const { containerRef, isVisible } = useDeferredVisibility<HTMLDivElement>();

  return (
    <div ref={containerRef}>
      {isVisible ? (
        <BestSellingCarousel products={products} />
      ) : (
        <CarouselFallback />
      )}
    </div>
  );
}