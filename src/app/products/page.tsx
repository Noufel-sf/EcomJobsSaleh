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

function parseNumber(value?: string | undefined, fallback = 1) {
  const n = Number.parseInt(value ?? String(fallback), 10);

  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Spring Boot sorting format:
 * ?sort=price,asc
 * ?sort=price,desc
 * ?sort=id,desc
 */
function normalizeSortParam(value?: string): string {
  switch (value) {
    // accept both frontend tokens and backend (comma) tokens
    case "price-asc":
    case "price,asc":
      return "price,asc";

    case "price-desc":
    case "price,desc":
      return "price,desc";

    case "newest":
    case "id,desc":
    default:
      return "id,desc";
  }
}

async function fetchClassifications() {
  try {
    const res = await fetch(`${API_URL}/classifications`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return [] as Array<{ id: string; name: string }>;
    }

    const data = await res.json();

    const content = Array.isArray(data.content)
      ? data.content
      : [];

    type Classification = {
      id: string;
      name: string;
    };

    return content.map((c: Classification) => ({
      id: c.id,
      name: c.name,
    }));
  } catch (error) {
    console.error("Failed to fetch classifications:", error);

    return [] as Array<{ id: string; name: string }>;
  }
}

async function fetchProductsByClassification(
  classificationId: string,
  sort: string
) {
  try {
    const query = new URLSearchParams();

    /**
     * Spring Boot pagination sorting
     * Example:
     * ?sort=price,asc
     */
    query.set("sort", sort);

    const requestUrl = `${API_URL}/products/ByClassification/${classificationId}?${query.toString()}`;

    // debug log removed

    const res = await fetch(requestUrl, {
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      console.error(
        "Failed classification fetch:",
        res.status,
        res.statusText
      );

      return [];
    }

    const data = await res.json();

    return Array.isArray(data.content)
      ? data.content
      : [];
  } catch (error) {
    console.error("Classification fetch error:", error);

    return [];
  }
}

async function fetchAllProducts(sort: string) {
  try {
    const query = new URLSearchParams();

    /**
     * Spring Boot sorting
     * Example:
     * ?sort=price,asc
     */
    query.set("sort", sort);

    const requestUrl = `${API_URL}/products?${query.toString()}`;

    // debug log removed

    const res = await fetch(requestUrl, {
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      console.error(
        "Failed products fetch:",
        res.status,
        res.statusText
      );

      return [];
    }

    const data = await res.json();

    return Array.isArray(data.content)
      ? data.content
      : [];
  } catch (error) {
    console.error("Products fetch error:", error);

    return [];
  }
}

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const rawClassification = getSingleParam(
    params.classification
  );

  const rawSearch =
    getSingleParam(params.search) ?? "";

  const rawSort = getSingleParam(params.sort);

  const rawPage =
    getSingleParam(params.page) ?? "1";

  /**
   * Fetch classifications in parallel
   */
  const classificationsPromise =
    fetchClassifications();

  /**
   * Fetch products with Spring Boot sort
   */
  const products: Product[] = rawClassification
    ? await fetchProductsByClassification(
        rawClassification,
        normalizeSortParam(rawSort)
      )
    : await fetchAllProducts(
        normalizeSortParam(rawSort)
      );

  const categories = await classificationsPromise;

  /**
   * Frontend search filtering
   */
  const searchQuery = rawSearch
    .trim()
    .toLowerCase();

  let filtered = products;

  if (searchQuery) {
    filtered = filtered.filter((p: Product) =>
      (p.name || "")
        .toLowerCase()
        .includes(searchQuery)
    );
  }

  /**
   * Frontend pagination
   */
  const totalFiltered = filtered.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalFiltered / ITEMS_PER_PAGE)
  );

  const currentPage = Math.min(
    parseNumber(rawPage, 1),
    totalPages
  );

  const paginatedProducts = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
