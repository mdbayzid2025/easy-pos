import { baseApi } from "../../base/baseAPI";

export const openingBalanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOpeningBalances: builder.query({
      query: (params) => ({
        url: "/opening-balance/get-all",
        method: "POST",
        body: params || {},
      }),
      providesTags: ["openingBalance"],
    }),
    addOpeningBalance: builder.mutation({
      query: (data) => ({
        url: "/opening-balance/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["openingBalance"],
    }),
    updateOpeningBalance: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/opening-balance/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["openingBalance"],
    }),
  }),
});

export const {
  useGetOpeningBalancesQuery,
  useAddOpeningBalanceMutation,
  useUpdateOpeningBalanceMutation,
} = openingBalanceApi;
