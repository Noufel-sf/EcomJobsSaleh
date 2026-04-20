import { Product } from "@/lib/DatabaseTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";

export interface GetAllProductsParams {
  page?: number;
  size?: number;
  prod_class?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface GetAllProductsResponse {
  content: Product[];
  totalProducts: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface GetProductsByClassificationArgs {
  classificationID: string;
  page?: number;
  size?: number;
}

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/products`,
    credentials: "include",
  }),

  tagTypes: ["Products", "Product", "Categories"],

  endpoints: (builder) => ({
    getAllProducts: builder.query<
      GetAllProductsResponse,
      GetAllProductsParams | void
    >({
      query: (params) => ({
        url: "",
        params: params
          ? {
              ...(params.page && { page: params.page }),
              ...(params.size && { size: params.size }),
              ...(params.prod_class && { prod_class: params.prod_class }),
            }
          : undefined,
      }),
      providesTags: ["Products"],
    }),
    getNotAvailableProducts: builder.query<
      GetAllProductsResponse,
      GetAllProductsParams | void
    >({
      query: (params) => ({
        url: "/NoAvailable",
        params: params
          ? {
              ...(params.page && { page: params.page }),
              ...(params.size && { size: params.size }),
            }
          : undefined,
      }),
      providesTags: ["Products"],
    }),

    getProductsByClassification: builder.query<
      GetAllProductsResponse,
      GetProductsByClassificationArgs
    >({
      query: ({ classificationID, page, size }) => ({
        url: `/ByClassification/${classificationID}`,
        params: {
          ...(page && { page }),
          ...(size && { size }),
        },
      }),
      providesTags: ["Products"],
    }),

    getSponsoredProducts: builder.query<
      GetAllProductsResponse,
      GetAllProductsParams
    >({
      query: (params) => ({
        url: `/sponsored`,
        params: {
          ...(params?.page && { page: params.page }),
          ...(params?.size && { size: params.size }),
        },
      }),
      providesTags: ["Products"],
    }),

    getBestSelling: builder.query<{ content: Product[] }, void>({
      query: () => "/bestSelling",
      providesTags: ["Products"],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    getSellerProducts: builder.query({
      query: (sellerId) => `/seller/${sellerId}`,
      providesTags: ["Products"],
    }),

    searchProducts: builder.query({
      query: ({
        query,
        name,
        smallDesc,
        prod_class,
        minPrice,
        maxPrice,
        page,
        limit,
      }) => ({
        url: "/search",
        params: {
          query: query,
          ...(prod_class && { prod_class }),
          ...(name && { name }),
          ...(smallDesc && { smallDesc }),
          ...(minPrice && { minPrice }),
          ...(maxPrice && { maxPrice }),
          ...(page && { page }),
          ...(limit && { limit }),
        },
      }),
      providesTags: ["Products"],
    }),

    createProduct: builder.mutation({
      query: (formData) => ({
        url: "",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Products",
        { type: "Product", id },
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    updateProductStatus: builder.mutation({
      query: ({ id, available }) => ({
        url: `/status/${id}`,
        method: "PUT",
        body: { status: available },
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetNotAvailableProductsQuery,
  useGetBestSellingQuery,
  useGetProductByIdQuery,
  useGetSellerProductsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useGetProductsByClassificationQuery,
  useGetSponsoredProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateProductStatusMutation,
} = productsApi;
