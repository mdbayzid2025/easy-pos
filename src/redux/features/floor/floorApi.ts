import { baseApi } from "../../base/baseAPI";

export const initialFloorQueryPayload = {
  pagination: {
    pageSize: 100,
    currentPage: 1,
  },
  filter: null,
  select: {
    floorNo: 1,
    building: 1,
    isDelete: 1,
    createdAt: 1,
    updatedAt: 1,
  },
  sort: {
    createdAt: -1,
  },
};

export const floorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFloors: builder.mutation({
      query: (body) => ({
        url: "/floor/get-all",
        method: "POST",
        body: body ?? initialFloorQueryPayload,
      }),
    }),

    getFloorById: builder.query({
      query: (id) => ({
        url: `/floor/get-by/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "floor", id }],
    }),

    addFloor: builder.mutation({
      query: (data) => ({
        url: "/floor/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["floor", "building"],
    }),

    updateFloorById: builder.mutation({
      query: ({ id, data, ...rest }) => ({
        url: `/floor/update/${id}`,
        method: "PUT",
        body: data ?? rest,
      }),
      invalidatesTags: ["floor", "building"],
    }),

    deleteFloorById: builder.mutation({
      query: (id) => ({
        url: `/floor/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["floor", "building"],
    }),

    deleteMultipleFloors: builder.mutation({
      query: (ids: string[]) => ({
        url: "/floor/delete-multiple",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: ["floor", "building"],
    }),
  }),
});

export const {
  useGetFloorsMutation,
  useGetFloorByIdQuery,
  useAddFloorMutation,
  useUpdateFloorByIdMutation,
  useDeleteFloorByIdMutation,
  useDeleteMultipleFloorsMutation,
} = floorApi;

// Compatibility aliases
export const useUpdateFloorMutation = useUpdateFloorByIdMutation;
export const useDeleteFloorMutation = useDeleteFloorByIdMutation;
