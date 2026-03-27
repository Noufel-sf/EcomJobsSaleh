"use client";

import { memo, useState } from "react";
import { Filter } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { JobsHero } from "./_features/listing/components/JobsHero";
import { JobsFiltersPanel } from "./_features/listing/components/JobsFiltersPanel";
import { JobsToolbar } from "./_features/listing/components/JobsToolbar";
import { JobsGrid } from "./_features/listing/components/JobsGrid";
import { useJobsListingController } from "./_features/listing/useJobsListingController";

const ITEMS_PER_PAGE = 9;

function AllJobsPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    isLoading,
    categories,
    filteredJobs,
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
  } = useJobsListingController();

  return (
    <main>
      <JobsHero />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="hidden lg:block w-72 shrink-0" aria-label="Job filters">
            <div className="sticky top-4 bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" aria-hidden="true" />
                <h2 className="text-lg font-bold">Filters</h2>
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

          <section className="flex-1 min-w-0" aria-label="Jobs listing">
            <JobsToolbar
              totalFiltered={filteredJobs.length}
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
              <nav aria-label="Jobs pagination">
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
    </main>
  );
}

export default memo(AllJobsPage);
