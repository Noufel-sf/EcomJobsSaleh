import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = "https://wadkniss.onrender.com/api/v1";

// Types for Seller
export interface SellerInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  img?: string | null;
  description?: string | null;
  storeName?: string | null;
  created_at?: Date;
  total_orders?: number;
  successful_orders?: number;
  waiting_orders?: number;
  returned_orders?: number;
  total_sales?: number;
}

export interface UpdateSellerRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  description?: string;
  storeName?: string;
  img?: string;
}

export interface UpdateSellerResponse {
  message: string;
  seller: SellerInfo;
}

export const sellerApi = createApi({
  reducerPath: "sellerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/sellers`,
    credentials: "include",
  }),
  tagTypes: ["Seller"],
  endpoints: (builder) => ({
    // Get seller information
    getSellerInfo: builder.query<SellerInfo, string>({
      query: (sellerId) => `/${sellerId}`,
      providesTags: (result, error, id) => [{ type: "Seller", id }],
    }),

    // Update seller information
    updateSellerInfo: builder.mutation<
      UpdateSellerResponse,
      { sellerId: string; data: UpdateSellerRequest }
    >({
      query: ({ sellerId, data }) => ({
        url: `/${sellerId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { sellerId }) => [
        { type: "Seller", id: sellerId },
      ],
    }),

    // Update seller image/logo
    updateSellerImage: builder.mutation<
      UpdateSellerResponse,
      { sellerId: string; formData: FormData }
    >({
      query: ({ sellerId, formData }) => ({
        url: `/${sellerId}/image`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { sellerId }) => [
        { type: "Seller", id: sellerId },
      ],
    }),
  }),
});

export const {
  useGetSellerInfoQuery,
  useUpdateSellerInfoMutation,
  useUpdateSellerImageMutation,
} = sellerApi;
