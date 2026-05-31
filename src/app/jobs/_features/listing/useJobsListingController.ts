import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Job } from "@/lib/DatabaseTypes";

export type SortBy = "newest" | "salary-asc" | "salary-desc";

export type SalaryRangeKey = "0-20000" | "20000-100000" | "100000+";

export type ExperienceKey =
  | "NO_EXPERIENCE"
  | "LESS_THAN_ONE_YEAR"
  | "ONE_TO_FIVE_YEARS"
  | "FIVE_TO_TEN_YEARS"
  | "MORE_THAN_TEN_YEARS";

export const EXPERIENCE_OPTIONS: Array<{ value: ExperienceKey; label: string }> = [
  { value: "NO_EXPERIENCE", label: "No experience" },
  { value: "LESS_THAN_ONE_YEAR", label: "Less than one year" },
  { value: "ONE_TO_FIVE_YEARS", label: "1 - 5 years" },
  { value: "FIVE_TO_TEN_YEARS", label: "5 - 10 years" },
  { value: "MORE_THAN_TEN_YEARS", label: "More than 10 years" },
];

const EXPERIENCE_VALUES = new Set(EXPERIENCE_OPTIONS.map((option) => option.value));

function parseSortParam(value: string | null): SortBy {
  switch (value) {
    case "salary,asc":
    case "salary-asc":
      return "salary-asc";
    case "salary,desc":
    case "salary-desc":
      return "salary-desc";
    case "jobPostedOn,desc":
    case "newest":
    default:
      return "newest";
  }
}

function toBackendSort(value: SortBy): string {
  switch (value) {
    case "salary-asc":
      return "salary,asc";
    case "salary-desc":
      return "salary,desc";
    case "newest":
    default:
      return "jobPostedOn,desc";
  }
}

type JobsListingControllerResult = {
  isLoading: boolean;
  categories: Array<{ id: string; label: string }>;
  totalFiltered: number;
  paginatedJobs: Job[];
  totalPages: number;
  currentPage: number;
  selectedCategories: string[];
  selectedTypes: string[];
  selectedExperiences: string[];
  selectedLocation: string;
  selectedSalaryRange: SalaryRangeKey | "";
  selectedPostedFrom: string;
  selectedPostedTo: string;
  searchQuery: string;
  sortBy: SortBy;
  setPage: (page: number) => void;
  toggleCategory: (categoryId: string) => void;
  toggleType: (type: string) => void;
  toggleExperience: (experience: string) => void;
  setLocation: (location: string) => void;
  setSalaryRange: (range: SalaryRangeKey | "") => void;
  setPostedFrom: (value: string) => void;
  setPostedTo: (value: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (value: SortBy) => void;
  clearFilters: () => void;
};

function parseCsvParam(value: string | null): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseExperienceParam(value: string | null): ExperienceKey[] {
  return parseCsvParam(value).filter((item): item is ExperienceKey =>
    EXPERIENCE_VALUES.has(item as ExperienceKey),
  );
}

function sanitizeSalaryRange(
  salaryMin: string | null,
  salaryMax: string | null,
): SalaryRangeKey | "" {
  if (salaryMin === "0" && salaryMax === "20000") return "0-20000";
  if (salaryMin === "20000" && salaryMax === "100000") return "20000-100000";
  if (salaryMin === "100000" && (!salaryMax || salaryMax === "")) {
    return "100000+";
  }

  return "";
}

function sanitizeDateValue(value: string | null): string {
  if (!value) return "";
  const trimmed = value.trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : "";
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
}): JobsListingControllerResult {
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

  const selectedExperiences = useMemo(
    () => parseExperienceParam(searchParams?.get("experience") ?? null),
    [searchParams],
  );

  const selectedLocation = searchParams?.get("location") ?? "";
  const selectedSalaryRange = sanitizeSalaryRange(
    searchParams?.get("salaryMin") ?? null,
    searchParams?.get("salaryMax") ?? null,
  );
  const selectedPostedFrom = sanitizeDateValue(searchParams?.get("postedFrom") ?? null);
  const selectedPostedTo = sanitizeDateValue(searchParams?.get("postedTo") ?? null);

  const searchQuery = searchParams?.get("search") ?? "";
  const sortBy = parseSortParam(searchParams?.get("sort") ?? null);

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
    selectedExperiences,
    selectedLocation,
    selectedSalaryRange,
    selectedPostedFrom,
    selectedPostedTo,
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
    toggleExperience: (experience: string) => {
      const experienceValue = experience as ExperienceKey;
      const exists = selectedExperiences.includes(experienceValue);
      const nextSelected = exists
        ? selectedExperiences.filter((item) => item !== experienceValue)
        : [...selectedExperiences, experienceValue];

      updateUrl(
        (params) => {
          if (nextSelected.length > 0) {
            params.set("experience", nextSelected.join(","));
          } else {
            params.delete("experience");
          }
        },
        { resetPage: true },
      );
    },
    setLocation: (location: string) => {
      updateUrl(
        (params) => {
          const next = location.trim();
          if (next) {
            params.set("location", next);
          } else {
            params.delete("location");
          }
        },
        { resetPage: true },
      );
    },
    setSalaryRange: (range: SalaryRangeKey | "") => {
      updateUrl(
        (params) => {
          params.delete("salaryMin");
          params.delete("salaryMax");

          if (range === "0-20000") {
            params.set("salaryMin", "0");
            params.set("salaryMax", "20000");
          } else if (range === "20000-100000") {
            params.set("salaryMin", "20000");
            params.set("salaryMax", "100000");
          } else if (range === "100000+") {
            params.set("salaryMin", "100000");
          }
        },
        { resetPage: true },
      );
    },
    setPostedFrom: (value: string) => {
      updateUrl(
        (params) => {
          const next = sanitizeDateValue(value);
          if (next) {
            params.set("postedFrom", next);
          } else {
            params.delete("postedFrom");
          }
        },
        { resetPage: true },
      );
    },
    setPostedTo: (value: string) => {
      updateUrl(
        (params) => {
          const next = sanitizeDateValue(value);
          if (next) {
            params.set("postedTo", next);
          } else {
            params.delete("postedTo");
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
    setSortBy: (value: SortBy) => {
      updateUrl(
        (params) => {
          params.set("sort", toBackendSort(value));
        },
        { resetPage: true },
      );
    },
   
    clearFilters: () => {
      updateUrl(
        (params) => {
          params.delete("category");
          params.delete("type");
          params.delete("location");
          params.delete("salaryMin");
          params.delete("salaryMax");
          params.delete("postedFrom");
          params.delete("postedTo");
          params.delete("search");
          params.delete("sort");
          params.delete("page");
        },
        { resetPage: true },
      );
    },
  };
}
