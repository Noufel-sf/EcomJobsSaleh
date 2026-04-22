"use client";

import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type HeroSponsor = {
  image?: string;
  sponsorLink?: string;
  description?: string;
};

interface HeroCarouselProps {
  sponsors: HeroSponsor[];
}

const HeroCarousel = memo(function HeroCarousel({ sponsors }: HeroCarouselProps) {
  if (sponsors.length === 0) {
    return <div className="rounded-sm shadow-lg flex-1 bg-muted animate-pulse" />;
  }

  return (
    <Swiper
      navigation={{
        prevEl: ".custom-prev",
        nextEl: ".custom-next",
      }}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      modules={[Navigation, Autoplay]}
      className="mySwiper rounded-sm shadow-lg flex-1"
    >
      {sponsors.map((sponsor, index) => {
        const imageSrc = sponsor.image || "/placeholder.png";
        const href = sponsor.sponsorLink || "#";

        return (
          <SwiperSlide key={`${imageSrc}-${index}`} className="relative!">
            <Link href={href} target="_blank" rel="noopener noreferrer">
              <Image
                src={imageSrc}
                alt={sponsor.description || `Sponsor banner ${index + 1}`}
                className="w-full h-full cursor-pointer object-cover"
                fill
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "auto"}
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </Link>
          </SwiperSlide>
        );
      })}

      <button
        className="custom-prev absolute cursor-pointer left-4 top-1/2 z-20 -translate-y-1/2 bg-white dark:bg-zinc-800 shadow-md p-2 rounded-full text-xl hover:bg-red-500 hover:text-white transition"
        type="button"
        aria-label="Previous sponsor"
      >
        <ChevronLeft />
      </button>

      <button
        className="custom-next cursor-pointer absolute right-4 top-1/2 z-20 -translate-y-1/2 bg-white dark:bg-zinc-800 shadow-md p-2 rounded-full text-xl hover:bg-red-500 hover:text-white transition"
        type="button"
        aria-label="Next sponsor"
      >
        <ChevronRight />
      </button>
    </Swiper>
  );
});

export default HeroCarousel;
