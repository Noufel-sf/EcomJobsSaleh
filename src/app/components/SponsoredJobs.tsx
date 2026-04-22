import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import DeferredSponsoredJobsCarousel from "./DeferredSponsoredJobsCarousel";
import LocalizedSectionTitle from "./LocalizedSectionTitle";
import type { Job } from "@/lib/DatabaseTypes";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";

async function getSponsoredJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${API_URL}/jobs/sponsored`, {
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

export default async function SponsoredJobs() {
  const sponsoredJobs = await getSponsoredJobs();

  return (
    <section
      className="mx-auto container px-6 py-12"
      aria-labelledby="sponsored-jobs-heading"
    >
      <div className="heading mb-6 flex items-center justify-between">
        <LocalizedSectionTitle
          id="sponsored-jobs-heading"
          labels={{
            en: "Sponsored Jobs",
            fr: "Emplois sponsorises",
            ar: "وظائف ممولة",
          }}
        />
      </div>

      {sponsoredJobs.length > 0 ? (
        <>
          <DeferredSponsoredJobsCarousel sponsoredJobs={sponsoredJobs} />

          <div className="text-center">
            <Link href="/jobs" prefetch>
              <Button
                size="lg"
                variant="default"
                className="mt-8 mx-auto bg-primary hover:bg-primary/90 flex items-center gap-2"
              >
                View All Jobs
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No sponsored jobs available at the moment.</p>
        </div>
      )}
    </section>
  );
}