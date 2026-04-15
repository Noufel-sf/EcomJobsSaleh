"use client";

import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Autoplay, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

type GalleryCopy = {
  productImages: string;
  previousImage: string;
  nextImage: string;
  thumbnails: string;
  previousSlideMessage: string;
  nextSlideMessage: string;
};

type ProductImageGalleryProps = {
  productImages: string[];
  productName?: string;
  copy: GalleryCopy;
};

export default function ProductImageGallery({
  productImages,
  productName,
  copy,
}: ProductImageGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  if (productImages.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4" aria-label={copy.productImages}>
      <div className="relative group">
        <Swiper
          spaceBetween={10}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          thumbs={{
            swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Navigation, Autoplay, Thumbs]}
          className="w-full aspect-square rounded-lg border border-border bg-background"
          a11y={{
            enabled: true,
            prevSlideMessage: copy.previousSlideMessage,
            nextSlideMessage: copy.nextSlideMessage,
          }}
        >
          {productImages.map((img, idx) => (
            <SwiperSlide key={`main-image-${idx}`}>
              <Card className="flex items-center justify-center h-full p-8">
                <Image
                  src={img}
                  className="w-full lg:w-2/3 object-contain"
                  alt={`${productName ?? "Product"} - Image ${idx + 1}`}
                  priority={idx === 0}
                  loading={idx === 0 ? "eager" : "lazy"}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  quality={75}
                  width={600}
                  height={600}
                />
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className="swiper-button-prev-custom cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label={copy.previousImage}
          type="button"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          className="swiper-button-next-custom absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label={copy.nextImage}
          type="button"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={5}
        watchSlidesProgress={true}
        modules={[Thumbs]}
        className="w-full"
        role="group"
        aria-label={copy.thumbnails}
      >
        {productImages.map((img, idx) => (
          <SwiperSlide key={`thumbnail-${idx}`}>
            <Card className="cursor-pointer h-24 flex items-center justify-center p-2 hover:border-purple-500 transition focus-within:ring-2 focus-within:ring-purple-500">
              <Image
                src={img}
                alt={`${productName ?? "Product"} thumbnail ${idx + 1}`}
                className="w-full h-full object-contain"
                loading="lazy"
                sizes="96px"
                quality={65}
                width={120}
                height={120}
              />
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
