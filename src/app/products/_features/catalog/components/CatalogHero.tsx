import { Suspense } from "react";
import Hero from "@/components/Hero";

const HeroFallback = () => (
  <section
    className="px-6 py-12 mx-auto container flex items-stretch gap-5 min-h-125"
    aria-hidden="true"
  >
    <div className="h-125 animate-pulse bg-muted rounded-lg flex-1" />
    <div className="hidden lg:block w-[20%] h-125 animate-pulse bg-muted rounded-lg" />
  </section>
);

export function CatalogHero() {
  return (
    <Suspense fallback={<HeroFallback />}>
      <Hero />
    </Suspense>
  );
}
