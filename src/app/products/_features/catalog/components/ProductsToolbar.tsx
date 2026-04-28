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
import { useI18n } from "@/context/I18nContext";

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
  const { language } = useI18n();
  const labels = {
    en: {
      allProducts: "All Products",
      showing: "Showing",
      of: "of",
      products: "products",
      openFiltersMenu: "Open filters menu",
      filters: "Filters",
      activeFilters: "active filters",
      filterProductsDescription: "Filter products by category, price, and more",
      sortProductsBy: "Sort products by",
      sortBy: "Sort by",
      featured: "Featured",
      newest: "Newest",
      priceLowToHigh: "Price: Low to High",
      priceHighToLow: "Price: High to Low",
      highestRated: "Highest Rated",
    },
    fr: {
      allProducts: "Tous les produits",
      showing: "Affichage",
      of: "sur",
      products: "produits",
      openFiltersMenu: "Ouvrir le menu des filtres",
      filters: "Filtres",
      activeFilters: "filtres actifs",
      filterProductsDescription: "Filtrer les produits par categorie, prix et plus",
      sortProductsBy: "Trier les produits par",
      sortBy: "Trier par",
      featured: "En vedette",
      newest: "Plus recent",
      priceLowToHigh: "Prix: croissant",
      priceHighToLow: "Prix: decroissant",
      highestRated: "Mieux notes",
    },
    ar: {
      allProducts: "كل المنتجات",
      showing: "عرض",
      of: "من",
      products: "منتجات",
      openFiltersMenu: "فتح قائمة الفلاتر",
      filters: "الفلاتر",
      activeFilters: "فلاتر نشطة",
      filterProductsDescription: "تصفية المنتجات حسب الفئة والسعر والمزيد",
      sortProductsBy: "ترتيب المنتجات حسب",
      sortBy: "ترتيب حسب",
      featured: "مميزة",
      newest: "الاحدث",
      priceLowToHigh: "السعر: من الاقل للاعلى",
      priceHighToLow: "السعر: من الاعلى للاقل",
      highestRated: "الاعلى تقييما",
    },
  } as const;
  const t = labels[language] ?? labels.en;

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">{t.allProducts}</h1>
        <p className="text-sm text-muted-foreground">
          {t.showing} {totalShown} {t.of} {totalFiltered} {t.products}
        </p>
      </div>

      <div className="flex items-center gap-2 ">
        <Sheet open={mobileFiltersOpen} onOpenChange={onMobileFiltersChange}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden" size="lg" aria-label={t.openFiltersMenu}>
              <SlidersHorizontal className="w-4 h-4 mr-2" aria-hidden="true" />
              {t.filters}
              {(selectedCategories.length > 0 || searchQuery) && (
                <Badge
                  variant="destructive"
                  className="ml-2 px-1.5 py-0.5 text-xs"
                  aria-label={`${selectedCategories.length + (searchQuery ? 1 : 0)} ${t.activeFilters}`}
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
                {t.filters}
              </SheetTitle>
              <SheetDescription className="">{t.filterProductsDescription}</SheetDescription>
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
          <SelectTrigger className="w-45" aria-label={t.sortProductsBy}>
            <SelectValue placeholder={t.sortBy} />
          </SelectTrigger>
          <SelectContent className="">
            <SelectItem value="featured" className="">{t.featured}</SelectItem>
            <SelectItem value="newest" className="">{t.newest}</SelectItem>
            <SelectItem value="price-asc" className="">{t.priceLowToHigh}</SelectItem>
            <SelectItem value="price-desc" className="">{t.priceHighToLow}</SelectItem>
            <SelectItem value="rating" className="">{t.highestRated}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
