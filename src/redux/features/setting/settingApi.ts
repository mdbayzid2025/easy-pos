import { baseApi } from "../../base/baseAPI";

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFAQ: builder.query({
      query: () => "/faqs",
      providesTags: ["faqs"]
      // transformResponse: (res: { data: any }) => res?.data,
    }),
    addFAQ: builder.mutation({
      query: (data) => ({
        url: "/faqs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["faqs"]
    }),
    updateFAQ: builder.mutation({
      query: (data) => ({
        url: `/faqs/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["faqs"]
    }),
    deleteFAQ: builder.mutation({
      query: (id) => {
        return {
          url: `/faqs/${id}`,
          method: "DELETE",
        }
      }
    }),

    getAbout: builder.query({
      query: () => "/rules/ABOUT",
      transformResponse: (res: { data: any }) => res?.data,
      providesTags: ["rules"],
    }),
    getPrivacyPolicy: builder.query({
      query: () => "/rules/PRIVACY",
      transformResponse: (res: { data: any }) => res?.data,
      providesTags: ["rules"],
    }),
    getTermsCondition: builder.query({
      query: () => "/rules/TERMS",
      transformResponse: (res: { data: any }) => res?.data,
      providesTags: ["rules"],
    }),
    addDisclaimer: builder.mutation({
      query: (data) => ({
        url: "/rules",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["rules"],
    }),

    addSupport: builder.mutation({
      query: (data) => {
        return {
          url: "/contact-info",
          method: "POST",
          body: data,
        };
      },
    }),
    getSupport: builder.query({
      query: () => "/contact-info",
      transformResponse: (res: { data: any }) => res?.data,
    }),
    // ---------------- Commission Manage  Start---------------
    getCommission: builder.query({
      query: () => "/charges",
      transformResponse: (res: { data: any }) => res?.data,
      providesTags: ["commission"],
    }),
    postCommission: builder.mutation({
      query: (data) => ({
        url: `/charges`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["commission"],
    }),

    // ---------------- Commission Manage  End---------------

    getNotification: builder.query({
      query: () => "/reports",
      transformResponse: (res: { data: any }) => res?.data,
    }),
  }),
});



export const {
  useGetFAQQuery,
  useGetAboutQuery,
  useGetPrivacyPolicyQuery,

  useGetSupportQuery,
  useAddSupportMutation,

  useGetCommissionQuery,
  usePostCommissionMutation,
  
  useAddFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,

  useGetTermsConditionQuery,
  useAddDisclaimerMutation,
} = settingApi;
