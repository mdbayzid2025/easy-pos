import { baseApi } from "../../base/baseAPI";

export const buildingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBuildings: builder.query({
      query: (body) => ({
        url: "/building/get-all",
        method: "POST",
        body: body ?? {
          pagination: {
            pageSize: 10,
            currentPage: 1,
          },
          filter: null,
          select: {
            name: 1,
            address: 1,
            totalUnit: 1,
            isParking: 1,
            isLift: 1,
            isGenerator: 1,
            emergencyContact: 1,
            phoneNo: 1,
            status: 1,
            photo: 1,
            isDelete: 1,
            createdAt: 1,
            updatedAt: 1,
          },
          sort: {
            createdAt: -1,
          },
        },
      }),
      providesTags: ["building"],
    }),
    getBuildingById: builder.query({
      query: (id) => ({
        url: `/building/get-by/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "building", id }],
    }),
    addBuilding: builder.mutation({
      query: (data) => ({
        url: "/building/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["building"],
    }),
    updateBuilding: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/building/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["building"],
    }),
    deleteBuilding: builder.mutation({
      query: (id) => ({
        url: `/building/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["building"],
    }),
  }),
});

export const {
  useGetBuildingsQuery,
  useGetBuildingByIdQuery,
  useAddBuildingMutation,
  useUpdateBuildingMutation,
  useDeleteBuildingMutation,
} = buildingApi;
