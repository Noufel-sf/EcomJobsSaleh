'use client';

import { memo } from "react";
import { Filter } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { useState } from "react";

import { useCatalogController } from "./_features/catalog/useCatalogController";
import { CatalogHero } from "./_features/catalog/components/CatalogHero";
import { FiltersPanel } from "./_features/catalog/components/FiltersPanel";
import { ProductsGrid } from "./_features/catalog/components/ProductsGrid";
import { ProductsToolbar } from "./_features/catalog/components/ProductsToolbar";

const ITEMS_PER_PAGE = 12;

function AllProductsPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const {
    isLoading,
    categories,
    filteredProducts,
    paginatedProducts,
    totalPages,
    currentPage,
    selectedCategories,
    searchQuery,
    sortBy,
    setPage,
    toggleCategory,
    setSearchQuery,
    setSortBy,
    clearFilters,
  } = useCatalogController();

  return (
    <main>
      <CatalogHero />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0" aria-label="Product filters">
            <div className="sticky top-4 bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" aria-hidden="true" />
                <h2 className="text-lg font-bold">Filters</h2>
              </div>
              <FiltersPanel
                categories={categories}
                selectedCategories={selectedCategories}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onToggleCategory={toggleCategory}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Products Section */}
          <section className="flex-1 min-w-0" aria-label="Products listing">
            <ProductsToolbar
              totalFiltered={filteredProducts.length}
              totalShown={paginatedProducts.length}
              categories={categories}
              selectedCategories={selectedCategories}
              searchQuery={searchQuery}
              sortBy={sortBy}
              mobileFiltersOpen={mobileFiltersOpen}
              onMobileFiltersChange={setMobileFiltersOpen}
              onSearchChange={setSearchQuery}
              onToggleCategory={toggleCategory}
              onClearFilters={clearFilters}
              onSortChange={setSortBy}
            />

        
            {/* Products Grid */}
            <ProductsGrid
              isLoading={isLoading}
              paginatedProducts={paginatedProducts}
              onClearFilters={clearFilters}
              skeletonCount={ITEMS_PER_PAGE}
            />

            {/* Pagination */}
            {paginatedProducts.length > 0 && (
              <nav aria-label="Products pagination">
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

export default memo(AllProductsPage);
