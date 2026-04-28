"use client";

import { memo, useState } from "react";
import { Filter } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import type { Job } from "@/lib/DatabaseTypes";
import { JobsFiltersPanel } from "./_features/listing/components/JobsFiltersPanel";
import { JobsToolbar } from "./_features/listing/components/JobsToolbar";
import { JobsGrid } from "./_features/listing/components/JobsGrid";
import { useJobsListingController } from "./_features/listing/useJobsListingController";
import { useI18n } from "@/context/I18nContext";

const ITEMS_PER_PAGE = 9;

function JobsPageClient({
  initialJobs,
  initialCategories,
  initialTotalFiltered,
  initialCurrentPage,
  initialTotalPages,
}: {
  initialJobs: Job[];
  initialCategories: Array<{ id: string; label: string }>;
  initialTotalFiltered: number;
  initialCurrentPage: number;
  initialTotalPages: number;
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { language } = useI18n();
  const labels = {
    en: {
      filters: "Filters",
      jobFilters: "Job filters",
      jobsListing: "Jobs listing",
      jobsPagination: "Jobs pagination",
    },
    fr: {
      filters: "Filtres",
      jobFilters: "Filtres d'emploi",
      jobsListing: "Liste des emplois",
      jobsPagination: "Pagination des emplois",
    },
    ar: {
      filters: "الفلاتر",
      jobFilters: "فلاتر الوظائف",
      jobsListing: "قائمة الوظائف",
      jobsPagination: "ترقيم الوظائف",
    },
  } as const;
  const t = labels[language] ?? labels.en;

  const {
    isLoading,
    categories,
    totalFiltered,
    paginatedJobs,
    totalPages,
    currentPage,
    selectedCategories,
    selectedTypes,
    searchQuery,
    sortBy,
    setPage,
    toggleCategory,
    toggleType,
    setSearchQuery,
    setSortBy,
    clearFilters,
  } = useJobsListingController({
    jobs: initialJobs,
    categories: initialCategories,
    totalFiltered: initialTotalFiltered,
    currentPage: initialCurrentPage,
    totalPages: initialTotalPages,
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside
          className="hidden lg:block w-72 shrink-0"
          aria-label={t.jobFilters}
        >
          <div className="sticky top-4 bg-card border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5" aria-hidden="true" />
              <h2 className="text-lg font-bold">{t.filters}</h2>
            </div>
            <JobsFiltersPanel
              searchQuery={searchQuery}
              selectedCategories={selectedCategories}
              selectedTypes={selectedTypes}
              categories={categories}
              onSearchChange={setSearchQuery}
              onToggleCategory={toggleCategory}
              onToggleType={toggleType}
              onClearFilters={clearFilters}
            />
          </div>
        </aside>

        <section className="flex-1 min-w-0" aria-label={t.jobsListing}>
          <JobsToolbar
            totalFiltered={totalFiltered}
            totalShown={paginatedJobs.length}
            categories={categories}
            selectedCategories={selectedCategories}
            selectedTypes={selectedTypes}
            searchQuery={searchQuery}
            sortBy={sortBy}
            mobileFiltersOpen={mobileFiltersOpen}
            onMobileFiltersChange={setMobileFiltersOpen}
            onSearchChange={setSearchQuery}
            onToggleCategory={toggleCategory}
            onToggleType={toggleType}
            onClearFilters={clearFilters}
            onSortChange={setSortBy}
          />

          <JobsGrid
            isLoading={isLoading}
            jobs={paginatedJobs}
            onClearFilters={clearFilters}
            skeletonCount={ITEMS_PER_PAGE}
          />

          {paginatedJobs.length > 0 && (
            <nav aria-label={t.jobsPagination}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}

export default memo(JobsPageClient);
