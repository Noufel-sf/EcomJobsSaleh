import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type AdminUserRole =
  | "employer"
  | "seller"
  | string;
export type AdminUserStatus = "active" | "suspended" | "pending" | string;

export interface AdminUser {
  id: string;
  name: string;
  email?: string;
  phone?: string | null;
  role: AdminUserRole;
  status: AdminUserStatus;
  createdAt: string;
}

export interface GetAdminUsersParams {
  search?: string;
  role?: "employer" | "seller";
  status?: "active" | "suspended";
  page?: number;
  limit?: number;
}

interface UpdateAdminUserStatusPayload {
  userId: string;
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
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getAdminUsers: builder.query<AdminUser[], GetAdminUsersParams | void>({
      query: (params) => ({
        url: "",
        params: params
          ? {
              ...(params.page && { page: params.page }),
              ...(params.limit && { limit: params.limit }),
            }
          : undefined,
      }),
      providesTags: ["Users"],
    }),

    updateAdminUserStatus: builder.mutation<
      AdminUser,
      UpdateAdminUserStatusPayload
    >({
      query: ({ userId, status }) => ({
        url: `/users/${userId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "Users", id: userId },
        { type: "Users", id: "LIST" },
      ],
    }),

    deleteAdminUser: builder.mutation<DeleteAdminUserResponse, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: "Users", id: userId },
        { type: "Users", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useUpdateAdminUserStatusMutation,
  useDeleteAdminUserMutation,
} = usersApi;
