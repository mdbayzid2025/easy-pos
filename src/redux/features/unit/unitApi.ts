import { baseApi } from "../../base/baseAPI";

export const initialUnitQueryPayload = {
  pagination: {
    pageSize: 100,
    currentPage: 1,
  },
  filter: null,
  select: {
    floor: 1,
    building: 1,
    unitNo: 1,
    baseFare: 1,
    utilityBill: 1,
    waterBill: 1,
    gasBill: 1,
    liftBill: 1,
    garageBill: 1,
    dueBill: 1,
    status: 1,
    isOccupied: 1,
    details: 1,
    isDelete: 1,
    createdAt: 1,
    updatedAt: 1,
  },
  sort: {
    floor: -1,
  },
};

export const unitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUnits: builder.mutation({
      query: (body) => ({
        url: "/unit/get-all",
        method: "POST",
        body: body ?? initialUnitQueryPayload,
      }),
      invalidatesTags: ["unit"],
    }),

    getUnitById: builder.query({
      query: (id) => ({
        url: `/unit/get-by/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "unit", id }],
    }),

    addUnit: builder.mutation({
      query: (data) => ({
        url: "/unit/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["unit", "building", "floor"],
    }),

    updateUnitById: builder.mutation({
      query: ({ id, data, ...rest }) => ({
        url: `/unit/update/${id}`,
        method: "PUT",
        body: data ?? rest,
      }),
      invalidatesTags: ["unit", "building", "floor"],
    }),

    deleteUnitById: builder.mutation({
      query: (id) => ({
        url: `/unit/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["unit", "building", "floor"],
    }),

    checkoutTenant: builder.mutation({
      query: ({ id, tenantId }) => ({
        url: `/unit/checkout-tenant/${id}`,
        method: "PUT",
        body: { tenantId },
      }),
      invalidatesTags: ["unit", "building", "floor", "tenant", "user"],
    }),
  }),
});

export const {
  useGetUnitsMutation,
  useGetUnitByIdQuery,
  useAddUnitMutation,
  useUpdateUnitByIdMutation,
  useDeleteUnitByIdMutation,
  useCheckoutTenantMutation,
} = unitApi;
