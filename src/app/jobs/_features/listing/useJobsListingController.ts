import { useMemo, useReducer } from "react";
import { useGetAllCategoriesQuery, useGetAllJobsQuery } from "@/Redux/Services/JobApi";
import type { Job } from "@/lib/DatabaseTypes";

const ITEMS_PER_PAGE = 9;

type SortBy = "featured" | "newest" | "salary-asc" | "salary-desc";

type State = {
  currentPage: number;
  selectedCategories: string[];
  selectedTypes: string[];
  searchQuery: string;
  sortBy: SortBy;
};

type Action =
  | { type: "SET_PAGE"; payload: number }
  | { type: "TOGGLE_CATEGORY"; payload: string }
  | { type: "TOGGLE_TYPE"; payload: string }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_SORT"; payload: SortBy }
  | { type: "CLEAR_FILTERS" };

const initialState: State = {
  currentPage: 1,
  selectedCategories: [],
  selectedTypes: [],
  searchQuery: "",
  sortBy: "featured",
};

function reducer(state: State, action: Action): State {
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
    case "TOGGLE_TYPE": {
      const exists = state.selectedTypes.includes(action.payload);
      return {
        ...state,
        currentPage: 1,
        selectedTypes: exists
          ? state.selectedTypes.filter((t) => t !== action.payload)
          : [...state.selectedTypes, action.payload],
      };
    }
    case "SET_SEARCH":
      return { ...state, currentPage: 1, searchQuery: action.payload };
    case "SET_SORT":
      return { ...state, currentPage: 1, sortBy: action.payload };
    case "CLEAR_FILTERS":
      return { ...state, currentPage: 1, selectedCategories: [], selectedTypes: [], searchQuery: "", sortBy: "featured" };
    default:
      return state;
  }
}

function parseSalary(raw: string): number {
  return parseInt(raw.replace(/[^0-9]/g, ""), 10) || 0;
}

function sortJobs(items: Job[], sortBy: SortBy): Job[] {
  const sorted = [...items];

  switch (sortBy) {
    case "salary-asc":
      sorted.sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
      break;
    case "salary-desc":
      sorted.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
      break;
    case "newest":
      sorted.sort((a, b) => b.id.localeCompare(a.id));
      break;
    default:
      break;
  }

  return sorted;
}

export function useJobsListingController() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { data: jobsResponse, isLoading } = useGetAllJobsQuery();
  const { data: categoriesData } = useGetAllCategoriesQuery();

  const jobs = useMemo(() => jobsResponse?.content ?? [], [jobsResponse?.content]);

  const categories = useMemo(
    () =>
      (categoriesData?.content ?? []).map((category) => ({
        id: category.id,
        label: category.categories,
        value: category.content || category.categories,
      })),
    [categoriesData?.content],
  );

  const filteredJobs = useMemo(() => {
    let result = jobs;

    if (state.selectedCategories.length > 0) {
      result = result.filter((job) =>
        job.categories?.some((categoryId: string) => state.selectedCategories.includes(categoryId)),
      );
    }

    if (state.selectedTypes.length > 0) {
      result = result.filter((job) => state.selectedTypes.includes(job.type));
    }

    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query),
      );
    }

    return sortJobs(result, state.sortBy);
  }, [jobs, state.searchQuery, state.selectedCategories, state.selectedTypes, state.sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(state.currentPage, totalPages);

  const paginatedJobs = filteredJobs.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  return {
    isLoading,
    categories,
    filteredJobs,
    paginatedJobs,
    totalPages,
    currentPage: safeCurrentPage,
    selectedCategories: state.selectedCategories,
    selectedTypes: state.selectedTypes,
    searchQuery: state.searchQuery,
    sortBy: state.sortBy,
    setPage: (page: number) => dispatch({ type: "SET_PAGE", payload: page }),
    toggleCategory: (categoryId: string) => dispatch({ type: "TOGGLE_CATEGORY", payload: categoryId }),
    toggleType: (type: string) => dispatch({ type: "TOGGLE_TYPE", payload: type }),
    setSearchQuery: (query: string) => dispatch({ type: "SET_SEARCH", payload: query }),
    setSortBy: (sort: SortBy) => dispatch({ type: "SET_SORT", payload: sort }),
    clearFilters: () => dispatch({ type: "CLEAR_FILTERS" }),
  };
}
