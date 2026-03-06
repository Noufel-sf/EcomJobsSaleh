import { Job, JobApplication } from "@/lib/DatabaseTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = "https://wadkniss.onrender.com/api/v1";

export interface GetAllJobsParams {
  page?: number;
  size?: number;
  type?: string;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
}

export interface GetAllJobsResponse {
  content: Job[];
  totalJobs: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface GetAllApplicationsResponse {
  content: JobApplication[];
  totalApplications: number;
  page: number;
  size: number;
  totalPages: number;
}

export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/jobs`,
  }),

  tagTypes: ["Jobs", "Job", "Applications", "Application"],

  endpoints: (builder) => ({
    getAllJobs: builder.query<GetAllJobsResponse, GetAllJobsParams | void>({
      query: (params) => ({
        url: "",
        params: params
          ? {
              ...(params.page && { page: params.page }),
              ...(params.size && { size: params.size }),
              ...(params.type && { type: params.type }),
              ...(params.location && { location: params.location }),
              ...(params.minSalary && { minSalary: params.minSalary }),
              ...(params.maxSalary && { maxSalary: params.maxSalary }),
            }
          : undefined,
      }),
      providesTags: ["Jobs"],
    }),

    getJobById: builder.query<Job, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Job", id }],
    }),

    searchJobs: builder.query({
      query: ({ query, title, location, type }) => ({
        url: "/search",
        params: {
          query: query,
          ...(title && { title }),
          ...(location && { location }),
          ...(type && { type }),
        },
      }),
      providesTags: ["Jobs"],
    }),

    createJob: builder.mutation({
      query: (jobData) => ({
        url: "",
        method: "POST",
        body: jobData,
      }),
      invalidatesTags: ["Jobs"],
    }),

    updateJob: builder.mutation({
      query: ({ id, jobData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: jobData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Jobs",
        { type: "Job", id },
      ],
    }),

    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Jobs"],
    }),

    // Application endpoints
    getAllApplications: builder.query<GetAllApplicationsResponse, void>({
      query: () => "/applications",
      providesTags: ["Applications"],
    }),

    getApplicationsByJobId: builder.query<JobApplication[], string>({
      query: (jobId) => `/applications/job/${jobId}`,
      providesTags: ["Applications"],
    }),

    getApplicationById: builder.query<JobApplication, string>({
      query: (id) => `/applications/${id}`,
      providesTags: (result, error, id) => [{ type: "Application", id }],
    }),

    createApplication: builder.mutation({
      query: (applicationData) => ({
        url: "/applications",
        method: "POST",
        body: applicationData,
      }),
      invalidatesTags: ["Applications"],
    }),

    updateApplicationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/applications/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Applications",
        { type: "Application", id },
      ],
    }),

    deleteApplication: builder.mutation({
      query: (id) => ({
        url: `/applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Applications"],
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useSearchJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetAllApplicationsQuery,
  useGetApplicationsByJobIdQuery,
  useGetApplicationByIdQuery,
  useCreateApplicationMutation,
  useUpdateApplicationStatusMutation,
  useDeleteApplicationMutation,
} = jobApi;
