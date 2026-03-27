import { Filter } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/DatabaseTypes";

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
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="status" aria-label="Loading products">
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
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
        <Button onClick={onClearFilters} variant="outline" size="default" type="button">
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list" aria-label={`Showing ${paginatedProducts.length} products`}>
      {paginatedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
