import { CatalogHero } from "./_features/catalog/components/CatalogHero";
import AllProductsClient from "./AllProductsClient";
import type { Product } from "@/lib/DatabaseTypes";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";

const ITEMS_PER_PAGE = 12;

type SearchParams = {
  classification?: string | string[];
  search?: string | string[];
  sort?: string | string[];
  page?: string | string[];
};

function getSingleParam(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

// parseCsvParam removed (unused)

function parseNumber(value?: string | undefined, fallback = 1) {
  const n = Number.parseInt(value ?? String(fallback), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

async function fetchClassifications() {
  try {
    const res = await fetch(`${API_URL}/classifications`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    const content = Array.isArray(data.content) ? data.content : [];
    type Classification = { id: string; name: string };
    return content.map((c: Classification) => ({ id: c.id, name: c.name }));
  } catch {
    return [];
  }
}

async function fetchProductsByClassification(classificationId: string) {
  try {
    const res = await fetch(`${API_URL}/products/ByClassification/${classificationId}`, { next: { revalidate: 120 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.content) ? data.content : [];
  } catch {
    return [];
  }
}

async function fetchAllProducts() {
  try {
    const res = await fetch(`${API_URL}/products`, { next: { revalidate: 120 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.content) ? data.content : [];
  } catch {
    return [];
  }
}

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const rawClassification = getSingleParam(params.classification);
  const rawSearch = getSingleParam(params.search) ?? "";
  const rawPage = getSingleParam(params.page) ?? "1";

  const classificationsPromise = fetchClassifications();

  const products: Product[] = rawClassification
    ? await fetchProductsByClassification(rawClassification)
    : await fetchAllProducts();

  const categories = await classificationsPromise;

  const searchQuery = rawSearch.trim().toLowerCase();

  let filtered = products;
  if (searchQuery) {
    filtered = filtered.filter((p: Product) => (p.name || "").toLowerCase().includes(searchQuery));
  }

  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const currentPage = Math.min(parseNumber(rawPage, 1), totalPages);

  const paginatedProducts = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <main>
      <CatalogHero />
      <AllProductsClient
        initialProducts={paginatedProducts}
        initialCategories={categories}
        initialTotalFiltered={totalFiltered}
        initialCurrentPage={currentPage}
        initialTotalPages={totalPages}
      />
    </main>
  );
}
