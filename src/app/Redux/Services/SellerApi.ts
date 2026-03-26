import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { create } from "domain";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";

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
    baseUrl: `${API_URL}`,
    // credentials: "include",
  }),
  tagTypes: ["Store", "Seller"],
  endpoints: (builder) => ({
    // Get seller information

    createSellerInfo: builder.query<SellerInfo, void>({
      query: (sellerdata) => ({
        url: "/store",
        method: "POST",
        body: sellerdata,
      }),
      providesTags: (result, error, id) => [{ type: "Store", id }],
    }),

    getSellerInfo: builder.query<SellerInfo, string>({
      query: (sellerId) => `store/${sellerId}`,
      providesTags: (result, error, id) => [{ type: "Store", id }],
    }),

    // Update seller information
    updateSellerInfo: builder.mutation<
      UpdateSellerResponse,
      { sellerId: string; data: UpdateSellerRequest }
    >({
      query: ({ sellerId, data }) => ({
        url: `store/${sellerId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { sellerId }) => [
        { type: "Store", id: sellerId },
      ],
    }),

    // Update seller image/logo
    updateSellerImage: builder.mutation<
      UpdateSellerResponse,
      { sellerId: string; formData: FormData }
    >({
      query: ({ sellerId, formData }) => ({
        url: `store/${sellerId}/image`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { sellerId }) => [
        { type: "Store", id: sellerId },
      ],
    }),
  }),
});

export const {
  useCreateSellerInfoQuery,
  useGetSellerInfoQuery,
  useUpdateSellerInfoMutation,
  useUpdateSellerImageMutation,
} = sellerApi;
