import { baseApi } from "../../base/baseAPI";

export const incomeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIncomes: builder.query({
      query: (params) => {
        const { search, ...bodyParams } = params || {};
        const queryString = search ? `?q=${encodeURIComponent(search)}` : "";
        return {
          url: `/income/get-all${queryString}`,
          method: "POST",
          body: bodyParams || {},
        };
      },
      providesTags: ["income"],
    }),

    getIncomeById: builder.query({
      query: (id) => `/income/get-by/${id}`,
      providesTags: (_result, _error, id) => [{ type: "income", id }],
    }),

    calculateBill: builder.mutation({
      query: (data) => ({
        url: "/income/calculate",
        method: "POST",
        body: data,
      }),
    }),

    addIncome: builder.mutation({
      query: (data) => ({
        url: "/income/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["income"],
    }),

    updateIncome: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/income/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ["income", { type: "income", id }],
    }),

    deleteIncome: builder.mutation({
      query: (id) => ({
        url: `/income/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["income"],
    }),
  }),
});

export const {
  useGetIncomesQuery,
  useGetIncomeByIdQuery,
  useCalculateBillMutation,
  useAddIncomeMutation,
  useUpdateIncomeMutation,
  useDeleteIncomeMutation,
} = incomeApi;
