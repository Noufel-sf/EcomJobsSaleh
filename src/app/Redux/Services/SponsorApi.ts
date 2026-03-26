import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Sponsor {
  _id: string;
  name: string;
  image?: string;
  website?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SponsorPayload {
  name: string;
  image?: string;
  website?: string;
  isActive?: boolean;
}
export interface GetAllsponsorsParams {
  page?: number;
  size?: number;
  prod_class?: string;
  minPrice?: number;
  maxPrice?: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const sponsorApi = createApi({
  reducerPath: "sponsorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["Sponsor"],
  endpoints: (builder) => ({
    getAllsponsors: builder.query<Sponsor[], GetAllsponsorsParams | void>({
      query: (params) => ({
        url: "",
        params: params
          ? {
              ...(params.page && { page: params.page }),
              ...(params.size && { size: params.size }),
              ...(params.prod_class && { prod_class: params.prod_class }),
              ...(params.minPrice && { minPrice: params.minPrice }),
              ...(params.maxPrice && { maxPrice: params.maxPrice }),
            }
          : undefined,
      }),
      providesTags: ["Sponsor"],
    }),

    getSponsorById: builder.query<Sponsor, string>({
      query: (id) => `/sponsors/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Sponsor", id }],
    }),

    createSponsor: builder.mutation<Sponsor, FormData>({
      query: (payload: FormData) => ({
        url: "/sponsors",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Sponsor", id: "LIST" }],
    }),

    updateSponsor: builder.mutation<
      Sponsor,
      { id: string; body: Partial<FormData> }
    >({
      query: ({ id, body }: { id: string; body: Partial<FormData> }) => ({
        url: `/sponsors/${id}`,
        method: "PUT",
        body,
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
        url: `/sponsors/${id}`,
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
  useGetSponsorsQuery,
  useGetSponsorByIdQuery,
  useCreateSponsorMutation,
  useUpdateSponsorMutation,
  useDeleteSponsorMutation,
} = sponsorApi;
