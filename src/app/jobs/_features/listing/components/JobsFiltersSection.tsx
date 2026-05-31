import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/context/I18nContext";
import { wilayas } from "@/lib/data";
import {
  EXPERIENCE_OPTIONS,
  type SalaryRangeKey,
} from "../useJobsListingController";

const JOB_TYPES = ["full_time", "part_time", "contract", "freelence"];
const ALL_LOCATIONS_VALUE = "__all__";
const ALL_DATES_VALUE = "";
const SALARY_RANGES: Array<{ key: SalaryRangeKey; min: string; max?: string }> =
  [
    { key: "0-20000", min: "0", max: "20,000" },
    { key: "20000-100000", min: "20,000", max: "100,000" },
    { key: "100000+", min: "100,000" },
  ];

export function JobsFiltersSection({
  selectedCategories,
  selectedTypes,
  selectedExperiences,
  selectedLocation,
  selectedSalaryRange,
  selectedPostedFrom,
  selectedPostedTo,
  categories,
  onToggleCategory,
  onToggleType,
  onToggleExperience,
  onLocationChange,
  onSalaryRangeChange,
  onPostedFromChange,
  onPostedToChange,
  onClearFilters,
}: {
  selectedCategories: string[];
  selectedTypes: string[];
  selectedExperiences?: string[];
  selectedLocation: string;
  selectedSalaryRange: SalaryRangeKey | "";
  selectedPostedFrom: string;
  selectedPostedTo: string;
  categories: Array<{ id: string; label: string }>;
  onToggleCategory: (categoryValue: string) => void;
  onToggleType: (type: string) => void;
  onToggleExperience?: (experience: string) => void;
  onLocationChange: (location: string) => void;
  onSalaryRangeChange: (range: SalaryRangeKey | "") => void;
  onPostedFromChange: (value: string) => void;
  onPostedToChange: (value: string) => void;
  onClearFilters: () => void;
}) {
  const { language } = useI18n();
  const labels = {
    en: {
      location: "Location",
      selectLocation: "Select a location",
      allLocations: "All locations",
      salary: "Salary",
      selectSalaryRange: "Select a salary range",
      allSalaries: "All salaries",
      salaryRanges: {
        "0-20000": "0 - 20,000",
        "20000-100000": "20,000 - 100,000",
        "100000+": "100,000+",
      } as Record<SalaryRangeKey, string>,
      postedFrom: "Posted from",
      postedTo: "Posted to",
      jobCategories: "Job categories",
      jobTypes: "Job types",
      clear: "Clear",
      clearAllFilters: "Clear All Filters",
      typeLabel: {
        "Full-time": "Full-time",
        "Part-time": "Part-time",
        Contract: "Contract",
        Freelance: "Freelance",
      } as Record<string, string>,
      experienceLabel: {
        NO_EXPERIENCE: "No experience",
        LESS_THAN_ONE_YEAR: "Less than one year",
        ONE_TO_FIVE_YEARS: "1 - 5 years",
        FIVE_TO_TEN_YEARS: "5 - 10 years",
        MORE_THAN_TEN_YEARS: "More than 10 years",
      } as Record<string, string>,
    },
    fr: {
      location: "Localisation",
      selectLocation: "Selectionnez une localisation",
      allLocations: "Toutes les localisations",
      salary: "Salaire",
      selectSalaryRange: "Selectionnez une tranche de salaire",
      allSalaries: "Tous les salaires",
      salaryRanges: {
        "0-20000": "0 - 20 000",
        "20000-100000": "20 000 - 100 000",
        "100000+": "100 000+",
      } as Record<SalaryRangeKey, string>,
      postedFrom: "Publie a partir de",
      postedTo: "Publie jusqu'a",
      jobCategories: "Categories d'emploi",
      jobTypes: "Types d'emploi",
      clear: "Effacer",
      clearAllFilters: "Effacer tous les filtres",
      typeLabel: {
        "Full-time": "Temps plein",
        "Part-time": "Temps partiel",
        Contract: "Contrat",
        Freelance: "Freelance",
      } as Record<string, string>,
      experienceLabel: {
        NO_EXPERIENCE: "Aucune expérience",
        LESS_THAN_ONE_YEAR: "Moins d'un an",
        ONE_TO_FIVE_YEARS: "1 - 5 ans",
        FIVE_TO_TEN_YEARS: "5 - 10 ans",
        MORE_THAN_TEN_YEARS: "Plus de 10 ans",
      } as Record<string, string>,
    },
    ar: {
      location: "الموقع",
      selectLocation: "اختر الموقع",
      allLocations: "كل المواقع",
      salary: "الراتب",
      selectSalaryRange: "اختر نطاق الراتب",
      allSalaries: "كل الرواتب",
      salaryRanges: {
        "0-20000": "0 - 20,000",
        "20000-100000": "20,000 - 100,000",
        "100000+": "100,000+",
      } as Record<SalaryRangeKey, string>,
      postedFrom: "منشور من",
      postedTo: "منشور الى",
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
      experienceLabel: {
        NO_EXPERIENCE: "لا توجد خبرة",
        LESS_THAN_ONE_YEAR: "أقل من سنة",
        ONE_TO_FIVE_YEARS: "من 1 إلى 5 سنوات",
        FIVE_TO_TEN_YEARS: "من 5 إلى 10 سنوات",
        MORE_THAN_TEN_YEARS: "أكثر من 10 سنوات",
      } as Record<string, string>,
    },
  } as const;

  const t = labels[language] ?? labels.en;

  return (
    <div className="space-y-6 px-6">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">{t.location}</Label>
        <Select
          value={selectedLocation || ALL_LOCATIONS_VALUE}
          onValueChange={(value) =>
            onLocationChange(value === ALL_LOCATIONS_VALUE ? "" : value)
          }
        >
          <SelectTrigger aria-label={t.selectLocation}>
            <SelectValue placeholder={t.selectLocation} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_LOCATIONS_VALUE}>
              {t.allLocations}
            </SelectItem>
            {wilayas.map((wilaya) => (
              <SelectItem key={wilaya.code} value={wilaya.name}>
                {wilaya.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-semibold">{t.salary}</Label>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant={selectedSalaryRange === "" ? "default" : "outline"}
            className="justify-start"
            onClick={() => onSalaryRangeChange("")}
          >
            {t.allSalaries}
          </Button>
          {SALARY_RANGES.map((range) => (
            <Button
              key={range.key}
              type="button"
              variant={
                selectedSalaryRange === range.key ? "default" : "outline"
              }
              className="justify-between"
              onClick={() =>
                onSalaryRangeChange(
                  selectedSalaryRange === range.key ? "" : range.key,
                )
              }
            >
              <span>{t.salaryRanges[range.key]}dz</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-semibold">{t.postedFrom}</Label>
        <Input
          type="date"
          value={selectedPostedFrom || ALL_DATES_VALUE}
          onChange={(e) => onPostedFromChange(e.target.value)}
          aria-label={t.postedFrom}
        />

        <Label className="text-sm font-semibold pt-2 block">{t.postedTo}</Label>
        <Input
          type="date"
          value={selectedPostedTo || ALL_DATES_VALUE}
          onChange={(e) => onPostedToChange(e.target.value)}
          aria-label={t.postedTo}
        />
      </div>

      <Separator />

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

      <Separator />

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

      <Separator />

      <fieldset className="px-6 lg:px-0" aria-label="Experience">
        <div className="flex items-center justify-between mb-3">
          <legend className="text-sm font-semibold">Experience</legend>
          {selectedExperiences && selectedExperiences.length > 0 && (
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
          {EXPERIENCE_OPTIONS.map((experience) => (
            <div key={experience.value} className="flex items-center space-x-2">
              <Checkbox
                id={`experience-${experience.value}`}
                checked={selectedExperiences?.includes(experience.value) ?? false}
                onCheckedChange={() => onToggleExperience?.(experience.value)}
              />
              <label
                htmlFor={`experience-${experience.value}`}
                className="text-sm flex-1 cursor-pointer flex items-center justify-between"
              >
                <span>{t.experienceLabel[experience.value] ?? experience.label}</span>
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <Separator />

      <Button
        variant="primary"
        size="sm"
        onClick={onClearFilters}
        className="w-full"
      >
        <X className="w-4 h-4 mr-2" />
        {t.clearAllFilters}
      </Button>
    </div>
  );
}
