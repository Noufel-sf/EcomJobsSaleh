import { Filter, SlidersHorizontal } from "lucide-react";
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
import { FiltersPanel } from "./FiltersPanel";

type SortBy = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

export function ProductsToolbar({
  totalFiltered,
  totalShown,
  categories,
  selectedCategories,
  searchQuery,
  sortBy,
  mobileFiltersOpen,
  onMobileFiltersChange,
  onSearchChange,
  onToggleCategory,
  onClearFilters,
  onSortChange,
}: {
  totalFiltered: number;
  totalShown: number;
  categories: Array<{ id: string; name: string }>;
  selectedCategories: string[];
  searchQuery: string;
  sortBy: SortBy;
  mobileFiltersOpen: boolean;
  onMobileFiltersChange: (open: boolean) => void;
  onSearchChange: (value: string) => void;
  onToggleCategory: (categoryId: string) => void;
  onClearFilters: () => void;
  onSortChange: (value: SortBy) => void;
}) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">All Products</h1>
        <p className="text-sm text-muted-foreground">
          Showing {totalShown} of {totalFiltered} products
        </p>
      </div>

      <div className="flex items-center gap-2 ">
        <Sheet open={mobileFiltersOpen} onOpenChange={onMobileFiltersChange}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden" size="lg" aria-label="Open filters menu">
              <SlidersHorizontal className="w-4 h-4 mr-2" aria-hidden="true" />
              Filters
              {(selectedCategories.length > 0 || searchQuery) && (
                <Badge
                  variant="destructive"
                  className="ml-2 px-1.5 py-0.5 text-xs"
                  aria-label={`${selectedCategories.length + (searchQuery ? 1 : 0)} active filters`}
                >
                  {selectedCategories.length + (searchQuery ? 1 : 0)}
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
              <SheetDescription className="">Filter products by category, price, and more</SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FiltersPanel
                categories={categories}
                selectedCategories={selectedCategories}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                onToggleCategory={onToggleCategory}
                onClearFilters={onClearFilters}
              />
            </div>
          </SheetContent>
        </Sheet>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]" aria-label="Sort products by">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="">
            <SelectItem value="featured" className="">Featured</SelectItem>
            <SelectItem value="newest" className="">Newest</SelectItem>
            <SelectItem value="price-asc" className="">Price: Low to High</SelectItem>
            <SelectItem value="price-desc" className="">Price: High to Low</SelectItem>
            <SelectItem value="rating" className="">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
