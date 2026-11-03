import { baseApi } from "../../base/baseAPI";

const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: () => `/reports${location?.search}`,
    }),
    updateReport: builder.mutation({
      query: ({ id, ...data }) => {
        return {
          url: `/reports/update-status/${id}`,
          method: "PATCH",
          body: data,
        };
      },
    }),

    actionReport: builder.mutation({
      query: (id) => {
        return {
          url: `/reports/${id}/disable`,
          method: "POST",
        };
      },
    }),
    deleteReport: builder.mutation({
      query: (id) => {
        return {
          url: `/reports/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetReportsQuery,
  useUpdateReportMutation,
  useActionReportMutation,
  useDeleteReportMutation,
} = reportsApi;
