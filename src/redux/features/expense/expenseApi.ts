import { baseApi } from "../../base/baseAPI";

export const expenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Expense Endpoints
    getExpenses: builder.query({
      query: (params) => {
        const { search, ...bodyParams } = params || {};
        const queryString = search ? `?q=${encodeURIComponent(search)}` : "";
        return {
          url: `/expense/get-all${queryString}`,
          method: "POST",
          body: bodyParams,
        };
      },
      providesTags: ["expense"],
    }),
    getExpenseById: builder.query({
      query: (id) => `/expense/get-by/${id}`,
      providesTags: (_result, _error, id) => [{ type: "expense", id }],
    }),
    addExpense: builder.mutation({
      query: (data) => ({
        url: "/expense/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["expense"],
    }),
    updateExpense: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/expense/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "expense",
        { type: "expense", id },
      ],
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `/expense/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["expense"],
    }),

    // Expense Category Endpoints
    getExpenseCategories: builder.query({
      query: (params) => ({
        url: "/expense-category/get-all",
        method: "POST",
        body: params || {},
      }),
      providesTags: ["expenseCategory"],
    }),
    addExpenseCategory: builder.mutation({
      query: (data) => ({
        url: "/expense-category/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["expenseCategory"],
    }),
    updateExpenseCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/expense-category/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["expenseCategory"],
    }),
    deleteExpenseCategory: builder.mutation({
      query: (id) => ({
        url: `/expense-category/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["expenseCategory"],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useGetExpenseByIdQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpenseCategoriesQuery,
  useAddExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
} = expenseApi;
