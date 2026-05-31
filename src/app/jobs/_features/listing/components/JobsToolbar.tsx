import { Filter, SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { JobsFiltersSection } from "./JobsFiltersSection";
import { useI18n } from "@/context/I18nContext";
import { useEffect, useRef, useState } from "react"; // ← added useState
import type { SalaryRangeKey, SortBy } from "../useJobsListingController";

export function JobsToolbar({
  totalFiltered,
  totalShown,
  categories,
  selectedCategories,
  selectedTypes,
  selectedExperiences,
  selectedLocation,
  selectedSalaryRange,
  selectedPostedFrom,
  selectedPostedTo,
  searchQuery,
  sortBy,
  mobileFiltersOpen,
  onMobileFiltersChange,
  onSearchChange,
  onToggleCategory,
  onToggleType,
  onToggleExperience,
  onLocationChange,
  onSalaryRangeChange,
  onPostedFromChange,
  onPostedToChange,
  onClearFilters,
  onSortChange,
}: {
  totalFiltered: number;
  totalShown: number;
  categories: Array<{ id: string; label: string }>;
  selectedCategories: string[];
  selectedTypes: string[];
  selectedExperiences: string[];
  selectedLocation: string;
  selectedSalaryRange: SalaryRangeKey | "";
  selectedPostedFrom: string;
  selectedPostedTo: string;
  searchQuery: string;
  sortBy: SortBy;
  mobileFiltersOpen: boolean;
  onMobileFiltersChange: (open: boolean) => void;
  onSearchChange: (query: string) => void;
  onToggleCategory: (category: string) => void;
  onToggleType: (type: string) => void;
  onToggleExperience: (experience: string) => void;
  onLocationChange: (location: string) => void;
  onSalaryRangeChange: (range: SalaryRangeKey | "") => void;
  onPostedFromChange: (value: string) => void;
  onPostedToChange: (value: string) => void;
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
      searchJobs: "Search Jobs",
      searchPlaceholder: "Search by title or company...",
      searchAria: "Search jobs by title or company",
      openFiltersMenu: "Open filters menu",
      filters: "Filters",
      activeFilters: "active filters",
      filterJobs: "Filter jobs by type and more",
      sortJobsBy: "Sort jobs by",
      sortBy: "Sort by",
      location: "Location",
      salary: "Salary",
      postedFrom: "Posted from",
      postedTo: "Posted to",
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
      experienceOptions: {
        NO_EXPERIENCE: "No experience",
        LESS_THAN_ONE_YEAR: "Less than one year",
        ONE_TO_FIVE_YEARS: "1 - 5 years",
        FIVE_TO_TEN_YEARS: "5 - 10 years",
        MORE_THAN_TEN_YEARS: "More than 10 years",
      } as Record<string, string>,
    },
    fr: {
      allJobs: "Tous les emplois",
      showing: "Affichage",
      of: "sur",
      jobs: "emplois",
      searchJobs: "Rechercher des emplois",
      searchPlaceholder: "Rechercher par titre ou entreprise...",
      searchAria: "Rechercher des emplois par titre ou entreprise",
      openFiltersMenu: "Ouvrir le menu des filtres",
      filters: "Filtres",
      activeFilters: "filtres actifs",
      filterJobs: "Filtrer les emplois par type et plus",
      sortJobsBy: "Trier les emplois par",
      sortBy: "Trier par",
      location: "Localisation",
      salary: "Salaire",
      postedFrom: "Publie a partir de",
      postedTo: "Publie jusqu'a",
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
      experienceOptions: {
        NO_EXPERIENCE: "Aucune expérience",
        LESS_THAN_ONE_YEAR: "Moins d'un an",
        ONE_TO_FIVE_YEARS: "1 - 5 ans",
        FIVE_TO_TEN_YEARS: "5 - 10 ans",
        MORE_THAN_TEN_YEARS: "Plus de 10 ans",
      } as Record<string, string>,
    },
    ar: {
      allJobs: "كل الوظائف",
      showing: "عرض",
      of: "من",
      jobs: "وظائف",
      searchJobs: "البحث عن وظائف",
      searchPlaceholder: "ابحث بالعنوان او الشركة...",
      searchAria: "ابحث عن وظائف بالعنوان او الشركة",
      openFiltersMenu: "فتح قائمة الفلاتر",
      filters: "الفلاتر",
      activeFilters: "فلاتر نشطة",
      filterJobs: "تصفية الوظائف حسب النوع والمزيد",
      sortJobsBy: "ترتيب الوظائف حسب",
      sortBy: "ترتيب حسب",
      location: "الموقع",
      salary: "الراتب",
      postedFrom: "منشور من",
      postedTo: "منشور الى",
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
      experienceOptions: {
        NO_EXPERIENCE: "لا توجد خبرة",
        LESS_THAN_ONE_YEAR: "أقل من سنة",
        ONE_TO_FIVE_YEARS: "من 1 إلى 5 سنوات",
        FIVE_TO_TEN_YEARS: "من 5 إلى 10 سنوات",
        MORE_THAN_TEN_YEARS: "أكثر من 10 سنوات",
      } as Record<string, string>,
    },
  } as const;
  const t = labels[language] ?? labels.en;
  const activeFiltersCount =
    selectedCategories.length +
    selectedTypes.length +
    selectedExperiences.length +
    (selectedLocation ? 1 : 0) +
    (selectedSalaryRange ? 1 : 0) +
    (selectedPostedFrom ? 1 : 0) +
    (selectedPostedTo ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const salaryLabels: Record<SalaryRangeKey, string> = {
    "0-20000": "0 - 20,000",
    "20000-100000": "20,000 - 100,000",
    "100000+": "100,000+",
  };

  // FIX: local state drives the input so it stays responsive on every keystroke.
  // The parent state (searchQuery) is only updated after the debounce delay.
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state when the parent resets the query externally
  // (e.g. "Clear all filters" sets searchQuery to "").
  // The check avoids overwriting what the user is actively typing.
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Update local state immediately — keeps the input fully responsive
    setLocalSearch(value);

    // Debounce the parent update so filtering doesn't fire on every keystroke
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 1000); // 1 second debounce
  };

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <header className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{t.allJobs}</h1>
            <p className="text-sm text-muted-foreground">
              {t.showing} {totalShown} {t.of} {totalFiltered} {t.jobs}
            </p>
            <div className="mt-3 max-w-2xl">
              <Label htmlFor="jobs-search" className="sr-only">
                {t.searchJobs}
              </Label>
              {/* FIX: value is now localSearch (not searchQuery) so the input
                  always reflects what the user typed, without waiting for the
                  debounced parent state update. */}
              <Input
                id="jobs-search"
                type="search"
                placeholder={t.searchPlaceholder}
                value={localSearch}
                aria-label={t.searchAria}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sheet
              open={mobileFiltersOpen}
              onOpenChange={onMobileFiltersChange}
            >
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
                    selectedExperiences.length > 0 ||
                    selectedLocation ||
                    searchQuery) && (
                    <Badge
                      variant="destructive"
                      className="ml-2 px-1.5 py-0.5 text-xs"
                      aria-label={`${activeFiltersCount} ${t.activeFilters}`}
                    >
                      {activeFiltersCount}
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
                  <JobsFiltersSection
                    selectedCategories={selectedCategories}
                    selectedTypes={selectedTypes}
                    selectedExperiences={selectedExperiences}
                    categories={categories}
                    onToggleCategory={onToggleCategory}
                    onToggleType={onToggleType}
                    onToggleExperience={onToggleExperience}
                    selectedLocation={selectedLocation}
                    selectedSalaryRange={selectedSalaryRange}
                    selectedPostedFrom={selectedPostedFrom}
                    selectedPostedTo={selectedPostedTo}
                    onLocationChange={onLocationChange}
                    onSalaryRangeChange={onSalaryRangeChange}
                    onPostedFromChange={onPostedFromChange}
                    onPostedToChange={onPostedToChange}
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
        </div>
      </header>

      {(selectedCategories.length > 0 ||
        selectedTypes.length > 0 ||
        selectedExperiences.length > 0 ||
        selectedLocation ||
        selectedSalaryRange ||
        selectedPostedFrom ||
        selectedPostedTo ||
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
            {selectedExperiences.map((exp) => (
              <Badge
                key={exp}
                variant="secondary"
                className="cursor-pointer hover:bg-primary transition duration-300"
                onClick={() => onToggleExperience(exp)}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggleExperience(exp);
                  }
                }}
                aria-label={`${t.removeFilter} ${t.experienceOptions[exp] ?? exp} ${t.filters}`}
              >
                {t.experienceOptions[exp] ?? exp}
                <X className="w-3 h-3 ml-1" aria-hidden="true" />
              </Badge>
            ))}
            {selectedLocation && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-primary transition duration-300"
                onClick={() => onLocationChange("")}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onLocationChange("");
                  }
                }}
                aria-label={`${t.removeFilter} ${selectedLocation} ${t.filters}`}
              >
                {t.location}: {selectedLocation}
                <X className="w-3 h-3 ml-1" aria-hidden="true" />
              </Badge>
            )}
            {selectedSalaryRange && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-primary transition duration-300"
                onClick={() => onSalaryRangeChange("")}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSalaryRangeChange("");
                  }
                }}
                aria-label={`${t.removeFilter} ${salaryLabels[selectedSalaryRange]} ${t.filters}`}
              >
                {t.salary}: {salaryLabels[selectedSalaryRange]}
                <X className="w-3 h-3 ml-1" aria-hidden="true" />
              </Badge>
            )}
            {selectedPostedFrom && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-primary transition duration-300"
                onClick={() => onPostedFromChange("")}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPostedFromChange("");
                  }
                }}
                aria-label={`${t.removeFilter} ${t.postedFrom} ${selectedPostedFrom} ${t.filters}`}
              >
                {t.postedFrom}: {selectedPostedFrom}
                <X className="w-3 h-3 ml-1" aria-hidden="true" />
              </Badge>
            )}
            {selectedPostedTo && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-primary transition duration-300"
                onClick={() => onPostedToChange("")}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPostedToChange("");
                  }
                }}
                aria-label={`${t.removeFilter} ${t.postedTo} ${selectedPostedTo} ${t.filters}`}
              >
                {t.postedTo}: {selectedPostedTo}
                <X className="w-3 h-3 ml-1" aria-hidden="true" />
              </Badge>
            )}
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