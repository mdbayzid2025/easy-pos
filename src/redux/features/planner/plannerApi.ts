import { baseApi } from "../../base/baseAPI";

const plannerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // CREATE planner
    addPlanner: build.mutation({
      query: (data) => ({
        url: "/home-campaign-planners/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["planner"],
    }),

    // GET all planners
    getPlanners: build.query({
      query: () => `/home-campaign-planners${location?.search || ""}`,
      providesTags: ["planner"],
      transformResponse: (res: { data: any }) => res.data,
    }),

    // GET single planner by id
    getPlannerById: build.query({
      query: (id) => `/home-campaign-planners/${id}`,
      providesTags: ["planner"],
      transformResponse: (res: { data: any }) => res.data,
    }),

    // UPDATE planner
    updatePlanner: build.mutation({
      query: (data) => ({
        url: `/home-campaign-planners/update/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["planner"],
    }),

    // DELETE planner
    deletePlanner: build.mutation({
      query: (id) => ({
        url: `/home-campaign-planners/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["planner"],
    }),
  }),
});

export const {
  useGetPlannersQuery,
  useGetPlannerByIdQuery,
  useAddPlannerMutation,
  useUpdatePlannerMutation,
  useDeletePlannerMutation,
} = plannerApi;