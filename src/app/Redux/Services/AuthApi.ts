import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://wadkniss-r6ar.onrender.com/api/v1";

// Types
export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface EmployerRegisterRequest {
  name: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  description: string;
  location: string;
  specialization: string;
  logo?: string;
}

interface AuthResponse {
  user: User;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Auth", "Company"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Seller Register mutation
    registerSeller: builder.mutation<AuthResponse, FormData>({
      query: (sellerData :FormData) => ({
        url: "/seller",
        method: "POST",
        body: sellerData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Employer Register mutation
    registerEmployerCompany: builder.mutation<AuthResponse, EmployerRegisterRequest>({
      query: (employerData) => ({
        url: "/companys",
        method: "POST",
        body: employerData,
      }),
      invalidatesTags: ["Company"],
    }),

    // Get current user profile from HttpOnly cookie session
    getProfile: builder.query<AuthResponse, void>({
      query: () => "/user",
      providesTags: ["Auth"],
    }),

    // Logout mutation
    logout: builder.mutation<{ msg: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterSellerMutation,
  useRegisterEmployerCompanyMutation,
  useGetProfileQuery,
  useLogoutMutation,
} = authApi;
