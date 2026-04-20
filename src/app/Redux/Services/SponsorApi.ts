import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Sponsor {
  name: string;
  image?: string;
  description ?: string;
  sponsorLink?: string;
}

export interface SponsorPayload {
  name: string;
  image?: string;
  sponsorLink?: string;
  description?: string;
  isActive?: boolean;
  // ownerId: boolean;
}
export interface GetAllsponsorsParams {
  page?: number;
  content?: Sponsor[];
  size?: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://wadkniss-r6ar.onrender.com/api/v1" ;

export const sponsorApi = createApi({
  reducerPath: "sponsorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Sponsor"],
  endpoints: (builder) => ({
    getsponsors: builder.query<Sponsor[], GetAllsponsorsParams | void>({
      query: (params) => ({
        url: "/sponsoreds",
        params: params
          ? {
              ...(params.page && { page: params.page }),
              ...(params.size && { size: params.size }),
            }
          : undefined,
      }),
      providesTags: [{ type: "Sponsor", id: "LIST" }],
    }),

    getSponsorById: builder.query<Sponsor, string>({
      query: (id) => `/sponsoreds/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Sponsor", id }],
    }),

    createSponsor: builder.mutation<Sponsor, FormData>({
      query: (payload: FormData) => ({
        url: "/sponsoreds",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Sponsor", id: "LIST" }],
    }),

    updateSponsor: builder.mutation<
      Sponsor,
      { id: string; body: FormData }
    >({
      query: ({ id, body }: { id: string; body: FormData }) => ({
        url: `/sponsoreds/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Sponsor", id: arg.id },
        { type: "Sponsor", id: "LIST" },
      ],
    }),

    updateSponsorStatus: builder.mutation<
      Sponsor,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/sponsoreds`,
        method: "PATCH",
        body: { id, isActive },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Sponsor", id: arg.id },
        { type: "Sponsor", id: "LIST" },
      ],
    }),

    deleteSponsor: builder.mutation<
      { success: boolean; message?: string },
      string
    >({
      query: (id) => ({
        url: `/sponsoreds/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Sponsor", id },
        { type: "Sponsor", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetsponsorsQuery,
  useGetSponsorByIdQuery,
  useCreateSponsorMutation,
  useUpdateSponsorMutation,
  useUpdateSponsorStatusMutation,
  useDeleteSponsorMutation,
} = sponsorApi;

