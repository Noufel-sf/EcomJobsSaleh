import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/context/I18nContext";

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
  const { language } = useI18n();
  const labels = {
    en: {
      searchProducts: "Search Products",
      searchPlaceholder: "Search by name...",
      searchAria: "Search products by name",
      productCategories: "Product categories",
      categories: "Categories",
      clear: "Clear",
      clearAllFilters: "Clear All Filters",
    },
    fr: {
      searchProducts: "Rechercher des produits",
      searchPlaceholder: "Rechercher par nom...",
      searchAria: "Rechercher des produits par nom",
      productCategories: "Categories de produits",
      categories: "Categories",
      clear: "Effacer",
      clearAllFilters: "Effacer tous les filtres",
    },
    ar: {
      searchProducts: "البحث عن المنتجات",
      searchPlaceholder: "ابحث بالاسم...",
      searchAria: "ابحث عن المنتجات بالاسم",
      productCategories: "فئات المنتجات",
      categories: "الفئات",
      clear: "مسح",
      clearAllFilters: "مسح جميع الفلاتر",
    },
  } as const;
  const t = labels[language] ?? labels.en;

  return (
    <div className="space-y-6 px-6">
      <div>
        <Label htmlFor="search" className="text-sm font-semibold mb-2 block">
          {t.searchProducts}
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

      <fieldset className="px-6 lg:px-0" aria-label={t.productCategories}>
        <div className="flex items-center justify-between mb-3">
          <legend className="text-sm font-semibold">{t.categories}</legend>
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
                <span>{category.name}</span>
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
