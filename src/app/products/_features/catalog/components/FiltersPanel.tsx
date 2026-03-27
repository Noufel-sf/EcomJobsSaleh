import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function FiltersPanel({
  categories,
  selectedCategories,
  searchQuery,
  onSearchChange,
  onToggleCategory,
  onClearFilters,
}: {
  categories: Array<{ id: string; name: string }>;
  selectedCategories: string[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onToggleCategory: (categoryId: string) => void;
  onClearFilters: () => void;
}) {
  return (
    <div className="space-y-6 px-6">
      <div>
        <Label htmlFor="search" className="text-sm font-semibold mb-2 block">
          Search Products
        </Label>
        <Input
          id="search"
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          aria-label="Search products by name"
        />
      </div>

      <Separator className="" />

      <fieldset className="px-6 lg:px-0" aria-label="Product categories">
        <div className="flex items-center justify-between mb-3">
          <legend className="text-sm font-semibold">Categories</legend>
          {selectedCategories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => onToggleCategory(category.id)}
                className=""
              />
              <label
                htmlFor={`category-${category.id}`}
                className="text-sm flex-1 cursor-pointer flex items-center justify-between"
              >
                <span>{category.name}</span>
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <Separator className="" />

      <Button variant="primary" size="sm" onClick={onClearFilters} className="w-full">
        <X className="w-4 h-4 mr-2" />
        Clear All Filters
      </Button>
    </div>
  );
}
