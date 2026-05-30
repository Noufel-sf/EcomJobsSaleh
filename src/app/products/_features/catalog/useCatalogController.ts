import { useEffect, useMemo, useReducer } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetAllProductsQuery,
  useGetProductsByClassificationQuery,
} from "@/Redux/Services/ProductsApi";
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
  | { type: "SET_CATEGORIES"; payload: string[] }
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
        selectedCategories: exists ? [] : [action.payload],
      };
    }
    case "SET_CATEGORIES": {
      const isSameLength =
        state.selectedCategories.length === action.payload.length;
      const isSameValues =
        isSameLength &&
        state.selectedCategories.every(
          (value, index) => value === action.payload[index],
        );

      if (isSameValues) return state;

      return {
        ...state,
        currentPage: 1,
        selectedCategories: action.payload,
      };
    }
    case "SET_SEARCH":
      return { ...state, currentPage: 1, searchQuery: action.payload };
    case "SET_SORT":
      return { ...state, currentPage: 1, sortBy: action.payload };
    case "CLEAR_FILTERS":
      return {
        ...state,
        currentPage: 1,
        selectedCategories: [],
        searchQuery: "",
        sortBy: "featured",
      };
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

export function useCatalogController(initial?: {
  products?: Product[];
  categories?: { id: string; name: string }[];
  totalPages?: number;
  currentPage?: number;
  totalFiltered?: number;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeClassification = state.selectedCategories[0];

  const allProductsQuery = useGetAllProductsQuery(
    activeClassification ? skipToken : undefined,
  );

  const classifiedProductsQuery = useGetProductsByClassificationQuery(
    activeClassification
      ? { classificationID: activeClassification }
      : skipToken,
  );

  const productsData = activeClassification
    ? classifiedProductsQuery.data
    : allProductsQuery.data;

  const isProductsLoading = activeClassification
    ? classifiedProductsQuery.isLoading || classifiedProductsQuery.isFetching
    : allProductsQuery.isLoading || allProductsQuery.isFetching;

  const { data: categoriesData } = useGetAllClassificationsQuery(undefined);

  const classificationParam = searchParams?.get("classification") ?? "";
  const categoryIdsFromUrl = useMemo(() => {
    const rawValues = classificationParam ? [classificationParam] : [];

    if (rawValues.length === 0) return [] as string[];

    const flat = rawValues
      .flatMap((value) => value.split(","))
      .map((value) => value.trim())
      .filter(Boolean);

    return Array.from(new Set(flat)).slice(0, 1);
  }, [classificationParam]);

  useEffect(() => {
    dispatch({ type: "SET_CATEGORIES", payload: categoryIdsFromUrl });
  }, [categoryIdsFromUrl]);

  const products = useMemo(() => {
    if (initial?.products) return initial.products;
    return productsData?.content ?? [];
  }, [productsData?.content, initial]);

  const categories = useMemo<CatalogCategory[]>(() => {
    if (initial?.categories) return initial.categories;
    return (categoriesData?.content ?? []).map((c) => ({ id: c.id, name: c.name }));
  }, [categoriesData?.content, initial]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query),
      );
    }

    return sortProducts(result, state.sortBy);
  }, [products, state.searchQuery, state.sortBy]);

  const totalPages = useMemo(() => {
    if (typeof initial?.totalPages === "number") return Math.max(1, initial.totalPages);
    return Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  }, [filteredProducts.length, initial]);

  const paginatedProducts = useMemo(() => {
    if (initial?.products) return initial.products;
    return filteredProducts.slice(
      (state.currentPage - 1) * ITEMS_PER_PAGE,
      state.currentPage * ITEMS_PER_PAGE,
    );
  }, [filteredProducts, state.currentPage, initial]);

  const updateClassificationInUrl = (nextSelected: string[]) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    const safePathname = pathname ?? "/products";

    if (nextSelected[0]) {
      params.set("classification", nextSelected[0]);
    } else {
      params.delete("classification");
    }

    const query = params.toString();
    router.replace(query ? `${safePathname}?${query}` : safePathname, {
      scroll: false,
    });
  };

  // If initial data for pagination was provided, prefer those values for totals/current page
  const currentPage = initial?.currentPage ?? state.currentPage;
  const totalFiltered = initial?.totalFiltered ?? filteredProducts.length;

  return {
    isLoading: initial?.products ? false : isProductsLoading,
    categories,
    filteredProducts,
    paginatedProducts,
    totalPages,
    currentPage,
    totalFiltered,
    selectedCategories: state.selectedCategories,
    searchQuery: state.searchQuery,
    sortBy: state.sortBy,
    setPage: (page: number) => {
      dispatch({ type: "SET_PAGE", payload: page });
    },
    toggleCategory: (categoryId: string) => {
      const exists = state.selectedCategories.includes(categoryId);
      const nextSelected = exists ? [] : [categoryId];
      dispatch({ type: "SET_CATEGORIES", payload: nextSelected });
      updateClassificationInUrl(nextSelected);
    },
    setSearchQuery: (query: string) =>
      dispatch({ type: "SET_SEARCH", payload: query }),
    setSortBy: (sort: SortBy) => dispatch({ type: "SET_SORT", payload: sort }),
    clearFilters: () => {
      dispatch({ type: "CLEAR_FILTERS" });
      updateClassificationInUrl([]);
    },
  };
}
