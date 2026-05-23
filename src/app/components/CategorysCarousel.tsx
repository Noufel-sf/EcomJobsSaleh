"use client";

import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type CategoryCard = {
  id: string;
  title: string;
  href: string;
  img?: string;
  accent: string;
};

interface CategorysCarouselProps {
  categories: CategoryCard[];
}

const CategorysCarousel = memo(function CategorysCarousel({
  categories,
}: CategorysCarouselProps) {
  return (
    <div className="relative">
   

      <Swiper
        spaceBetween={16}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 2800,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          nextEl: ".category-next",
          prevEl: ".category-prev",
        }}
        breakpoints={{
          0: { slidesPerView: 2.2 },
          480: { slidesPerView: 3.2 },
          768: { slidesPerView: 4.2 },
          1024: { slidesPerView: 5.2 },
          1280: { slidesPerView: 6.2 },
        }}
        className="pb-2"
      >
        {categories.map((category) => {

          return (
            <SwiperSlide key={category.id} className="h-auto">
              <Link href={category.href} prefetch className="block h-full">
                <div className="flex h-full flex-col items-center justify-start gap-3 rounded-2xl p-3 text-center  transition-transform duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-md sm:p-4">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full border  ${category.accent} shadow-inner sm:h-18 sm:w-18`}
                  >
                    <Image 
                        src={category.img || "/phone.png"}
                        alt={category.title}
                        className="h-8 w-8 object-contain sm:h-10 sm:w-10"
                        width={40}
                        height={40}
                    />
                  </div>
                  <span className="line-clamp-2 text-xs leading-4 sm:text-sm">
                    {category.title}
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
});

export default CategorysCarousel;
