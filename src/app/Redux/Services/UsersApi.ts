import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://wadkniss-r6ar.onrender.com/api/v1";


export type AdminUserRole =
  | "employer"
  | "seller"
  | string;
export type AdminUserStatus = "active" | "suspended" | string;

export interface AdminUser {
  id: string;
  name: string;
  email?: string;
  phone?: string | null;
  role: AdminUserRole;
  status: AdminUserStatus;
  createdAt: string;
}

interface PaginatedAdminUsersResponse {
  content?: AdminUser[];
  data?: AdminUser[];
}

export interface GetAdminUsersParams {
  search?: string;
  role?: "employer" | "seller";
  status?: "active" | "suspended";
  page?: number;
  limit?: number;
}

export interface SuperAdminStasticsResponse {
  totalJobs: number;
  totalJobApplication: number;
  totalProduct: number;
  totalPendingProduct: number;
  totalPendingJobs: number;
  totalSellers: number;
  totalCompanys: number;
}

export interface AdminSellerStatisticsResponse {
  totalSales: number;
  totalOrders: number;
  successfulOrders: number;
  waitingOrders: number;
}

export interface AdminEmployerStatisticsResponse {
  jobsNb: number;
  applicationNb: number;
}

interface UpdateAdminUserStatusPayload {
  id: string;
  isActive: boolean;
}

interface DeleteAdminUserResponse {
  message?: string;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
  }),
  tagTypes: ["Sellers", "Employers"],
  endpoints: (builder) => ({
    getAllSellers: builder.query<PaginatedAdminUsersResponse, GetAdminUsersParams | void>({
      query: (params) => ({
        url: "/users/sellers",
        params: params
          ? {
              ...(params.page && { page: params.page }),
              ...(params.limit && { limit: params.limit }),
            }
          : undefined,
      }),
      providesTags: [
        { type: "Sellers", id: "LIST" },
      ],
    }),
    getAllEmployers: builder.query<PaginatedAdminUsersResponse, GetAdminUsersParams | void>({
      query: (params) => ({
        url: "/users/company",
        params: params
          ? {
              ...(params.page && { page: params.page }),
              ...(params.limit && { limit: params.limit }),
            }
          : undefined,
      }),
      providesTags: [
        { type: "Employers", id: "LIST" },
      ],
    }),

        getAdminSuperStatistics: builder.query<SuperAdminStasticsResponse, void>({
          query: () => "/DashBoard",
          providesTags: ["Sellers", "Employers"],
      }),
        getAdminSellerStatistics: builder.query<AdminSellerStatisticsResponse, void>({
          query: () => "/sellers/dashBoard",
          providesTags: ["Sellers"],  
      }),
        getAdminEmployerStatistics: builder.query<AdminEmployerStatisticsResponse, void>({
          query: () => "/companys/dashBoard",
          providesTags: ["Employers"],
       }),

      updateAdminEmployersStatus: builder.mutation<
        AdminUser,
        UpdateAdminUserStatusPayload
      >({
        query: ({ id, isActive }) => ({
          url: `/users/compnay`,
          method: "PATCH",
          body: { isActive , id },
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "Employers", id: id },
          { type: "Employers", id: "LIST" },
        ],
      }),
      updateAdminSellersStatus: builder.mutation<
        AdminUser,
        UpdateAdminUserStatusPayload
      >({
        query: ({ id, isActive }) => ({
          url: `/users/seller`,
          method: "PATCH",
          body: { isActive , id },
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "Sellers", id: id },
          { type: "Sellers", id: "LIST" },
        ],
      }),

    deleteAdminSeller: builder.mutation<DeleteAdminUserResponse, string>({
      query: (id) => ({
        url: `/sellers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: "Employers", id: userId },
        { type: "Employers", id: "LIST" },
        { type: "Sellers", id: userId },
        { type: "Sellers", id: "LIST" },
      ],
    }),
    deleteAdminEmployer: builder.mutation<DeleteAdminUserResponse, string>({
      query: (id) => ({
        url: `/companys/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: "Employers", id: userId },
        { type: "Employers", id: "LIST" },
        { type: "Sellers", id: userId },
        { type: "Sellers", id: "LIST" },
      ],
    }),


  }),
});

export const {
  useGetAllSellersQuery,
  useUpdateAdminSellersStatusMutation,
  useGetAllEmployersQuery,
  useUpdateAdminEmployersStatusMutation,
  useDeleteAdminSellerMutation,
  useDeleteAdminEmployerMutation,
  useGetAdminSuperStatisticsQuery,
  useGetAdminSellerStatisticsQuery,
  useGetAdminEmployerStatisticsQuery,
} = usersApi;
