import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import Hero component to reduce initial bundle size
const Hero = dynamic(() => import("@/components/Hero"), {
  loading: () => (
    <div className="h-[500px] animate-pulse bg-muted rounded-lg" />
  ),
});

// Best selling and sponsored sections - load with priority
const SponsoredSection = dynamic(
  () => import("@/components/SponsoredSection"),
  {
    loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
  },
);

const BestSellingSection = dynamic(
  () => import("@/components/BestSellingSection"),
  {
    loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
  },
);


const JobsSection = dynamic(() => import("@/components/JobsSection"), {
  loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
});

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

const HomePage = () => {
  return (
    <div>
      {/* <h1 className="sr-only">Saleh Store - Your Trusted Online Marketplace for Quality Products</h1> */}
      <Suspense
        fallback={
          <div className="h-[500px] animate-pulse bg-muted rounded-lg" />
        }
      >
        <Hero />
      </Suspense>

      <Suspense
        fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}
      >
        <BestSellingSection />
      </Suspense>

      <Suspense
        fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}
      >
        <SponsoredSection />
      </Suspense>



      <Suspense
        fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}
      >
        <JobsSection />
      </Suspense>
    </div>
  );
};

export default HomePage;
