import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Remote",
];

export function JobsFiltersPanel({
  searchQuery,
  selectedCategories,
  selectedTypes,
  categories,
  onSearchChange,
  onToggleCategory,
  onToggleType,
  onClearFilters,
}: {
  searchQuery: string;
  selectedCategories: string[];
  selectedTypes: string[];
  categories: Array<{ id: string; label: string }>;
  onSearchChange: (query: string) => void;
  onToggleCategory: (categoryValue: string) => void;
  onToggleType: (type: string) => void;
  onClearFilters: () => void;
}) {
  return (
    <div className="space-y-6 px-6">
      <div>
        <Label htmlFor="search" className="text-sm font-semibold mb-2 block">
          Search Jobs
        </Label>
        <Input
          id="search"
          type="text"
          placeholder="Search by title or company..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          aria-label="Search jobs by title or company"
        />
      </div>

      <Separator className="" />

      <fieldset className="px-6 lg:px-0" aria-label="Job categories">
        <div className="flex items-center justify-between mb-3">
          <legend className="text-sm font-semibold">Job categories</legend>
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
                <span>{category.label}</span>
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <Separator className="" />

      <fieldset className="px-6 lg:px-0" aria-label="Job types">
        <div className="flex items-center justify-between mb-3">
          <legend className="text-sm font-semibold">Job types</legend>
          {selectedTypes.length > 0 && (
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
          {JOB_TYPES.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => onToggleType(type)}
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

      <Button variant="primary" size="sm" onClick={onClearFilters} className="w-full">
        <X className="w-4 h-4 mr-2" />
        Clear All Filters
      </Button>
    </div>
  );
}
