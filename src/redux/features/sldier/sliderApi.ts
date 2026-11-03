import { baseApi } from "../../base/baseAPI";

const sliderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // CREATE slider
    addSlider: build.mutation({
      query: (data) => ({
        url: "/sliders/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["slider"],
    }),

    // GET all sliders (admin)
    getSliders: build.query({
      query: () => `/sliders`,
      providesTags: ["slider"],
      transformResponse: (res: { data: any }) => res.data,
    }),

    // GET single slider by id
    getSliderById: build.query({
      query: (id) => `/sliders/${id}`,
      providesTags: ["slider"],
      transformResponse: (res: { data: any }) => res.data,
    }),

    // UPDATE slider
    updateSlider: build.mutation({
      query: (data) => ({
        url: `/sliders/update/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["slider"],
    }),

    // DELETE slider
    deleteSlider: build.mutation({
      query: (id) => ({
        url: `/sliders/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["slider"],
    }),
  }),
});

export const {
  useGetSlidersQuery,
  useGetSliderByIdQuery,
  useAddSliderMutation,
  useUpdateSliderMutation,
  useDeleteSliderMutation,
} = sliderApi;

export default sliderApi;