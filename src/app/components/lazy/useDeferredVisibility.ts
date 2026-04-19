"use client";

import { useEffect, useRef, useState } from "react";

type DeferredVisibilityOptions = {
  rootMargin?: string;
};

export function useDeferredVisibility<T extends HTMLElement = HTMLDivElement>(
  options: DeferredVisibilityOptions = {},
) {
  const { rootMargin = "300px" } = options;
  const containerRef = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      return;
    }

    const element = containerRef.current;
    if (!element) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return { containerRef, isVisible } as const;
}