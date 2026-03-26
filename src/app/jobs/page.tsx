"use client";

import { useState, useMemo, memo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Filter, X, SlidersHorizontal } from "lucide-react";
import JobCard from "@/components/JobCard";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  useGetAllJobsQuery,
  useGetAllCategoriesQuery,
} from "@/Redux/Services/JobApi";

import { Separator } from "@/components/ui/separator";
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
import { JobCategory } from "@/lib/DatabaseTypes";

import hero1 from "@assets/hero1.png";
import hero2 from "@assets/hero2.png";
import hero3 from "@assets/hero3.png";
import hero4 from "@assets/hero4.png";

const ITEMS_PER_PAGE = 9;

// Mock job types for filtering
const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Remote",
];

// const LOCATIONS = [
//   "New York",
//   "San Francisco",
//   "London",
//   "Berlin",
//   "Tokyo",
//   "Remote",
//   "Hybrid",
// ];

interface FilterSidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  jobsCategories: JobCategory[];
  selectedLocations: string[];
  setSelectedLocations: React.Dispatch<React.SetStateAction<string[]>>;
  handleTypeToggle: (type: string) => void;
  handleLocationToggle: (location: string) => void;
  clearFilters: () => void;
}

const FilterSidebar = memo(function FilterSidebar({
  searchQuery,
  setSearchQuery,
  selectedTypes,
  setSelectedTypes,
  jobsCategories,
  // selectedLocations,
  // setSelectedLocations,
  handleTypeToggle,
  // handleLocationToggle,
  clearFilters,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6 px-6">
      {/* Search */}
      <div>
        <Label htmlFor="search" className="text-sm font-semibold mb-2 block">
          Search Jobs
        </Label>
        <Input
          id="search"
          type="text"
          placeholder="Search by title or company..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          className=""
          aria-label="Search jobs by title or company"
        />
      </div>

      <Separator className="" />

      {/* Job Categories */}
      <fieldset className="px-6 lg:px-0" aria-label="Job types">
        <div className="flex items-center justify-between mb-3">
          <legend className="text-sm font-semibold">Job categories</legend>
          {selectedTypes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTypes([])}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {jobsCategories.map((category: JobCategory  ) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${category.id}`}
                checked={selectedTypes.includes(category.content)}
                onCheckedChange={() => handleTypeToggle(category.content)}
                className=""
              />
              <label
                htmlFor={`type-${category.id}`}
                className="text-sm flex-1 cursor-pointer flex items-center justify-between"
              >
                <span>{category.categories}</span>
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <Separator className="" />

      {/* Job types */}
      <fieldset className="px-6 lg:px-0" aria-label="Job locations">
        <div className="flex items-center justify-between mb-3">
          <legend className="text-sm font-semibold">Job Types</legend>
          {selectedTypes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTypes([])}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          )}
        </div>
         <div className="space-y-2">
          {JOB_TYPES.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => handleTypeToggle(type)}
                className=""
              />
              <label
                htmlFor={`type-${type}`}
                className="text-sm flex-1 cursor-pointer flex items-center justify-between"
              >
                <span>{type}</span>
              </label>
            </div>
          ))}
        </div>
        
      </fieldset>

      <Separator className="" />

      {/* Clear All Filters */}
      <Button
        variant="primary"
        size="sm"
        onClick={clearFilters}
        className="w-full"
      >
        <X className="w-4 h-4 mr-2" />
        Clear All Filters
      </Button>
    </div>
  );
});

function AllJobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const heroImages = [hero1, hero2, hero3, hero4];

  const { data: jobsResponse, isLoading } = useGetAllJobsQuery();

  const { data: categoriesData } = useGetAllCategoriesQuery();
  const Jobscategories = categoriesData?.content || [];


  const filteredJobs = useMemo(() => {
    const jobs = jobsResponse?.content ?? [];
    let filtered = [...jobs];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((job) =>
        job.categories?.some((categoryId: string) =>
          selectedCategories.includes(categoryId)
        )
      );
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((job) =>
        selectedLocations.includes(job.location),
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    switch (sortBy) {
      case "salary-asc":
        filtered.sort((a, b) => {
          const salaryA = parseInt(a.salary.replace(/[^0-9]/g, "")) || 0;
          const salaryB = parseInt(b.salary.replace(/[^0-9]/g, "")) || 0;
          return salaryA - salaryB;
        });
        break;
      case "salary-desc":
        filtered.sort((a, b) => {
          const salaryA = parseInt(a.salary.replace(/[^0-9]/g, "")) || 0;
          const salaryB = parseInt(b.salary.replace(/[^0-9]/g, "")) || 0;
          return salaryB - salaryA;
        });
        break;
      case "newest":
        filtered.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      default:
        break;
    }

    return filtered;
  }, [
    jobsResponse,
    selectedCategories,
    selectedLocations,
    searchQuery,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  const currentPageAdjusted = useMemo(() => {
    return currentPage > totalPages ? 1 : currentPage;
  }, [currentPage, totalPages]);

  const paginatedJobs = filteredJobs.slice(
    (currentPageAdjusted - 1) * ITEMS_PER_PAGE,
    currentPageAdjusted * ITEMS_PER_PAGE,
  );

  const handleTypeToggle = useCallback((categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const handleLocationToggle = useCallback((location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location],
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSearchQuery("");
    setSortBy("featured");
  }, []);

  return (
    <main>
      {/* Hero Ad Section */}
      <section
        className="px-4 sm:px-6 py-6 sm:py-12 mx-auto container flex items-stretch gap-5 min-h-75 sm:min-h-125"
        aria-label="Promotional banners"
      >
        <Swiper
          navigation={{
            prevEl: ".custom-prev-jobs",
            nextEl: ".custom-next-jobs",
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
          className="mySwiper rounded-sm shadow-lg flex-1"
        >
          {heroImages.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image}
                alt={`Job promotional banner ${index + 1}`}
                className="w-full h-full cursor-pointer object-cover"
                width={1200}
                height={500}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </SwiperSlide>
          ))}

          <button
            className="custom-prev-jobs absolute cursor-pointer left-4 top-1/2 z-20 -translate-y-1/2 bg-white dark:bg-zinc-800 shadow-md p-2 rounded-full text-xl hover:bg-red-500 hover:text-white transition"
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </button>

          <button
            className="custom-next-jobs cursor-pointer absolute right-4 top-1/2 z-20 -translate-y-1/2 bg-white dark:bg-zinc-800 shadow-md p-2 rounded-full text-xl hover:bg-red-500 hover:text-white transition"
            aria-label="Next slide"
          >
            <ChevronRight />
          </button>
        </Swiper>
        <div className="hidden lg:flex max-w-[20%] items-center cursor-pointer">
          <Image
            src="/sp2.png"
            alt="Sponsored advertisement"
            width={400}
            height={500}
            className="w-full h-full object-cover rounded-sm shadow-lg"
            loading="lazy"
          />
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside
            className="hidden lg:block w-72 shrink-0"
            aria-label="Job filters"
          >
            <div className="sticky top-4 bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" aria-hidden="true" />
                <h2 className="text-lg font-bold">Filters</h2>
              </div>
              <FilterSidebar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                jobsCategories={Jobscategories}
                selectedTypes={selectedCategories}
                setSelectedTypes={setSelectedCategories}
                selectedLocations={selectedLocations}
                setSelectedLocations={setSelectedLocations}
                handleTypeToggle={handleTypeToggle}
                handleLocationToggle={handleLocationToggle}
                clearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Jobs Section */}
          <section className="flex-1 min-w-0" aria-label="Jobs listing">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                  All Jobs
                </h1>
                <p className="text-sm text-muted-foreground">
                  Showing {paginatedJobs.length} of {filteredJobs.length} jobs
                </p>
              </div>

              {/* Mobile Filter Button */}
              <div className="flex items-center gap-2">
                <Sheet
                  open={mobileFiltersOpen}
                  onOpenChange={setMobileFiltersOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="lg:hidden"
                      size="lg"
                      aria-label="Open filters menu"
                    >
                      <SlidersHorizontal
                        className="w-4 h-4 mr-2"
                        aria-hidden="true"
                      />
                      Filters
                      {(selectedCategories.length > 0 ||
                        selectedLocations.length > 0 ||
                        searchQuery) && (
                        <Badge
                          variant="destructive"
                          className="ml-2 px-1.5 py-0.5 text-xs"
                          aria-label={`${selectedCategories.length + selectedLocations.length + (searchQuery ? 1 : 0)} active filters`}
                        >
                          {selectedCategories.length +
                            selectedLocations.length +
                            (searchQuery ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader className="">
                      <SheetTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" aria-hidden="true" />
                        Filters
                      </SheetTitle>
                      <SheetDescription className="">
                        Filter jobs by type, location, and more
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedTypes={selectedCategories}
                        jobsCategories={Jobscategories}
                        setSelectedTypes={setSelectedCategories}
                        selectedLocations={selectedLocations}
                        setSelectedLocations={setSelectedLocations}
                        handleTypeToggle={handleTypeToggle}
                        handleLocationToggle={handleLocationToggle}
                        clearFilters={clearFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort By */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-45" aria-label="Sort jobs by">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectItem value="featured" className="">
                      Featured
                    </SelectItem>
                    <SelectItem value="newest" className="">
                      Newest
                    </SelectItem>
                    <SelectItem value="salary-asc" className="">
                      Salary: Low to High
                    </SelectItem>
                    <SelectItem value="salary-desc" className="">
                      Salary: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </header>

            {/* Active Filters */}
            {(selectedCategories.length > 0 ||
              selectedLocations.length > 0 ||
              searchQuery) && (
              <div
                className="flex flex-wrap items-center gap-2 mb-6"
                role="region"
                aria-label="Active filters"
              >
                <span className="text-sm font-medium" id="active-filters-label">
                  Active filters:
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
                      onClick={() => handleTypeToggle(category)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleTypeToggle(category);
                        }
                      }}
                      aria-label={`Remove ${category} filter`}
                    >
                      {category}
                      <X className="w-3 h-3 ml-1" aria-hidden="true" />
                    </Badge>
                  ))}
                  {selectedLocations.map((location) => (
                    <Badge
                      key={location}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary transition duration-300"
                      onClick={() => handleLocationToggle(location)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleLocationToggle(location);
                        }
                      }}
                      aria-label={`Remove ${location} filter`}
                    >
                      {location}
                      <X className="w-3 h-3 ml-1" aria-hidden="true" />
                    </Badge>
                  ))}
                  {searchQuery && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition duration-200"
                      onClick={() => setSearchQuery("")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSearchQuery("");
                        }
                      }}
                      aria-label="Remove search filter"
                    >
                      Search: &ldquo;{searchQuery}&rdquo;
                      <X className="w-3 h-3 ml-1" aria-hidden="true" />
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto p-0 text-xs"
                    aria-label="Clear all filters"
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            )}

            {/* Jobs Grid */}
            {isLoading ? (
              <div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                role="status"
                aria-label="Loading jobs"
              >
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="h-64 bg-secondary rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : paginatedJobs.length > 0 ? (
              <div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                role="list"
                aria-label={`Showing ${paginatedJobs.length} jobs`}
              >
                {paginatedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div
                className="text-center py-16"
                role="status"
                aria-live="polite"
              >
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4"
                  aria-hidden="true"
                >
                  <Filter className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button
                  onClick={clearFilters}
                  variant="primary"
                  className=""
                  size="lg"
                  type="button"
                >
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {paginatedJobs.length > 0 && (
              <nav aria-label="Jobs pagination">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
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
