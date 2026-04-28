import { Filter, SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobsFiltersPanel } from "./JobsFiltersPanel";
import { useI18n } from "@/context/I18nContext";

type SortBy = "featured" | "newest" | "salary-asc" | "salary-desc";

export function JobsToolbar({
  totalFiltered,
  totalShown,
  categories,
  selectedCategories,
  selectedTypes,
  searchQuery,
  sortBy,
  mobileFiltersOpen,
  onMobileFiltersChange,
  onSearchChange,
  onToggleCategory,
  onToggleType,
  onClearFilters,
  onSortChange,
}: {
  totalFiltered: number;
  totalShown: number;
  categories: Array<{ id: string; label: string }>;
  selectedCategories: string[];
  selectedTypes: string[];
  searchQuery: string;
  sortBy: SortBy;
  mobileFiltersOpen: boolean;
  onMobileFiltersChange: (open: boolean) => void;
  onSearchChange: (query: string) => void;
  onToggleCategory: (category: string) => void;
  onToggleType: (type: string) => void;
  onClearFilters: () => void;
  onSortChange: (value: SortBy) => void;
}) {
  const { language } = useI18n();
  const labels = {
    en: {
      allJobs: "All Jobs",
      showing: "Showing",
      of: "of",
      jobs: "jobs",
      openFiltersMenu: "Open filters menu",
      filters: "Filters",
      activeFilters: "active filters",
      filterJobs: "Filter jobs by type and more",
      sortJobsBy: "Sort jobs by",
      sortBy: "Sort by",
      featured: "Featured",
      newest: "Newest",
      salaryLowToHigh: "Salary: Low to High",
      salaryHighToLow: "Salary: High to Low",
      activeFiltersLabel: "Active filters:",
      removeFilter: "Remove",
      removeSearchFilter: "Remove search filter",
      searchPrefix: "Search",
      clearAll: "Clear all",
      clearAllFilters: "Clear all filters",
    },
    fr: {
      allJobs: "Tous les emplois",
      showing: "Affichage",
      of: "sur",
      jobs: "emplois",
      openFiltersMenu: "Ouvrir le menu des filtres",
      filters: "Filtres",
      activeFilters: "filtres actifs",
      filterJobs: "Filtrer les emplois par type et plus",
      sortJobsBy: "Trier les emplois par",
      sortBy: "Trier par",
      featured: "En vedette",
      newest: "Plus recent",
      salaryLowToHigh: "Salaire: croissant",
      salaryHighToLow: "Salaire: decroissant",
      activeFiltersLabel: "Filtres actifs:",
      removeFilter: "Supprimer",
      removeSearchFilter: "Supprimer le filtre de recherche",
      searchPrefix: "Recherche",
      clearAll: "Tout effacer",
      clearAllFilters: "Effacer tous les filtres",
    },
    ar: {
      allJobs: "كل الوظائف",
      showing: "عرض",
      of: "من",
      jobs: "وظائف",
      openFiltersMenu: "فتح قائمة الفلاتر",
      filters: "الفلاتر",
      activeFilters: "فلاتر نشطة",
      filterJobs: "تصفية الوظائف حسب النوع والمزيد",
      sortJobsBy: "ترتيب الوظائف حسب",
      sortBy: "ترتيب حسب",
      featured: "مميزة",
      newest: "الاحدث",
      salaryLowToHigh: "الراتب: من الاقل للاعلى",
      salaryHighToLow: "الراتب: من الاعلى للاقل",
      activeFiltersLabel: "الفلاتر النشطة:",
      removeFilter: "ازالة",
      removeSearchFilter: "ازالة فلتر البحث",
      searchPrefix: "بحث",
      clearAll: "مسح الكل",
      clearAllFilters: "مسح جميع الفلاتر",
    },
  } as const;
  const t = labels[language] ?? labels.en;

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">{t.allJobs}</h1>
          <p className="text-sm text-muted-foreground">
            {t.showing} {totalShown} {t.of} {totalFiltered} {t.jobs}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={mobileFiltersOpen} onOpenChange={onMobileFiltersChange}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="lg:hidden"
                size="lg"
                aria-label={t.openFiltersMenu}
              >
                <SlidersHorizontal
                  className="w-4 h-4 mr-2"
                  aria-hidden="true"
                />
                {t.filters}
                {(selectedCategories.length > 0 ||
                  selectedTypes.length > 0 ||
                  searchQuery) && (
                  <Badge
                    variant="destructive"
                    className="ml-2 px-1.5 py-0.5 text-xs"
                    aria-label={`${selectedCategories.length + selectedTypes.length + (searchQuery ? 1 : 0)} ${t.activeFilters}`}
                  >
                    {selectedCategories.length +
                      selectedTypes.length +
                      (searchQuery ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader className="">
                <SheetTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" aria-hidden="true" />
                  {t.filters}
                </SheetTitle>
                <SheetDescription className="">
                  {t.filterJobs}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <JobsFiltersPanel
                  searchQuery={searchQuery}
                  selectedCategories={selectedCategories}
                  selectedTypes={selectedTypes}
                  categories={categories}
                  onSearchChange={onSearchChange}
                  onToggleCategory={onToggleCategory}
                  onToggleType={onToggleType}
                  onClearFilters={onClearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-45" aria-label={t.sortJobsBy}>
              <SelectValue placeholder={t.sortBy} />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="featured" className="">
                {t.featured}
              </SelectItem>
              <SelectItem value="newest" className="">
                {t.newest}
              </SelectItem>
              <SelectItem value="salary-asc" className="">
                {t.salaryLowToHigh}
              </SelectItem>
              <SelectItem value="salary-desc" className="">
                {t.salaryHighToLow}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {(selectedCategories.length > 0 ||
        selectedTypes.length > 0 ||
        searchQuery) && (
        <div
          className="flex flex-wrap items-center gap-2 mb-6"
          role="region"
          aria-label="Active filters"
        >
          <span className="text-sm font-medium" id="active-filters-label">
            {t.activeFiltersLabel}
          </span>
          <div
            className="flex flex-wrap gap-2"
            aria-labelledby="active-filters-label"
          >
            {selectedCategories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer hover:bg-primary transition duration-300"
                onClick={() => onToggleCategory(category)}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggleCategory(category);
                  }
                }}
                aria-label={`${t.removeFilter} ${categories.find((item) => item.id === category)?.label ?? category} ${t.filters}`}
              >
                {categories.find((item) => item.id === category)?.label ??
                  category}
                <X className="w-3 h-3 ml-1" aria-hidden="true" />
              </Badge>
            ))}
            {selectedTypes.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="cursor-pointer hover:bg-primary transition duration-300"
                onClick={() => onToggleType(type)}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggleType(type);
                  }
                }}
                aria-label={`${t.removeFilter} ${type} ${t.filters}`}
              >
                {type}
                <X className="w-3 h-3 ml-1" aria-hidden="true" />
              </Badge>
            ))}
            {searchQuery && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition duration-200"
                onClick={() => onSearchChange("")}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSearchChange("");
                  }
                }}
                aria-label={t.removeSearchFilter}
              >
                {t.searchPrefix}: &ldquo;{searchQuery}&rdquo;
                <X className="w-3 h-3 ml-1" aria-hidden="true" />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-auto p-0 text-xs"
              aria-label={t.clearAllFilters}
            >
              {t.clearAll}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
