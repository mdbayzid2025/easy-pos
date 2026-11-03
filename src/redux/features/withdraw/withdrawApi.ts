import { baseApi } from "../../base/baseAPI";


const withdrawApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET all withdrawals
    getWithdrawals: build.query({
      query: () => `/withdrawal/admin${location?.search || ""}`,
      providesTags: ["withdrawal"],
      transformResponse: (res: { data: any }) => res.data,
    }),

    // GET single withdrawal by id
    getWithdrawalById: build.query({
      query: (id) => `/withdrawals/${id}`,
      providesTags: ["withdrawal"],
      transformResponse: (res: { data: any }) => res.data,
    }),

    // UPDATE withdrawal status
    approvedWithdrawalRequest: build.mutation({
      query: (data) => ({
        url: `/withdrawal/approve/${data.id}`,
        method: "PUT",        
      }),
      invalidatesTags: ["withdrawal"],
    }),
    
    // UPDATE withdrawal status
    rejectWithdrawalRequest: build.mutation({
      query: (data) => ({
        url: `/withdrawal/reject/${data.id}`,
        method: "PUT",        
      }),
      invalidatesTags: ["withdrawal"],
    }),
  }),
});

export const {
  useGetWithdrawalsQuery,
  useGetWithdrawalByIdQuery,  
  useApprovedWithdrawalRequestMutation,
  useRejectWithdrawalRequestMutation,
} = withdrawApi;