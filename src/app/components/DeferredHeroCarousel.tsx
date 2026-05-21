"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";

type HeroSponsor = {
  image?: string;
  sponsorLink?: string;
  description?: string;
};

interface DeferredHeroCarouselProps {
  sponsors: HeroSponsor[];
}

const LazyHeroCarousel = dynamic(() => import("./HeroCarousel"), {
  ssr: false,
  loading: () => <div className="rounded-sm shadow-lg flex-1 bg-muted animate-pulse min-h-[180px] sm:min-h-[240px] lg:min-h-[320px]" />,
});

export default function DeferredHeroCarousel({ sponsors }: DeferredHeroCarouselProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;
    let idleId: number | undefined;

    if (typeof window === "undefined") {
      return;
    }

    const browserWindow = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof browserWindow.requestIdleCallback === "function") {
      idleId = browserWindow.requestIdleCallback(
        () => {
          setShouldLoad(true);
        },
        { timeout: 1500 },
      );
    } else {
      timeoutId = browserWindow.setTimeout(() => {
        setShouldLoad(true);
      }, 600);
    }

    return () => {
      if (idleId !== undefined && typeof browserWindow.cancelIdleCallback === "function") {
        browserWindow.cancelIdleCallback(idleId);
      }

      if (timeoutId !== undefined) {
        browserWindow.clearTimeout(timeoutId);
      }
    };
  }, []);

  const firstSponsor = useMemo(() => sponsors[0], [sponsors]);

  if (!shouldLoad) {
    if (!firstSponsor?.image) {
      return <div className="rounded-sm shadow-lg flex-1 bg-muted animate-pulse min-h-[180px] sm:min-h-[240px] lg:min-h-[320px]" />;
    }

    return (
      <div className="relative h-[180px] flex-1 overflow-hidden rounded-sm shadow-lg sm:h-[240px] lg:h-[320px]">
        <Link
          href={firstSponsor.sponsorLink || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 block"
        >
          <Image
            src={firstSponsor.image}
            alt={firstSponsor.description || "Featured sponsor banner"}
            className="cursor-pointer object-cover"
            fill
            priority
            fetchPriority="high"
            loading="eager"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw"
          />
        </Link>
      </div>
    );
  }

  return <LazyHeroCarousel sponsors={sponsors} />;
}