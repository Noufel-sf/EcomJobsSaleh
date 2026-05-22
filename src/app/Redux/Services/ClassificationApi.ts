import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://wadkniss-r6ar.onrender.com/api/v1";

interface Classification {
  id: string;
  name: string;
  desc?: string;
  img?: string | null;
}

interface GetAllClassificationsResponse {
  content: Classification[];
}

interface CreateClassificationData {
  body: FormData;
}

interface UpdateClassificationData {
  id: string;
  body: FormData;
}

export const classificationApi = createApi({
  reducerPath: "classificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/classifications`,
    credentials: "include",
  }),
  tagTypes: ["Classifications"],
  endpoints: (builder) => ({

    getAllClassifications: builder.query<GetAllClassificationsResponse, void>({
      query: () => "",
      providesTags: ["Classifications"],
    }),

    addClassification: builder.mutation<Classification, CreateClassificationData>({
      query: ({ body }) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Classifications"],
    }),

    updateClassification: builder.mutation<Classification, UpdateClassificationData>({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Classifications"],
    }),

    deleteClassification: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Classifications"],
    }),

  }),
});


export const {
  useGetAllClassificationsQuery,
  useAddClassificationMutation,
  useUpdateClassificationMutation,
  useDeleteClassificationMutation,
} = classificationApi;
