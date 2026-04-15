import JobDetailsClient from "./JobDetailsClient";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";

const PRE_RENDER_ITEMS = 60;

export const revalidate = 900;
export const dynamicParams = true;

type IdRecord = {
  id?: string | number;
};

type JobsListResponse = {
  content?: IdRecord[];
};

export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  try {
    const response = await fetch(
      `${API_URL}/jobs?page=1&size=${PRE_RENDER_ITEMS}`,
      {
        next: { revalidate },
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as JobsListResponse;

    return (data.content ?? [])
      .map((job) => job.id)
      .filter((id): id is string | number => id !== undefined && id !== null)
      .map((id) => ({ id: String(id) }));
  } catch {
    return [];
  }
}

type JobDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;
  return <JobDetailsClient id={id} />;
}
