import type { Metadata } from "next";
import dynamic from "next/dynamic";

// Dynamically import components with built-in loading UI
const Hero = dynamic(() => import("@/components/Hero"), {
  loading: () => <div className="h-125 animate-pulse bg-muted rounded-lg" />,
});

const BestSellingSection = dynamic(
  () => import("@/components/BestSellingSection"),
  {
    loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
  },
);
const SponsoredProductsSection = dynamic(
  () => import("@/components/sponsoredProducts"),
  {
    loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
  },
);
const SponsoredJobsSection = dynamic(
  () => import("@/components/SponsoredJobs"),
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
      <Hero />
      <BestSellingSection />
      <SponsoredProductsSection />
      <SponsoredJobsSection />
      <JobsSection />
    </div>
  );
};

export default HomePage;
