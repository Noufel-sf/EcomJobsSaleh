"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { Job } from "@/lib/DatabaseTypes";
import { useDeferredVisibility } from "./lazy/useDeferredVisibility";

const JobsCarousel = dynamic(() => import("./JobsCarousel"), {
  ssr: false,
});

const skeletonCount = 4;

function CarouselFallback() {
  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <div
          key={`jobs-skeleton-${index}`}
          className="animate-pulse rounded-xl border bg-card p-4 space-y-3"
        >
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-9 w-full mt-4" />
        </div>
      ))}
    </div>
  );
}

export default function DeferredJobsCarousel({ jobs }: { jobs: Job[] }) {
  const { containerRef, isVisible } = useDeferredVisibility<HTMLDivElement>();

  return (
    <div ref={containerRef}>
      {isVisible ? <JobsCarousel jobs={jobs} /> : <CarouselFallback />}
    </div>
  );
}