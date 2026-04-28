import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/context/I18nContext";

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
  const { language } = useI18n();
  const labels = {
    en: {
      searchJobs: "Search Jobs",
      searchPlaceholder: "Search by title or company...",
      searchAria: "Search jobs by title or company",
      jobCategories: "Job categories",
      jobTypes: "Job types",
      clear: "Clear",
      clearAllFilters: "Clear All Filters",
      typeLabel: {
        "Full-time": "Full-time",
        "Part-time": "Part-time",
        Contract: "Contract",
        Freelance: "Freelance",
        Internship: "Internship",
        Remote: "Remote",
      } as Record<string, string>,
    },
    fr: {
      searchJobs: "Rechercher des emplois",
      searchPlaceholder: "Rechercher par titre ou entreprise...",
      searchAria: "Rechercher des emplois par titre ou entreprise",
      jobCategories: "Categories d'emploi",
      jobTypes: "Types d'emploi",
      clear: "Effacer",
      clearAllFilters: "Effacer tous les filtres",
      typeLabel: {
        "Full-time": "Temps plein",
        "Part-time": "Temps partiel",
        Contract: "Contrat",
        Freelance: "Freelance",
        Internship: "Stage",
        Remote: "A distance",
      } as Record<string, string>,
    },
    ar: {
      searchJobs: "البحث عن وظائف",
      searchPlaceholder: "ابحث بالعنوان او الشركة...",
      searchAria: "ابحث عن وظائف بالعنوان او الشركة",
      jobCategories: "فئات الوظائف",
      jobTypes: "انواع الوظائف",
      clear: "مسح",
      clearAllFilters: "مسح جميع الفلاتر",
      typeLabel: {
        "Full-time": "دوام كامل",
        "Part-time": "دوام جزئي",
        Contract: "عقد",
        Freelance: "عمل حر",
        Internship: "تدريب",
        Remote: "عن بعد",
      } as Record<string, string>,
    },
  } as const;
  const t = labels[language] ?? labels.en;

  return (
    <div className="space-y-6 px-6">
      <div>
        <Label htmlFor="search" className="text-sm font-semibold mb-2 block">
          {t.searchJobs}
        </Label>
        <Input
          id="search"
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          aria-label={t.searchAria}
        />
      </div>

      <Separator className="" />

      <fieldset className="px-6 lg:px-0" aria-label={t.jobCategories}>
        <div className="flex items-center justify-between mb-3">
          <legend className="text-sm font-semibold">{t.jobCategories}</legend>
          {selectedCategories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              {t.clear}
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

      <fieldset className="px-6 lg:px-0" aria-label={t.jobTypes}>
        <div className="flex items-center justify-between mb-3">
          <legend className="text-sm font-semibold">{t.jobTypes}</legend>
          {selectedTypes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              {t.clear}
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
                <span>{t.typeLabel[type] ?? type}</span>
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <Separator className="" />

      <Button variant="primary" size="sm" onClick={onClearFilters} className="w-full">
        <X className="w-4 h-4 mr-2" />
        {t.clearAllFilters}
      </Button>
    </div>
  );
}
