import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL =  "https://wadkniss.onrender.com/api/v1";

// Types
export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface SellerRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  description?: string;
  storeName?: string;
}

interface EmployerRegisterRequest {
  name: string;
  email: string;
  password: string;
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
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Register mutation
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Seller Register mutation
    registerSeller: builder.mutation<AuthResponse, SellerRegisterRequest>({
      query: (sellerData) => ({
        url: "/auth/seller/register",
        method: "POST",
        body: sellerData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Employer Register mutation
    registerEmployer: builder.mutation<AuthResponse, EmployerRegisterRequest>({
      query: (employerData) => ({
        url: "/auth/employer/register",
        method: "POST",
        body: employerData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Get current user profile
    getProfile: builder.query<AuthResponse, void>({
      query: () => "/user/showMe",
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
  useRegisterMutation,
  useRegisterSellerMutation,
  useRegisterEmployerMutation,
  useGetProfileQuery,
  useLogoutMutation,
} = authApi;
