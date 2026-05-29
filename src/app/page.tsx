import type { Metadata } from "next";
import { Suspense } from "react";
import Hero from "@/components/Hero";
import CategorysSection from "@/components/CategorysSection";
import BestSellingSection from "@/components/BestSellingSection";
import SponsoredProductsSection from "@/components/sponsoredProducts";
import SponsoredJobsSection from "@/components/SponsoredJobs";
import JobsSection from "@/components/JobsSection";
import { SkeletonCard } from "@/components/SkeletonCard";

const SectionFallback = ({
  sectionClassName,
}: {
  sectionClassName: string;
}) => (
  <section className={sectionClassName} aria-hidden="true">
    <div className="mx-auto container px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonCard key={`fallback-${index}`} />
        ))}
      </div>
    </div>
  </section>
);

const HeroFallback = () => (
  <section
    className="mx-auto container flex items-start gap-5 px-6 py-6 sm:py-8 lg:items-stretch lg:py-12 lg:min-h-125"
    aria-hidden="true"
  >
    <div className="h-[180px] animate-pulse rounded-lg bg-muted flex-1 sm:h-[240px] lg:h-125" />
    <div className="hidden lg:block w-[20%] h-125 animate-pulse bg-muted rounded-lg" />
  </section>
);

export const metadata: Metadata = {
  title: "Saleh Store - Your Trusted Online Marketplace",
  description:
    "Shop quality products at great prices. Browse electronics, fashion, home goods and more. Fast shipping, secure checkout, and excellent customer service.",
  keywords: [
    "online store",
    "ecommerce",
    "electronics",
    "shopping",
    "marketplace",
    "best deals",
  ],
  authors: [{ name: "Saleh Store" }],
  openGraph: {
    title: "Saleh Store - Your Trusted Online Marketplace",
    description:
      "Shop quality products at great prices with fast shipping and secure checkout.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saleh Store - Your Trusted Online Marketplace",
    description:
      "Shop quality products at great prices with fast shipping and secure checkout.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const HomePage = async () => {
  return (
    <div>
      <Suspense fallback={<HeroFallback />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<SectionFallback sectionClassName="" />}>
        <CategorysSection />
      </Suspense>
      {/* <Suspense fallback={<SectionFallback sectionClassName="" />}>
        <BestSellingSection />
      </Suspense>
      <Suspense fallback={<SectionFallback sectionClassName="" />}>
        <SponsoredProductsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback sectionClassName="" />}>
        <SponsoredJobsSection />
      </Suspense> */}
      <Suspense
        fallback={
          <SectionFallback sectionClassName="py-20 bg-linear-to-b from-background to-muted/20" />
        }
      >
        <JobsSection />
      </Suspense>
    </div>
  );
};

export default HomePage;
