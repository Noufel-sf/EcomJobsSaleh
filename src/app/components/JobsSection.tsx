import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeferredJobsCarousel from "./DeferredJobsCarousel";
import LocalizedSectionTitle from "./LocalizedSectionTitle";
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
            <LocalizedSectionTitle
              id="jobs-heading"
              className="mb-6"
              labels={{
                en: "Featured Opportunities",
                fr: "Opportunites en vedette",
                ar: "فرص مميزة",
              }}
            />
          
          </div>
        </div>

        {jobs.length > 0 ? (
          <DeferredJobsCarousel jobs={jobs} />
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