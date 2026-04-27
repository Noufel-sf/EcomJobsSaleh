import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Briefcase, Users } from "lucide-react";
import type { Job } from "@/lib/DatabaseTypes";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";

type PageProps = {
  searchParams: Promise<{
    id?: string;
  }>;
};

type CompanyProfile = {
  id: string;
  name: string;
  logo: string;
  location: string;
  specialization: string;
  description: string;
};

type RawCompanyProfile = {
  id?: string | number;
  name?: string;
  companyName?: string;
  logo?: string;
  companyLogo?: string;
  location?: string;
  specialization?: string;
  industry?: string;
  description?: string;
  profileDescription?: string;
};

type RawCompanyProfileResponse = {
  user?: RawCompanyProfile;
  content?: RawCompanyProfile;
  data?: RawCompanyProfile;
};

type RawJobsResponse = {
  content?: Job[];
};

function normalizeCompanyProfile(
  response: RawCompanyProfileResponse | RawCompanyProfile,
  companyId: string,
): CompanyProfile | null {
  const source =
    (response as RawCompanyProfileResponse)?.user ??
    (response as RawCompanyProfileResponse)?.content ??
    (response as RawCompanyProfileResponse)?.data ??
    (response as RawCompanyProfile);

  if (!source || typeof source !== "object") {
    return null;
  }

  return {
    id: String(source.id ?? companyId),
    name: source.companyName || source.name || "Company Profile",
    logo: source.logo || source.companyLogo || "",
    location: source.location || "Location not set",
    specialization: source.specialization || source.industry || "Not specified",
    description:
      source.description ||
      source.profileDescription ||
      "No company description has been provided yet.",
  };
}

async function fetchCompanyProfileById(
  companyId: string,
): Promise<CompanyProfile | null> {
  try {
    const response = await fetch(`${API_URL}/companys/profile/${companyId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as
      | RawCompanyProfileResponse
      | RawCompanyProfile;

    return normalizeCompanyProfile(data, companyId);
  } catch {
    return null;
  }
}

async function fetchCompanyJobsById(companyId: string): Promise<Job[]> {
  try {
    const response = await fetch(`${API_URL}/jobs/ByCompany/${companyId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as RawJobsResponse;
    return Array.isArray(data?.content) ? data.content : [];
  } catch {
    return [];
  }
}

export default async function EmployerProfileViewPage({
  searchParams,
}: PageProps) {
  const { id: companyId } = await searchParams;

  if (!companyId) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Company Profile Not Found</h1>
        <p className="mt-3 text-muted-foreground">
          Missing company id. Open this page with an id like
          /employerprofile?id=your-company-id
        </p>
      </main>
    );
  }

  const [company, companyJobs] = await Promise.all([
    fetchCompanyProfileById(companyId),
    fetchCompanyJobsById(companyId),
  ]);

  if (!company) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Company Profile Not Found</h1>
        <p className="mt-3 text-muted-foreground">
          We could not load this company from the backend.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 lg:py-12">
      <section className="flex flex-col gap-6 lg:flex-row">
        <article className="rounded-xl border bg-card p-6">
          <div>
            <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-xl border bg-muted">
              {company.logo ? (
                <Image
                  src={company.logo}
                  alt={`${company.name} logo`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <Building2 className="h-8 w-8" />
                </div>
              )}
            </div>
          </div>
        </article>

        <article className="rounded-xl border bg-card p-6">
          <header className="mb-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold">{company.name}</h1>
            </div>
          </header>

          <div className="space-y-4">
            <p className="text-muted-foreground">{company.description}</p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{company.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{company.specialization}</span>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Open Positions</h2>
        </div>

        {companyJobs.length === 0 ? (
          <div className="rounded-xl border bg-card py-10 text-center text-muted-foreground">
            No jobs found for this company yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {companyJobs.map((job) => (
              <article
                key={job.id}
                className="h-full rounded-xl border bg-card p-6"
              >
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <div className="mt-3 space-y-3">
                  <div className="text-sm text-muted-foreground">
                    {job.location} · {job.type}
                  </div>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {job.description}
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/jobdetails/${job.id}`}>View Job</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
