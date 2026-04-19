"use client";

import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import JobCard from "./JobCard";
import type { Job } from "@/lib/DatabaseTypes";

interface SponsoredJobsCarouselProps {
  sponsoredJobs: Job[];
}

const SponsoredJobsCarousel = memo(function SponsoredJobsCarousel({
  sponsoredJobs,
}: SponsoredJobsCarouselProps) {
  return (
    <>
      <div className="heading mb-6 flex items-center justify-between">
        <div />

        <div className="flex items-center gap-3">
          <button
            className="sponsored-jobs-prev w-8 h-8 px-2 rounded-lg flex cursor-pointer items-center justify-center bg-primary hover:bg-primary/10 transition-all duration-200"
            aria-label="Previous jobs"
            type="button"
          >
            <ChevronLeft className="text-white" />
          </button>

          <button
            className="sponsored-jobs-next w-8 h-8 px-2 rounded-lg flex cursor-pointer items-center justify-center bg-primary hover:bg-primary/10 transition-all duration-200"
            aria-label="Next jobs"
            type="button"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      </div>

      <Swiper
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
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="mb-12"
      >
        {sponsoredJobs.map((job) => (
          <SwiperSlide key={job.id}>
            <JobCard job={job} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
});

export default SponsoredJobsCarousel;