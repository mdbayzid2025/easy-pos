import { baseApi } from "../../base/baseAPI";

export interface BankDepositItem {
  _id?: string;
  dateString: string;
  year: number;
  month?: number;
  title: string;
  description?: string;
  note?: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

export const bankDepositApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBankDeposits: builder.query({
      query: (params) => {
        const { search, ...bodyParams } = params || {};
        const queryString = search ? `?q=${encodeURIComponent(search)}` : "";
        return {
          url: `/bank-deposit/get-all${queryString}`,
          method: "POST",
          body: bodyParams,
        };
      },
      providesTags: ["bankDeposit"],
    }),
    getBankDepositById: builder.query({
      query: (id) => `/bank-deposit/get-by/${id}`,
      providesTags: (_result, _error, id) => [{ type: "bankDeposit", id }],
    }),
    addBankDeposit: builder.mutation({
      query: (data) => ({
        url: "/bank-deposit/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["bankDeposit"],
    }),
    updateBankDeposit: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/bank-deposit/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "bankDeposit",
        { type: "bankDeposit", id },
      ],
    }),
    deleteBankDeposit: builder.mutation({
      query: (id) => ({
        url: `/bank-deposit/delete/${id}`,
        method: "DELETE",
        body: {},
      }),
      invalidatesTags: ["bankDeposit"],
    }),
  }),
});

export const {
  useGetBankDepositsQuery,
  useGetBankDepositByIdQuery,
  useAddBankDepositMutation,
  useUpdateBankDepositMutation,
  useDeleteBankDepositMutation,
} = bankDepositApi;
