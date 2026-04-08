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
import {useGetSponsoredProductsQuery } from "@/Redux/Services/ProductsApi";
import { Product } from "@/lib/DatabaseTypes";
import ProductCard from "./ProductCard";

const SponsoredProducts = memo(function SponsoredProducts() {
  const swiperRef = useRef<SwiperType | null>(null);

  const {
    data: ProductsData,
    isLoading,
    isError,
    refetch,
  } = useGetSponsoredProductsQuery(undefined);

  const sponsoredProducts = ProductsData?.content || [];

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <section
      className="mx-auto container px-6 py-12"
      aria-labelledby="sponsored-products-heading"
    >
      <div className="heading mb-6 flex items-center justify-between">
        <h2
          id="sponsored-products-heading"
          className="capitalize text-2xl font-bold"
        >
          Sponsored Products
        </h2>

        <div className="flex items-center gap-3">
          <button
            className="sponsored-products-prev w-8 h-8 px-2 rounded-lg flex cursor-pointer items-center justify-center bg-orange-500 hover:bg-orange-600 transition-all duration-200"
            aria-label="Previous products"
          >
            <ChevronLeft className="text-white" />
          </button>

          <button
            className="sponsored-products-next w-8 h-8 px-2 rounded-lg flex cursor-pointer items-center justify-center bg-orange-500 hover:bg-orange-600 transition-all duration-200"
            aria-label="Next products"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      </div>

      {isError ? (
        <div className="text-center py-8 text-red-500">
          <p>Failed to load sponsored products.</p>
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
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <SwiperSlide key={`skeleton-${i}`}>
                    <SkeletonCard />
                  </SwiperSlide>
                ))
              : sponsoredProducts.map((product: Product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
          </Swiper>

          {!isLoading && sponsoredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No sponsored products available at the moment.</p>
            </div>
          )}

          {!isLoading && sponsoredProducts.length > 0 && (
            <div className="text-center">
              <Link href="/products">
                <Button
                  size="lg"
                  variant="default"
                  className="mt-8 mx-auto bg-primary hover:bg-primary/90 flex items-center gap-2"
                >
                  View All Products
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

export default SponsoredProducts;
