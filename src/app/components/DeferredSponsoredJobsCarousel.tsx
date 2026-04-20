"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { Job } from "@/lib/DatabaseTypes";
import { useDeferredVisibility } from "./lazy/useDeferredVisibility";

const SponsoredJobsCarousel = dynamic(() => import("./SponsoredJobsCarousel"), {
  ssr: false,
});

const skeletonCount = 5;

function CarouselFallback() {
  return (
    <div className="min-h-105" aria-hidden="true">
      <div className="heading mb-6 flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary" />
          <div className="w-8 h-8 rounded-lg bg-primary" />
        </div>
      </div>
      <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div
            key={`sponsored-jobs-skeleton-${index}`}
            className="animate-pulse rounded-xl border bg-card p-4 space-y-3"
          >
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-9 w-full mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DeferredSponsoredJobsCarousel({
  sponsoredJobs,
}: {
  sponsoredJobs: Job[];
}) {
  const { containerRef, isVisible } = useDeferredVisibility<HTMLDivElement>();

  return (
    <div ref={containerRef}>
      {isVisible ? (
        <SponsoredJobsCarousel sponsoredJobs={sponsoredJobs} />
      ) : (
        <CarouselFallback />
      )}
    </div>
  );
}