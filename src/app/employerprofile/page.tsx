"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useGetProfileQuery } from "@/Redux/Services/AuthApi";
import { useGetAllJobsQuery } from "@/Redux/Services/JobApi";
import { Building2, MapPin, Briefcase, Users } from "lucide-react";
import type { Job } from "@/lib/DatabaseTypes";

type CompanyProfile = {
  id?: string;
  userId?: string;
  companyId?: string;
  name?: string;
  companyName?: string;
  logo?: string;
  companyLogo?: string;
  location?: string;
  specialization?: string;
  industry?: string;
  website?: string;
  description?: string;
};

const USE_MOCK_DATA = true;

const MOCK_COMPANY: CompanyProfile = {
  id: "company-demo-1",
  userId: "company-demo-1",
  name: "Nova Labs",
  logo: "/sp2.png",
  location: "Algiers, Algeria",
  specialization: "Fintech & E-commerce",
  description:
    "Nova Labs builds modern digital products for commerce and payments. We focus on reliable systems, clean interfaces, and high-impact teams.",
};

const MOCK_JOBS: Job[] = [
  {
    id: "job-demo-1",
    title: "Frontend Engineer",
    company: "company-demo-1",
    companyLogo: MOCK_COMPANY.logo,
    location: "Algiers",
    type: "full-time",
    experience: "2+ years",
    salary: "$1,200 - $1,800",
    description:
      "Build and improve user-facing features with React and Next.js.",
    responsibilities: [
      "Build components",
      "Improve UX",
      "Collaborate with backend",
    ],
    whoYouAre: ["Strong in React", "Attention to detail"],
    niceToHaves: ["Animation knowledge"],
    categories: ["Engineering"],
    requiredSkills: ["React", "TypeScript", "Tailwind"],
    appliedCount: 12,
    totalCapacity: 20,
    applyBefore: "2026-04-30",
    jobPostedOn: "2026-03-10",
  },
  {
    id: "job-demo-2",
    title: "Product Designer",
    company: "company-demo-1",
    companyLogo: MOCK_COMPANY.logo,
    location: "Remote",
    type: "part-time",
    experience: "3+ years",
    salary: "$900 - $1,500",
    description: "Design intuitive flows and polished UI systems for web apps.",
    responsibilities: ["Create wireframes", "Prototype interactions"],
    whoYouAre: ["Figma expert", "Strong visual skills"],
    niceToHaves: ["Design systems"],
    categories: ["Design"],
    requiredSkills: ["Figma", "UX Research"],
    appliedCount: 8,
    totalCapacity: 12,
    applyBefore: "2026-04-20",
    jobPostedOn: "2026-03-12",
  },
];

function CompanyInfoSkeleton() {
  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]" aria-hidden="true">
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-4 h-8 w-52 animate-pulse rounded bg-muted" />
        <div className="mb-6 h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-24 w-full animate-pulse rounded bg-muted" />
      </div>
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-4 h-28 w-28 animate-pulse rounded-lg bg-muted" />
        <div className="mb-3 h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </div>
    </section>
  );
}

function JobsSkeleton() {
  return (
    <section className="mt-8 grid gap-4 md:grid-cols-2" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-xl border bg-card p-5">
          <div className="mb-3 h-5 w-40 animate-pulse rounded bg-muted" />
          <div className="mb-4 h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="mb-2 h-4 w-full animate-pulse rounded bg-muted" />
          <div className="mb-4 h-4 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-9 w-28 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </section>
  );
}

export default function EmployerProfileViewPage() {
  const { data: profileResponse, isLoading: isCompanyLoading } =
    useGetProfileQuery();
  const { data: jobsResponse, isLoading: areJobsLoading } =
    useGetAllJobsQuery();

  const companyFromApi = (profileResponse?.user ??
    null) as CompanyProfile | null;
  const company = companyFromApi ?? (USE_MOCK_DATA ? MOCK_COMPANY : null);

  const companyJobs = useMemo(() => {
    const jobs = jobsResponse?.content?.length
      ? jobsResponse.content
      : USE_MOCK_DATA
        ? MOCK_JOBS
        : [];

    if (!company) return jobs;

    const keys = [
      company.id,
      company.userId,
      company.companyId,
      company.companyName,
      company.name,
    ]
      .map((value) => (value || "").toString().toLowerCase().trim())
      .filter(Boolean);

    if (keys.length === 0) return jobs;

    return jobs.filter((job: Job) => {
      const companyField = (job.company || "").toString().toLowerCase().trim();
      return keys.includes(companyField);
    });
  }, [jobsResponse, company]);

  if (isCompanyLoading && !USE_MOCK_DATA) {
    return (
      <main className="container mx-auto px-4 py-8 lg:py-12">
        <CompanyInfoSkeleton />
        <JobsSkeleton />
      </main>
    );
  }

  if (!company) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Company Profile Not Found</h1>
        <p className="mt-3 text-muted-foreground">
          We could not load your company information from the API.
        </p>
      </main>
    );
  }

  const companyName = company.companyName || company.name || "Your Company";
  const specialization =
    company.specialization || company.industry || "Not specified";
  const logo = company.logo || company.companyLogo || "";

  return (
    <main className="container mx-auto px-4 py-8 lg:py-12">
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-xl border bg-card p-6">
          <header className="mb-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold">{companyName}</h1>
            </div>
          </header>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {company.description ||
                "No company description has been provided yet."}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{company.location || "Location not set"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{specialization}</span>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Company Logo</h2>
          <div>
            <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-xl border bg-muted">
              {logo ? (
                <Image
                  src={logo}
                  alt={`${companyName} logo`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <Building2 className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-center">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {companyJobs.length} Active Jobs
              </span>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Open Positions</h2>
        </div>

        {areJobsLoading && !USE_MOCK_DATA ? (
          <JobsSkeleton />
        ) : companyJobs.length === 0 ? (
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
