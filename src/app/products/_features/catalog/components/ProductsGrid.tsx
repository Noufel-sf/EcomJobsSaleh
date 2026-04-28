import { Filter } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/DatabaseTypes";
import { useI18n } from "@/context/I18nContext";

export function ProductsGrid({
  isLoading,
  paginatedProducts,
  onClearFilters,
  skeletonCount = 12,
}: {
  isLoading: boolean;
  paginatedProducts: Product[];
  onClearFilters: () => void;
  skeletonCount?: number;
}) {
  const { language } = useI18n();
  const labels = {
    en: {
      loadingProducts: "Loading products",
      noProductsFound: "No products found",
      adjustFilters: "Try adjusting your filters or search query",
      clearAllFilters: "Clear all filters",
      showing: "Showing",
      products: "products",
    },
    fr: {
      loadingProducts: "Chargement des produits",
      noProductsFound: "Aucun produit trouve",
      adjustFilters: "Essayez d'ajuster vos filtres ou votre recherche",
      clearAllFilters: "Effacer tous les filtres",
      showing: "Affichage",
      products: "produits",
    },
    ar: {
      loadingProducts: "جاري تحميل المنتجات",
      noProductsFound: "لا توجد منتجات",
      adjustFilters: "حاول تعديل الفلاتر او البحث",
      clearAllFilters: "مسح جميع الفلاتر",
      showing: "عرض",
      products: "منتجات",
    },
  } as const;
  const t = labels[language] ?? labels.en;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="status" aria-label={t.loadingProducts}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (paginatedProducts.length === 0) {
    return (
      <div className="text-center py-16" role="status" aria-live="polite">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4" aria-hidden="true">
          <Filter className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{t.noProductsFound}</h3>
        <p className="text-muted-foreground mb-4">{t.adjustFilters}</p>
        <Button onClick={onClearFilters} variant="outline" size="default" type="button">
          {t.clearAllFilters}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list" aria-label={`${t.showing} ${paginatedProducts.length} ${t.products}`}>
      {paginatedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
