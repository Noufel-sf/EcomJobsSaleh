import { Suspense } from "react";
import { CatalogHero } from "./_features/catalog/components/CatalogHero";
import AllProductsClient from "./AllProductsClient";

export default function AllProductsPage() {
  return (
    <main>
      <CatalogHero />
      <Suspense fallback={<div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8" />}>
        <AllProductsClient />
      </Suspense>
    </main>
  );
}
