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

interface UpdateAdminUserStatusPayload {
  id: string;
  status: "active" | "suspended";
}

interface DeleteAdminUserResponse {
  message?: string;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
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

      updateAdminEmployersStatus: builder.mutation<
        AdminUser,
        UpdateAdminUserStatusPayload
      >({
        query: ({ id, status }) => ({
          url: `/users/company`,
          method: "PATCH",
          body: { status , id },
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
        query: ({ id, status }) => ({
          url: `/users/seller`,
          method: "PATCH",
          body: { status , id },
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "Sellers", id: id },
          { type: "Sellers", id: "LIST" },
        ],
      }),

    deleteAdminUser: builder.mutation<DeleteAdminUserResponse, string>({
      query: (id) => ({
        url: `/users/${id}`,
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
  useDeleteAdminUserMutation,
} = usersApi;
