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
  categories: Array<{ id: string; label: string; value: string }>;
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
  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">All Jobs</h1>
          <p className="text-sm text-muted-foreground">Showing {totalShown} of {totalFiltered} jobs</p>
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={mobileFiltersOpen} onOpenChange={onMobileFiltersChange}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden" size="lg" aria-label="Open filters menu">
                <SlidersHorizontal className="w-4 h-4 mr-2" aria-hidden="true" />
                Filters
                {(selectedCategories.length > 0 || selectedTypes.length > 0 || searchQuery) && (
                  <Badge
                    variant="destructive"
                    className="ml-2 px-1.5 py-0.5 text-xs"
                    aria-label={`${selectedCategories.length + selectedTypes.length + (searchQuery ? 1 : 0)} active filters`}
                  >
                    {selectedCategories.length + selectedTypes.length + (searchQuery ? 1 : 0)}
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
                <SheetDescription className="">Filter jobs by type and more</SheetDescription>
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
            <SelectTrigger className="w-45" aria-label="Sort jobs by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="featured" className="">Featured</SelectItem>
              <SelectItem value="newest" className="">Newest</SelectItem>
              <SelectItem value="salary-asc" className="">Salary: Low to High</SelectItem>
              <SelectItem value="salary-desc" className="">Salary: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {(selectedCategories.length > 0 || selectedTypes.length > 0 || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 mb-6" role="region" aria-label="Active filters">
          <span className="text-sm font-medium" id="active-filters-label">
            Active filters:
          </span>
          <div className="flex flex-wrap gap-2" aria-labelledby="active-filters-label">
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
                aria-label={`Remove ${category} filter`}
              >
                {category}
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
                aria-label={`Remove ${type} filter`}
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
                aria-label="Remove search filter"
              >
                Search: &ldquo;{searchQuery}&rdquo;
                <X className="w-3 h-3 ml-1" aria-hidden="true" />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-auto p-0 text-xs"
              aria-label="Clear all filters"
            >
              Clear all
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
