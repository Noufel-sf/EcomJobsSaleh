import { useMemo, useReducer } from "react";
import { useGetAllProductsQuery } from "@/Redux/Services/ProductsApi";
import { useGetAllClassificationsQuery } from "@/Redux/Services/ClassificationApi";
import type { Product } from "@/lib/DatabaseTypes";

type CatalogCategory = {
  id: string;
  name: string;
};

const ITEMS_PER_PAGE = 12;

type SortBy = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

type CatalogState = {
  currentPage: number;
  selectedCategories: string[];
  searchQuery: string;
  sortBy: SortBy;
};

type CatalogAction =
  | { type: "SET_PAGE"; payload: number }
  | { type: "TOGGLE_CATEGORY"; payload: string }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_SORT"; payload: SortBy }
  | { type: "CLEAR_FILTERS" };

const initialState: CatalogState = {
  currentPage: 1,
  selectedCategories: [],
  searchQuery: "",
  sortBy: "featured",
};

function reducer(state: CatalogState, action: CatalogAction): CatalogState {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "TOGGLE_CATEGORY": {
      const exists = state.selectedCategories.includes(action.payload);
      return {
        ...state,
        currentPage: 1,
        selectedCategories: exists
          ? state.selectedCategories.filter((c) => c !== action.payload)
          : [...state.selectedCategories, action.payload],
      };
    }
    case "SET_SEARCH":
      return { ...state, currentPage: 1, searchQuery: action.payload };
    case "SET_SORT":
      return { ...state, currentPage: 1, sortBy: action.payload };
    case "CLEAR_FILTERS":
      return { ...state, currentPage: 1, selectedCategories: [], searchQuery: "", sortBy: "featured" };
    default:
      return state;
  }
}

function getAverageRating(product: Product): number {
  const candidate = product as Product & { averageRating?: number };
  return candidate.averageRating ?? 0;
}

function sortProducts(items: Product[], sortBy: SortBy): Product[] {
  const sorted = [...items];

  switch (sortBy) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      sorted.sort((a, b) => getAverageRating(b) - getAverageRating(a));
      break;
    case "newest":
      sorted.sort((a, b) => b.id.localeCompare(a.id));
      break;
    default:
      break;
  }

  return sorted;
}

export function useCatalogController() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { data: productsData, isLoading } = useGetAllProductsQuery(undefined);
  const { data: categoriesData } = useGetAllClassificationsQuery(undefined);

  const products = useMemo(() => productsData?.content ?? [], [productsData?.content]);
  const categories = useMemo<CatalogCategory[]>(
    () => (categoriesData?.content ?? []).map((c) => ({ id: c.id, name: c.name })),
    [categoriesData?.content],
  );

  const filteredProducts = useMemo(() => {
    let result = products;

    if (state.selectedCategories.length > 0) {
      result = result.filter(
        (product) => product.prod_class && state.selectedCategories.includes(product.prod_class),
      );
    }

    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      result = result.filter((product) => product.name.toLowerCase().includes(query));
    }

    return sortProducts(result, state.sortBy);
  }, [products, state.searchQuery, state.selectedCategories, state.sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (state.currentPage - 1) * ITEMS_PER_PAGE,
    state.currentPage * ITEMS_PER_PAGE,
  );

  return {
    isLoading,
    categories,
    filteredProducts,
    paginatedProducts,
    totalPages,
    currentPage: state.currentPage,
    selectedCategories: state.selectedCategories,
    searchQuery: state.searchQuery,
    sortBy: state.sortBy,
    setPage: (page: number) => dispatch({ type: "SET_PAGE", payload: page }),
    toggleCategory: (categoryId: string) => dispatch({ type: "TOGGLE_CATEGORY", payload: categoryId }),
    setSearchQuery: (query: string) => dispatch({ type: "SET_SEARCH", payload: query }),
    setSortBy: (sort: SortBy) => dispatch({ type: "SET_SORT", payload: sort }),
    clearFilters: () => dispatch({ type: "CLEAR_FILTERS" }),
  };
}
