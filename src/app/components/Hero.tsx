"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { memo } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { useGetsponsorsQuery } from "@/Redux/Services/SponsorApi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  // Memoize hero images array to prevent recreation on every render

  const { data: sponsorsData, isLoading } = useGetsponsorsQuery();
  const sponsors = sponsorsData?.content ?? [];

  return (
    <>
      <section className="px-6 py-12 mx-auto container flex items-stretch gap-5 min-h-125">
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
            return (
              <SwiperSlide key={index} className="relative!">
                <Link
                  href={sponsor.sponsorLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={sponsor.image}
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

          <button className="custom-prev absolute cursor-pointer left-4 top-1/2 z-20 -translate-y-1/2 bg-white dark:bg-zinc-800 shadow-md p-2 rounded-full text-xl hover:bg-red-500 hover:text-white transition">
            <ChevronLeft />
          </button>

          <button className="custom-next cursor-pointer absolute right-4 top-1/2 z-20 -translate-y-1/2 bg-white dark:bg-zinc-800 shadow-md p-2 rounded-full text-xl hover:bg-red-500 hover:text-white transition">
            <ChevronRight />
          </button>
        </Swiper>
        <div className="hidden lg:flex max-w-[20%]  items-center cursor-pointer relative">
          <Image
            src="/sp2.png"
            alt="Sponsored advertisement"
            className="w-full h-full object-cover rounded-sm shadow-lg"
            fill
            loading="lazy"
            sizes="20vw"
          />
        </div>
      </section>
    </>
  );
};

export default memo(Hero);
