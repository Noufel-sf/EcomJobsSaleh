"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

interface QueryPaginationProps {
  currentPage: number;
  totalPages: number;
  pageParam?: string;
  ariaLabel?: string;
}

export function QueryPagination({
  currentPage,
  totalPages,
  pageParam = "page",
  ariaLabel,
}: QueryPaginationProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const createUrl = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set(pageParam, String(page));

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const handlePageChange = (page: number) => {
    if (!pathname) {
      return;
    }

    router.push(createUrl(page), { scroll: false });
  };

  const handlePrevious = () => {
    handlePageChange(Math.max(1, currentPage - 1));
  };

  const handleNext = () => {
    handlePageChange(Math.min(totalPages, currentPage + 1));
  };

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label={ariaLabel ? `${ariaLabel} previous page` : "Previous page"}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
            let pageNumber;

            if (totalPages <= 5) {
              pageNumber = index + 1;
            } else if (currentPage <= 3) {
              pageNumber = index + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + index;
            } else {
              pageNumber = currentPage - 2 + index;
            }

            return (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNumber)}
                className="h-9 w-9"
                aria-label={
                  ariaLabel ? `${ariaLabel} page ${pageNumber}` : `Page ${pageNumber}`
                }
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label={ariaLabel ? `${ariaLabel} next page` : "Next page"}
        >
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}