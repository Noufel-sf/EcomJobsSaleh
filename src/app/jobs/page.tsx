import type { Job, JobCategory } from "@/lib/DatabaseTypes";
import JobsPageClient from "./JobsPageClient";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";

type JobsResponse = {
  content?: Job[];
};

type CategoriesResponse = {
  content?: JobCategory[];
};

async function fetchJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${API_URL}/jobs`, {
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
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const [jobs, categories, params] = await Promise.all([
    fetchJobs(),
    fetchCategories(),
    searchParams,
  ]);

  const rawCategory = Array.isArray(params.category)
    ? params.category[0]
    : params.category;

  const initialSelectedCategories = rawCategory
    ? rawCategory
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
        .slice(0, 1)
    : [];

  return (
    <JobsPageClient
      initialJobs={jobs}
      initialCategories={categories}
      initialSelectedCategories={initialSelectedCategories}
    />
  );
}
