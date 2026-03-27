import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/JobCard";
import type { Job } from "@/lib/DatabaseTypes";

export function JobsGrid({
  isLoading,
  jobs,
  onClearFilters,
  skeletonCount = 9,
}: {
  isLoading: boolean;
  jobs: Job[];
  onClearFilters: () => void;
  skeletonCount?: number;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" role="status" aria-label="Loading jobs">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={`skeleton-${i}`} className="h-64 bg-secondary rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16" role="status" aria-live="polite">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4" aria-hidden="true">
          <Filter className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
        <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
        <Button onClick={onClearFilters} variant="primary" size="lg" type="button">
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" role="list" aria-label={`Showing ${jobs.length} jobs`}>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
