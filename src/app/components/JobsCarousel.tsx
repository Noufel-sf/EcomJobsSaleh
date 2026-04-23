"use client";

import { memo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import JobCard from "./JobCard";
import type { Job } from "@/lib/DatabaseTypes";

interface JobsCarouselProps {
  jobs: Job[];
}

const JobsCarousel = memo(function JobsCarousel({ jobs }: JobsCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <>
      <div className="flex items-center gap-3 mb-5" role="group" aria-label="Job carousel navigation">
        <button
          className="jobs-prev w-8 h-8 px-2 rounded-lg flex items-center justify-center bg-primary hover:bg-primary/90 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Previous jobs"
          type="button"
        >
          <ChevronLeft className="text-white" aria-hidden="true" />
        </button>
        <button
          className="jobs-next w-8 h-8 px-2 rounded-lg flex items-center justify-center bg-primary hover:bg-primary/90 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Next jobs"
          type="button"
        >
          <ChevronRight className="text-white" aria-hidden="true" />
        </button>
      </div>

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={30}
        modules={[Pagination, Navigation, Autoplay]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        navigation={{
          nextEl: ".jobs-next",
          prevEl: ".jobs-prev",
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        className="mb-12"
        a11y={{
          enabled: true,
          prevSlideMessage: "Previous job",
          nextSlideMessage: "Next job",
        }}
      >
        {jobs.map((job) => (
          <SwiperSlide key={job.id}>
            <JobCard job={job} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
});

export default JobsCarousel;