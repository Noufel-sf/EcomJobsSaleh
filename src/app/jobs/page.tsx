import type { Job, JobCategory } from "@/lib/DatabaseTypes";
import { JobsHero } from "./_features/listing/components/JobsHero";
import JobsPageClient from "./JobsPageClient";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";
const ITEMS_PER_PAGE = 9;

type SortBy = "featured" | "newest" | "salary-asc" | "salary-desc";

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
  search?: string | string[];
  sort?: string | string[];
  page?: string | string[];
};

function getSingleParam(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseSalary(raw: string | number | null | undefined): number {
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : 0;
  }

  if (raw == null) {
    return 0;
  }

  const normalized = String(raw).replace(/[^0-9.-]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCsvParam(value?: string): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sanitizeSort(value?: string): SortBy {
  const allowed: SortBy[] = ["featured", "newest", "salary-asc", "salary-desc"];
  if (value && allowed.includes(value as SortBy)) {
    return value as SortBy;
  }
  return "featured";
}

function sortJobs(items: Job[], sortBy: SortBy): Job[] {
  const sorted = [...items];

  switch (sortBy) {
    case "salary-asc":
      sorted.sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
      break;
    case "salary-desc":
      sorted.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
      break;
    case "newest":
      sorted.sort((a, b) => b.id.localeCompare(a.id));
      break;
    default:
      break;
  }

  return sorted;
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
  const rawSearch = getSingleParam(params.search);
  const rawSort = getSingleParam(params.sort);
  const rawPage = getSingleParam(params.page);

  const selectedTypes = parseCsvParam(rawTypes);
  const selectedExperiences = parseCsvParam(rawExperience);
  const searchQuery = rawSearch?.trim() ?? "";
  const sortBy = sanitizeSort(rawSort);

  const selectedCategoryId = getSingleParam(params.category);
  const jobsQuery = buildJobsQuery({
    type: selectedTypes,
    experience: selectedExperiences,
    search: searchQuery,
    sort: rawSort,
    page: rawPage,
  });

  const [categories, jobs] = await Promise.all([
    categoriesPromise,
    selectedCategoryId
      ? fetchJobsByCategory(selectedCategoryId)
      : fetchJobsWithQuery(jobsQuery),
  ]);

  let filteredJobs = jobs;

  if (selectedTypes.length > 0) {
    filteredJobs = filteredJobs.filter((job) => selectedTypes.includes(job.type));
  }

  if (selectedExperiences.length > 0) {
    function extractYears(value: string | number | null | undefined): number | null {
      if (value == null) return null;
      const s = String(value).toLowerCase();
      // try to extract first integer
      const m = s.match(/(\d+)/);
      if (m) {
        const n = Number.parseInt(m[1], 10);
        return Number.isFinite(n) ? n : null;
      }
      return null;
    }

    filteredJobs = filteredJobs.filter((job) => {
      const years = extractYears(job.experience);
      // match each selected range; if job.experience contains the label string, match too
      return selectedExperiences.some((range) => {
        if (range === "1-5") {
          if (years != null) return years >= 1 && years <= 5;
        }
        if (range === "5-10") {
          if (years != null) return years > 5 && years <= 10;
        }
        if (range === "10+") {
          if (years != null) return years > 10;
        }
        // fallback: match label text
        return String(job.experience).toLowerCase().includes(range.toLowerCase());
      });
    });
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredJobs = filteredJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query),
    );
  }

  const sortedJobs = sortJobs(filteredJobs, sortBy);

  const totalFiltered = sortedJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const parsedPage = Number.parseInt(rawPage ?? "1", 10);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.min(parsedPage, totalPages)
      : 1;

  const paginatedJobs = sortedJobs.slice(
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
