"use client";

import { useRef, memo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { SkeletonCard } from "./SkeletonCard";
import { useGetSponsoredJobsQuery } from "@/Redux/Services/JobApi";
import { Job } from "@/lib/DatabaseTypes";
import JobCard from "./JobCard";

const SponsoredJobs = memo(function SponsoredJobs() {
  const swiperRef = useRef<SwiperType | null>(null);

  const {
    data: JobsData,
    isLoading,
    isError,
    refetch,
  } = useGetSponsoredJobsQuery(undefined);

  const sponsoredJobs = JobsData?.content || [];

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <section
      className="mx-auto container px-6 py-12"
      aria-labelledby="sponsored-jobs-heading"
    >
      <div className="heading mb-6 flex items-center justify-between">
        <h2
          id="sponsored-jobs-heading"
          className="capitalize text-2xl font-bold"
        >
          Sponsored Jobs
        </h2>

        <div className="flex items-center gap-3">
          <button
            className="sponsored-jobs-prev w-8 h-8 px-2 rounded-lg flex cursor-pointer items-center justify-center bg-orange-500 hover:bg-orange-600 transition-all duration-200"
            aria-label="Previous jobs"
          >
            <ChevronLeft className="text-white" />
          </button>

          <button
            className="sponsored-jobs-next w-8 h-8 px-2 rounded-lg flex cursor-pointer items-center justify-center bg-orange-500 hover:bg-orange-600 transition-all duration-200"
            aria-label="Next jobs"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      </div>

      {isError ? (
        <div className="text-center py-8 text-red-500">
          <p>Failed to load sponsored jobs.</p>
          <Button
            onClick={handleRetry}
            className="mt-4"
            variant="default"
            size="default"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={30}
            modules={[Pagination, Navigation, Autoplay]}
            autoplay={{
              delay: 3500,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: ".sponsored-jobs-next",
              prevEl: ".sponsored-jobs-prev",
            }}
            breakpoints={{
              0: { slidesPerView: 2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            className="testimonial-swiper grid grid-cols-2"
          >
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <SwiperSlide key={`skeleton-${i}`}>
                    <SkeletonCard />
                  </SwiperSlide>
                ))
              : sponsoredJobs.map((job: Job) => (
                  <SwiperSlide key={job.id}>
                    <JobCard job={job} />
                  </SwiperSlide>
                ))}
          </Swiper>

          {!isLoading && sponsoredJobs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No sponsored jobs available at the moment.</p>
            </div>
          )}

          {!isLoading && sponsoredJobs.length > 0 && (
            <div className="text-center">
              <Link href="/jobs">
                <Button
                  size="lg"
                  variant="default"
                  className="mt-8 mx-auto bg-primary hover:bg-primary/90 flex items-center gap-2"
                >
                  View All Jobs
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
});

export default SponsoredJobs;
