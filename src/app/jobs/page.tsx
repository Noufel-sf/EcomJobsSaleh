import type { Job, JobCategory } from "@/lib/DatabaseTypes";
import { JobsHero } from "./_features/listing/components/JobsHero";
import JobsPageClient from "./JobsPageClient";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";
const ITEMS_PER_PAGE = 9;

type ExperienceKey =
  | "NO_EXPERIENCE"
  | "LESS_THAN_ONE_YEAR"
  | "ONE_TO_FIVE_YEARS"
  | "FIVE_TO_TEN_YEARS"
  | "MORE_THAN_TEN_YEARS";

type JobsResponse = {
  content?: Job[];
};

type CategoriesResponse = {
  content?: JobCategory[];
};

type SearchParams = {
  category?: string | string[];
  type?: string | string[];
  experience?: string | string[];
  location?: string | string[];
  salaryMin?: string | string[];
  salaryMax?: string | string[];
  postedFrom?: string | string[];
  postedTo?: string | string[];
  search?: string | string[];
  sort?: string | string[];
  page?: string | string[];
};

function getSingleParam(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseCsvParam(value?: string): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sanitizeExperienceParam(value?: string): ExperienceKey[] {
  const allowed = new Set<ExperienceKey>([
    "NO_EXPERIENCE",
    "LESS_THAN_ONE_YEAR",
    "ONE_TO_FIVE_YEARS",
    "FIVE_TO_TEN_YEARS",
    "MORE_THAN_TEN_YEARS",
  ]);

  return parseCsvParam(value).filter(
    (item): item is ExperienceKey => allowed.has(item as ExperienceKey),
  );
}

function normalizeSortParam(value?: string): string | undefined {
  switch (value) {
    case "salary-asc":
      return "salary,asc";
    case "salary-desc":
      return "salary,desc";
    case "newest":
      return "jobPostedOn,desc";
    default:
      return value;
  }
}

async function fetchJobsByCategory(categoryId: string): Promise<Job[]> {
  try {
    const response = await fetch(`${API_URL}/jobs/ByCategory/${categoryId}`, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as JobsResponse;
    return Array.isArray(data.content) ? data.content : [];
  } catch {
    return [];
  }
}

async function fetchJobsWithQuery(query?: string): Promise<Job[]> {
  try {
    console.log("Fetching jobs with query:", query);
    const url = query ? `${API_URL}/jobs?${query}` : `${API_URL}/jobs`;
    const response = await fetch(url, { next: { revalidate: 120 } });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as JobsResponse;
    return Array.isArray(data.content) ? data.content : [];
  } catch {
    return [];
  }
}

function buildJobsQuery(params: {
  type?: string[];
  experience?: string[];
  location?: string;
  salaryMin?: string;
  salaryMax?: string;
  postedFrom?: string;
  postedTo?: string;
  search?: string;
  sort?: string;
  page?: string;
}): string {
  const apiParams = new URLSearchParams();

  if (params.type && params.type.length > 0) {
    apiParams.set("type", params.type.join(","));
  }

  if (params.experience && params.experience.length > 0) {
    apiParams.set("experience", params.experience.join(","));
  }

  if (params.location) {
    apiParams.set("location", params.location);
  }

  if (params.salaryMin) {
    apiParams.set("salaryMin", params.salaryMin);
  }

  if (params.salaryMax) {
    apiParams.set("salaryMax", params.salaryMax);
  }

  if (params.postedFrom) {
    apiParams.set("postedFrom", params.postedFrom);
  }

  if (params.postedTo) {
    apiParams.set("postedTo", params.postedTo);
  }

  if (params.search) {
    apiParams.set("search", params.search);
  }

  if (params.sort) {
    apiParams.set("sort", params.sort);
  }

  if (params.page) {
    apiParams.set("page", params.page);
  }

  return apiParams.toString();
}

async function fetchCategories(): Promise<Array<{ id: string; label: string }>> {
  try {
    const response = await fetch(`${API_URL}/categoriess`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as CategoriesResponse;
    const content = Array.isArray(data.content) ? data.content : [];

    return content.map((category) => ({
      id: category.id,
      label: category.content || category.categories,
    }));
  } catch {
    return [];
  }
}

export default async function AllJobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const categoriesPromise = fetchCategories();
  const params = await searchParams;

  const rawTypes = getSingleParam(params.type);
  const rawExperience = getSingleParam(params.experience);
  const rawLocation = getSingleParam(params.location);
  const rawSalaryMin = getSingleParam(params.salaryMin);
  const rawSalaryMax = getSingleParam(params.salaryMax);
  const rawPostedFrom = getSingleParam(params.postedFrom);
  const rawPostedTo = getSingleParam(params.postedTo);
  const rawSearch = getSingleParam(params.search);
  const rawSort = getSingleParam(params.sort);
  const rawPage = getSingleParam(params.page);

  const selectedTypes = parseCsvParam(rawTypes);
  const selectedExperiences = sanitizeExperienceParam(rawExperience);
  const selectedLocation = rawLocation?.trim() ?? "";
  const searchQuery = rawSearch?.trim() ?? "";
  const normalizedSort = normalizeSortParam(rawSort);

  const selectedCategoryId = getSingleParam(params.category);
  const jobsQuery = buildJobsQuery({
    type: selectedTypes,
    experience: selectedExperiences,
    location: selectedLocation,
    salaryMin: rawSalaryMin?.trim(),
    salaryMax: rawSalaryMax?.trim(),
    postedFrom: rawPostedFrom?.trim(),
    postedTo: rawPostedTo?.trim(),
    search: searchQuery,
    sort: normalizedSort,
    page: rawPage,
  });

  const [categories, jobs] = await Promise.all([
    categoriesPromise,
    selectedCategoryId
      ? fetchJobsByCategory(selectedCategoryId)
      : fetchJobsWithQuery(jobsQuery),
  ]);

  const totalFiltered = jobs.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const parsedPage = Number.parseInt(rawPage ?? "1", 10);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.min(parsedPage, totalPages)
      : 1;

  const paginatedJobs = jobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <main>
      <JobsHero />
      <JobsPageClient
        initialJobs={paginatedJobs}
        initialCategories={categories}
        initialTotalFiltered={totalFiltered}
        initialCurrentPage={currentPage}
        initialTotalPages={totalPages}
      />
    </main>
  );
}
