import { baseApi } from "../../base/baseAPI";

export const initialManagementQueryPayload = {
  pagination: {
    pageSize: 10,
    currentPage: 0,
  },
  filter: null,
  select: {
    name: 1,
    role: 1,
    mobile: 1,
    isDelete: 1,
    building: 1,
    createdAt: 1,
    updatedAt: 1,
  },
  sort: {
    createdAt: -1,
  },
};

export const managementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManagements: builder.query({
      query: (body) => ({
        url: "/management/get-all",
        method: "POST",
        body: body ?? initialManagementQueryPayload,
      }),
      providesTags: ["management"],
    }),
    getManagementById: builder.query({
      query: (id) => ({
        url: `/management/get-by/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "management", id }],
    }),
    addManagement: builder.mutation({
      query: (data) => ({
        url: "/management/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["management"],
    }),
    updateManagementById: builder.mutation({
      query: ({ id, data }) => ({
        url: `/management/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["management"],
    }),
    deleteManagementById: builder.mutation({
      query: (id) => ({
        url: `/management/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["management"],
    }),
  }),
});

export const {
  useGetManagementsQuery,
  useGetManagementByIdQuery,
  useAddManagementMutation,
  useUpdateManagementByIdMutation,
  useDeleteManagementByIdMutation,
} = managementApi;
