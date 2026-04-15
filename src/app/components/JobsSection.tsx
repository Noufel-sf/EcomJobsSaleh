import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobsCarousel from "./JobsCarousel";
import type { Job } from "@/lib/DatabaseTypes";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";

async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${API_URL}/jobs`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { content?: Job[] };
    return data.content ?? [];
  } catch {
    return [];
  }
}

export default async function JobsSection() {
  const jobs = await getJobs();

  return (
    <section
      className="py-20 bg-linear-to-b from-background to-muted/20"
      aria-labelledby="jobs-heading"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="max-w-4xl">
            <h2
              id="jobs-heading"
              className="text-
              2xl lg:text-3xl font-bold bg-linear-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-6"
            >
              Featured Opportunities
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Discover top tech jobs in Algeria. Apply now and take your career to
              the next level.
            </p>
          </div>
        </div>

        {jobs.length > 0 ? (
          <JobsCarousel jobs={jobs} />
        ) : (
          <div className="mb-12 text-center py-8 text-muted-foreground">
            <p>No jobs available at the moment.</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Link href="/jobs" prefetch className="inline-block">
            <Button
              size="lg"
              variant="default"
              className="bg-primary hover:bg-primary/90 transition-colors"
              aria-label="Browse all available jobs"
            >
              Browse All Jobs
              <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}