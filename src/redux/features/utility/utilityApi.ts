import { baseApi } from "../../base/baseAPI";

export const initialUtilityQueryPayload = {
  pagination: {
    pageSize: 10,
    currentPage: 1,
  },
  filter: null,
  select: {
    electricityBill: 1,
    waterBill: 1,
    gasBill: 1,
    liftBill: 1,
    garageBill: 1,
    isDelete: 1,
    createdAt: 1,
    updatedAt: 1,
  },
  sort: {
    createdAt: -1,
  },
};

export const utilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUtilities: builder.query({
      query: (body) => ({
        url: "/utility/get-all",
        method: "POST",
        body: body ?? initialUtilityQueryPayload,
      }),
      providesTags: ["utility"],
    }),

    getUtilitiesMutation: builder.mutation({
      query: (body) => ({
        url: "/utility/get-all",
        method: "POST",
        body: body ?? initialUtilityQueryPayload,
      }),
    }),

    getUtilityById: builder.query({
      query: (id) => ({
        url: `/utility/get-by/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "utility", id }],
    }),

    addUtility: builder.mutation({
      query: (data) => ({
        url: "/utility/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["utility"],
    }),

    updateUtilityById: builder.mutation({
      query: ({ id, data }) => ({
        url: `/utility/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["utility"],
    }),

    deleteUtilityById: builder.mutation({
      query: (id) => ({
        url: `/utility/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["utility"],
    }),

    deleteMultipleUtilities: builder.mutation({
      query: (ids: string[]) => ({
        url: "/utility/delete-multiple",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: ["utility"],
    }),
  }),
});

export const {
  useGetUtilitiesQuery,
  useGetUtilitiesMutationMutation,
  useGetUtilityByIdQuery,
  useAddUtilityMutation,
  useUpdateUtilityByIdMutation,
  useDeleteUtilityByIdMutation,
  useDeleteMultipleUtilitiesMutation,
} = utilityApi;
