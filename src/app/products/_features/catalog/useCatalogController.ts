import { useEffect, useMemo, useReducer } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetAllClassificationsQuery } from "@/Redux/Services/ClassificationApi";
import type { Product } from "@/lib/DatabaseTypes";

type CatalogCategory = {
  id: string;
  name: string;
};

const ITEMS_PER_PAGE = 12;

type SortBy = "newest" | "price-asc" | "price-desc";

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
  sortBy: "newest",
};

function parseSortParam(value: string | null): SortBy {
  switch (value) {
    case "price,asc":
    case "price-asc":
      return "price-asc";
    case "price,desc":
    case "price-desc":
      return "price-desc";
    case "id,desc":
    case "newest":
    default:
      return "newest";
  }
}

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
        sortBy: "newest",
      };
    default:
      return state;
  }
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
  const searchParamsString = searchParams?.toString() ?? "";

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

  const searchQuery = searchParams?.get("search") ?? "";
  const sortBy = parseSortParam(searchParams?.get("sort") ?? null);

  const updateUrl = (
    updater: (params: URLSearchParams) => void,
    options?: { resetPage?: boolean },
  ) => {
    const params = new URLSearchParams(searchParamsString);

    updater(params);

    if (options?.resetPage) {
      params.delete("page");
    }

    const query = params.toString();
    const safePathname = pathname ?? "/products";

    router.replace(query ? `${safePathname}?${query}` : safePathname, {
      scroll: false,
    });
  };

  const products = useMemo(() => initial?.products ?? [], [initial]);

  const categories = useMemo<CatalogCategory[]>(() => {
    if (initial?.categories) return initial.categories;
    return (categoriesData?.content ?? []).map((c) => ({ id: c.id, name: c.name }));
  }, [categoriesData?.content, initial]);

  // Use server-provided products directly. Server handles filtering/pagination/sorting.
  const totalPages = useMemo(() => {
    if (typeof initial?.totalPages === "number") {
      return Math.max(1, initial.totalPages);
    }
    return Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  }, [products.length, initial]);

  const paginatedProducts = useMemo(() => products, [products]);

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

  const currentPage = initial?.currentPage ?? state.currentPage;
  const totalFiltered = initial?.totalFiltered ?? products.length;

  return {
    isLoading: false,
    categories,
    filteredProducts: products,
    paginatedProducts,
    totalPages,
    currentPage,
    totalFiltered,
    selectedCategories: state.selectedCategories,
    searchQuery,
    sortBy,
    setPage: (page: number) => {
      updateUrl(
        (params) => {
          params.set("page", String(page));
        },
        { resetPage: false },
      );
    },
    toggleCategory: (categoryId: string) => {
      const exists = state.selectedCategories.includes(categoryId);
      const nextSelected = exists ? [] : [categoryId];
      dispatch({ type: "SET_CATEGORIES", payload: nextSelected });
      updateClassificationInUrl(nextSelected);
    },
    setSearchQuery: (query: string) => {
      updateUrl(
        (params) => {
          const next = query.trim();
          if (next) {
            params.set("search", next);
          } else {
            params.delete("search");
          }
        },
        { resetPage: true },
      );
    },
    setSortBy: (sort: SortBy) => {
      updateUrl(
        (params) => {
          const backendSort =
            sort === "price-asc"
              ? "price,asc"
              : sort === "price-desc"
                ? "price,desc"
                : "id,desc";
          params.set("sort", backendSort);
        },
        { resetPage: true },
      );
    },
    clearFilters: () => {
      dispatch({ type: "CLEAR_FILTERS" });
      const safePathname = pathname ?? "/products";
      router.replace(safePathname, { scroll: false });
    },
  };
}
