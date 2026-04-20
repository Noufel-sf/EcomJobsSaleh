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
    <>
      {/* Navigation buttons placeholder for consistent layout */}
      <div className="heading mb-6 flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 px-2 rounded-lg bg-orange-500" />
          <div className="w-8 h-8 px-2 rounded-lg bg-orange-500" />
        </div>
      </div>

      {/* Skeleton grid matching Swiper breakpoints */}
      <div
        className="grid gap-[30px] grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        aria-hidden="true"
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={`best-selling-skeleton-${index}`} />
        ))}
      </div>
    </>
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