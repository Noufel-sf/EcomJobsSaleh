"use client";

import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/DatabaseTypes";

interface SponsoredProductsCarouselProps {
  sponsoredProducts: Product[];
}

const SponsoredProductsCarousel = memo(function SponsoredProductsCarousel({
  sponsoredProducts,
}: SponsoredProductsCarouselProps) {
  return (
    <>
      <div className="heading mb-6 flex items-center justify-between">
        <div />

        <div className="flex items-center gap-3">
          <button
            className="sponsored-products-prev w-8 h-8 px-2 rounded-lg flex cursor-pointer items-center justify-center bg-orange-500 hover:bg-orange-600 transition-all duration-200"
            aria-label="Previous products"
            type="button"
          >
            <ChevronLeft className="text-white" />
          </button>

          <button
            className="sponsored-products-next w-8 h-8 px-2 rounded-lg flex cursor-pointer items-center justify-center bg-orange-500 hover:bg-orange-600 transition-all duration-200"
            aria-label="Next products"
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
          nextEl: ".sponsored-products-next",
          prevEl: ".sponsored-products-prev",
        }}
        breakpoints={{
          0: { slidesPerView: 2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="testimonial-swiper grid grid-cols-2"
      >
        {sponsoredProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
});

export default SponsoredProductsCarousel;
