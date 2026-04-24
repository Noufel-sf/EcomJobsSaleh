import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Job } from "@/lib/DatabaseTypes";

type SortBy = "featured" | "newest" | "salary-asc" | "salary-desc";

function parseCsvParam(value: string | null): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sanitizeSort(value: string | null): SortBy {
  const allowed: SortBy[] = ["featured", "newest", "salary-asc", "salary-desc"];
  if (value && allowed.includes(value as SortBy)) {
    return value as SortBy;
  }
  return "featured";
}

export function useJobsListingController({
  jobs,
  categories,
  totalFiltered,
  currentPage,
  totalPages,
}: {
  jobs: Job[];
  categories: Array<{ id: string; label: string }>;
  totalFiltered: number;
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? "/jobs";
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString() ?? "";

  const selectedCategories = useMemo(
    () => parseCsvParam(searchParams?.get("category") ?? null).slice(0, 1),
    [searchParams],
  );

  const selectedTypes = useMemo(
    () => parseCsvParam(searchParams?.get("type") ?? null),
    [searchParams],
  );

  const searchQuery = searchParams?.get("search") ?? "";
  const sortBy = sanitizeSort(searchParams?.get("sort") ?? null);

  const updateUrl = (
    updater: (params: URLSearchParams) => void,
    options?: { resetPage?: boolean },
  ) => {
    const params = new URLSearchParams(searchParamsString);

    updater(params);

    if (options?.resetPage) {
      params.delete("page");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return {
    isLoading: false,
    categories,
    totalFiltered,
    paginatedJobs: jobs,
    totalPages,
    currentPage,
    selectedCategories,
    selectedTypes,
    searchQuery,
    sortBy,
    setPage: (page: number) => {
      updateUrl((params) => {
        params.set("page", String(page));
      });
    },
    toggleCategory: (categoryId: string) => {
      const exists = selectedCategories.includes(categoryId);
      const nextSelected = exists ? [] : [categoryId];
      updateUrl(
        (params) => {
          if (nextSelected[0]) {
            params.set("category", nextSelected[0]);
          } else {
            params.delete("category");
          }
        },
        { resetPage: true },
      );
    },
    toggleType: (type: string) => {
      const exists = selectedTypes.includes(type);
      const nextSelected = exists
        ? selectedTypes.filter((item) => item !== type)
        : [...selectedTypes, type];

      updateUrl(
        (params) => {
          if (nextSelected.length > 0) {
            params.set("type", nextSelected.join(","));
          } else {
            params.delete("type");
          }
        },
        { resetPage: true },
      );
    },
    setSearchQuery: (query: string) => {
      updateUrl(
        (params) => {
          const next = query.trim();
          if (next) {
            params.set("search", next);
          } else {
            params.delete("search");
          }
        },
        { resetPage: true },
      );
    },
    setSortBy: (sort: SortBy) => {
      updateUrl(
        (params) => {
          if (sort === "featured") {
            params.delete("sort");
          } else {
            params.set("sort", sort);
          }
        },
        { resetPage: true },
      );
    },
    clearFilters: () => {
      updateUrl(
        (params) => {
          params.delete("category");
          params.delete("type");
          params.delete("search");
          params.delete("sort");
          params.delete("page");
        },
        { resetPage: true },
      );
    },
  };
}
