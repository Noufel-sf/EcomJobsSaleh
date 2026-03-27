import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import hero1 from "@assets/hero1.png";
import hero2 from "@assets/hero2.png";
import hero3 from "@assets/hero3.png";
import hero4 from "@assets/hero4.png";

export function JobsHero() {
  const heroImages = [hero1, hero2, hero3, hero4];

  return (
    <section
      className="px-4 sm:px-6 py-6 sm:py-12 mx-auto container flex items-stretch gap-5 min-h-75 sm:min-h-125"
      aria-label="Promotional banners"
    >
      <Swiper
        navigation={{
          prevEl: ".custom-prev-jobs",
          nextEl: ".custom-next-jobs",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Autoplay]}
        className="mySwiper rounded-sm shadow-lg flex-1"
      >
        {heroImages.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image}
              alt={`Job promotional banner ${index + 1}`}
              className="w-full h-full cursor-pointer object-cover"
              width={1200}
              height={500}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </SwiperSlide>
        ))}

        <button
          className="custom-prev-jobs absolute cursor-pointer left-4 top-1/2 z-20 -translate-y-1/2 bg-white dark:bg-zinc-800 shadow-md p-2 rounded-full text-xl hover:bg-red-500 hover:text-white transition"
          aria-label="Previous slide"
        >
          <ChevronLeft />
        </button>

        <button
          className="custom-next-jobs cursor-pointer absolute right-4 top-1/2 z-20 -translate-y-1/2 bg-white dark:bg-zinc-800 shadow-md p-2 rounded-full text-xl hover:bg-red-500 hover:text-white transition"
          aria-label="Next slide"
        >
          <ChevronRight />
        </button>
      </Swiper>
      <div className="hidden lg:flex max-w-[20%] items-center cursor-pointer">
        <Image
          src="/sp2.png"
          alt="Sponsored advertisement"
          width={400}
          height={500}
          className="w-full h-full object-cover rounded-sm shadow-lg"
          loading="lazy"
        />
      </div>
    </section>
  );
}
