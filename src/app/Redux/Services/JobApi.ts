import { Job, JobApplication } from "@/lib/DatabaseTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { JobCategory } from "@/lib/DatabaseTypes";

const API_URL = "https://wadkniss.onrender.com/api/v1";

export interface GetAllJobsParams {
  page?: number;
  size?: number;
  type?: string;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
}

export interface GetAllCategoriesResponse {
  content: JobCategory[];
  page : number;
  size : number;
  totalPages : number;
  totalCategories : number;
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

export interface UpdateEmployerProfilePayload {
  name: string;
  email: string;
  id?: string;
  logo?: string;
  description?: string;
  location?: string;
  specialization?: string;
}

export interface UpdateEmployerPasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface CreateJobPayload {
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: number;
  description: string;
  responsibilities: string[];
  whoYouAre: string[];
  niceToHaves: string[];
  jobCategories: string;
  requiredSkills: string[];
  appliedCount: number;
  totalCapacity: number;
  applyBefore: string;
  jobPostedOn: string;
}

export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}`,
  }),

  tagTypes: ["Jobs", "Job", "Applications", "Application", "Profile", "JobsCategories"],

  endpoints: (builder) => ({
    getAllJobs: builder.query<GetAllJobsResponse, GetAllJobsParams | void>({
      query: (params) => ({
        url: "/jobs",
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

    getAllCategories: builder.query<GetAllCategoriesResponse, void>({
      query: () => "/categoriess",
      providesTags: ["JobsCategories"],
    }),


    getJobById: builder.query<Job, string>({
      query: (id) => `/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: "Job", id }],
    }),

    searchJobs: builder.query({
      query: ({ query, title, location, type }) => ({
        url: "/jobs/search",
        params: {
          query: query,
          ...(title && { title }),
          ...(location && { location }),
          ...(type && { type }),
        },
      }),
      providesTags: ["Jobs"],
    }),

    createJob: builder.mutation<{ message?: string }, CreateJobPayload>({
      query: (jobData) => ({
        url: "/jobs",
        method: "POST",
        body: jobData,
      }),
      invalidatesTags: ["Jobs"],
    }),

    updateJob: builder.mutation({
      query: ({ id, jobData }) => ({
        url: `/jobs/${id}`,
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
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Jobs"],
    }),

    // Application endpoints
    getAllApplications: builder.query<GetAllApplicationsResponse, void>({
      query: () => "/jobs/applications",
      providesTags: ["Applications"],
    }),

    getApplicationsByJobId: builder.query<JobApplication[], string>({
      query: (jobId) => `/jobs/applications/job/${jobId}`,
      providesTags: ["Applications"],
    }),

    getApplicationById: builder.query<JobApplication, string>({
      query: (id) => `/jobs/applications/${id}`,
      providesTags: (result, error, id) => [{ type: "Application", id }],
    }),

    createApplication: builder.mutation({
      query: (applicationData) => ({
        url: "/jobs/applications",
        method: "POST",
        body: applicationData,
      }),
      invalidatesTags: ["Applications"],
    }),

    updateApplicationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/jobs/applications/${id}/status`,
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
        url: `/jobs/applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Applications"],
    }),

    updateEmployerProfile: builder.mutation<
      { message?: string },
      UpdateEmployerProfilePayload | FormData
    >({
      query: (payload) => ({
        url: "/company",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Profile"],
    }),

    updateEmployerPassword: builder.mutation<
      { message?: string },
      UpdateEmployerPasswordPayload
    >({
      query: (payload) => ({
        url: "/user/updatePassword",
        method: "PATCH",
        body: payload,
      }),
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
  useGetAllCategoriesQuery,
  useGetApplicationByIdQuery,
  useCreateApplicationMutation,
  useUpdateApplicationStatusMutation,
  useDeleteApplicationMutation,
  useUpdateEmployerProfileMutation,
  useUpdateEmployerPasswordMutation,
} = jobApi;
