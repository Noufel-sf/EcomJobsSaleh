import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/JobCard";
import type { Job } from "@/lib/DatabaseTypes";
import { useI18n } from "@/context/I18nContext";

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
  const { language } = useI18n();
  const labels = {
    en: {
      loadingJobs: "Loading jobs",
      noJobsFound: "No jobs found",
      adjustFilters: "Try adjusting your filters or search query",
      clearAllFilters: "Clear all filters",
      showing: "Showing",
      jobs: "jobs",
    },
    fr: {
      loadingJobs: "Chargement des emplois",
      noJobsFound: "Aucun emploi trouve",
      adjustFilters: "Essayez d'ajuster vos filtres ou votre recherche",
      clearAllFilters: "Effacer tous les filtres",
      showing: "Affichage",
      jobs: "emplois",
    },
    ar: {
      loadingJobs: "جاري تحميل الوظائف",
      noJobsFound: "لا توجد وظائف",
      adjustFilters: "حاول تعديل الفلاتر او البحث",
      clearAllFilters: "مسح جميع الفلاتر",
      showing: "عرض",
      jobs: "وظائف",
    },
  } as const;
  const t = labels[language] ?? labels.en;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" role="status" aria-label={t.loadingJobs}>
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
        <h3 className="text-lg font-semibold mb-2">{t.noJobsFound}</h3>
        <p className="text-muted-foreground mb-4">{t.adjustFilters}</p>
        <Button onClick={onClearFilters} variant="primary" size="lg" type="button">
          {t.clearAllFilters}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" role="list" aria-label={`${t.showing} ${jobs.length} ${t.jobs}`}>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
