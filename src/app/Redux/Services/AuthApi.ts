import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://wadkniss-r6ar.onrender.com/api/v1";

// Types
export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

type RawAttachment = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

type RawAuthPayload = {
  user?: Partial<User>;
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  companyAtt?: RawAttachment | null;
  sellerAtt?: RawAttachment | null;
  superAdminAtt?: RawAttachment | null;
};

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
  user: User | null;
}

function normalizeRole(role?: string): string {
  const value = (role || "").trim().toUpperCase().replace(/^ROLE_/, "");

  if (value === "SUPER_ADMIN" || value === "ADMIN-SUPER") {
    return "ADMIN-SUPER";
  }

  if (value === "SELLER_ADMIN" || value === "ADMIN-SELLER") {
    return "ADMIN-SELLER";
  }

  return value;
}

function normalizeUser(raw: RawAuthPayload | null | undefined): User | null {
  if (!raw) return null;

  const attachment = raw.companyAtt || raw.sellerAtt || raw.superAdminAtt || null;
  const role = normalizeRole(raw.role || attachment?.role);

  if (!role) return null;

  return {
    ...raw,
    userId: raw.userId || raw.id || attachment?.id || "",
    name: raw.name || attachment?.name || "",
    email: raw.email || attachment?.email || "",
    role,
  } as User;
}

function normalizeAuthResponse(response: unknown): AuthResponse {
  const payload = (response || {}) as RawAuthPayload;
  const source = payload.user ? ({ ...payload.user, ...payload } as RawAuthPayload) : payload;
  const user = normalizeUser(source);

  return {
    user,
  };
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
        url: "login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: unknown) => normalizeAuthResponse(response),
      invalidatesTags: ["Auth"],
    }),

    // Seller Register mutation
    registerSeller: builder.mutation<AuthResponse, FormData>({
      query: (sellerData :FormData) => ({
        url: "/seller",
        method: "POST",
        body: sellerData,
      }),
      transformResponse: (response: unknown) => normalizeAuthResponse(response),
      invalidatesTags: ["Auth"],
    }),

    // Employer Register mutation
    registerEmployerCompany: builder.mutation<AuthResponse, EmployerRegisterRequest>({
      query: (employerData) => ({
        url: "/companys",
        method: "POST",
        body: employerData,
      }),
      transformResponse: (response: unknown) => normalizeAuthResponse(response),
      invalidatesTags: ["Company"],
    }),

    // Get current user profile from HttpOnly cookie session
    getProfile: builder.query<AuthResponse, void>({
      query: () => "/user",
      transformResponse: (response: unknown) => normalizeAuthResponse(response),
      providesTags: ["Auth"],
    }),

    // Logout mutation
    logout: builder.mutation<{ msg: string }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
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
  useLazyGetProfileQuery,
  useLogoutMutation,
} = authApi;
