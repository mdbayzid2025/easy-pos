import { baseApi } from "../base/baseAPI";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
      // CREATE category
    addCategory: build.mutation({
      query: (data) => ({
        url: "/categories/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    getCategories: build.query({
      query: () => `/categories/for-admin${location?.search || ""}`,
      providesTags: ["category"],
      transformResponse: (res: { data: any }) => res.data,
    }),

    // GET single category by id
    getCategoryById: build.query({
      query: (id) => `/category/${id}`,
      providesTags: ["category"],
      transformResponse: (res: { data: any }) => res.data,
    }),

  

    // UPDATE category
    updateCategory: build.mutation({
      query: (data) => ({
        url: `/categories/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    // DELETE category
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
