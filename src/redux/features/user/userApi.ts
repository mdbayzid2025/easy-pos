import { baseApi } from "../../base/baseAPI";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query({
      query: () => `/users/${location.search}`,
      providesTags: ['user'],
    }),

    updateUser: build.mutation({
      query: (data) => {
        return {
          url: `/users/status/${data?.id}`,
          method: "PATCH",
          body: data
        }
      },
      invalidatesTags: ['user', 'admin', 'host'],
    }),
    deleteUser: build.mutation({
      query: (id) => {
        return {
          url: `/users/${id}`,
          method: "DELETE"
        }
      },
      invalidatesTags: ["user"]
    }),

    getSingleUser: build.query({
      query: (id) => `/user-managements/${id}`,
      providesTags: ['user'],
      transformResponse: (response: { data: any }) => response.data,
    }),

    getProfile: build.query({
      query: () => `/users/profile`,
      providesTags: ['profile'],
      transformResponse: (response: { data: any }) => response.data,
    }),
    getLoggedInAdminData: build.query({
      query: (selectQuery = "name username email role readOnly permissions profileImg") =>
        `/admin/logged-in-admin-data?select=${encodeURIComponent(selectQuery)}`,
      providesTags: ['profile', 'admin'],
      transformResponse: (response: { data: any }) => response?.data,
    }),
    updateLoggedInAdmin: build.mutation({
      query: (data) => ({
        url: "/admin/update-logged-in-admin",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['profile', 'admin'],
    }),
    uploadSingleImage: build.mutation({
      query: (file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        return {
          url: "/upload/single-image",
          method: "POST",
          body: formData,
        };
      },
    }),
    editProfile: build.mutation({
      query: (data) => {
        return {
          url: '/users',
          method: "PATCH",
          body: data,
        }
      },
      invalidatesTags: ['profile'],
    }),

    // ------------ Admin -----------------
    createAdmin: build.mutation({
      query: (data) => {
        return {
          url: "/users/create-admin",
          method: "POST",
          body: data
        }
      },
      invalidatesTags: ['user', 'admin'],
    }),

    getAdmin: build.query({
      query: (body) => ({
        url: "/admin/all-admins",
        method: "POST",
        body: body ?? {
          pagination: {
            pageSize: 10,
            currentPage: 0,
          },
          filter: null,
          select: {
            name: 1,
            username: 1,
            phoneNo: 1,
            profileImg: 1,
            role: 1,
            permissions: 1,
            addedBy: 1,
            pages: 1,
            createdAt: 1,
          },
          sort: {
            createdAt: -1,
          },
        },
      }),
      providesTags: ['admin'],
    }),
    deleteAdmin: build.mutation({
      query: (id) => { return { url: `/users/admins/${id}`, method: "DELETE" } },
      invalidatesTags: ['admin'],

    }),




    getAllSubscriber: build.query({
      query: () => `/subscriptions${location?.search}`,
      transformResponse: (res: { data: any }) => res?.data
    }),

    getUsersGroupedByFloor: build.query({
      query: (buildingId: string) => `/user/get-users-grouped-by-floor/${buildingId}`,
      providesTags: ['user'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetAdminQuery,
  useGetProfileQuery,
  useGetLoggedInAdminDataQuery,
  useGetAllSubscriberQuery,
  useGetUsersGroupedByFloorQuery,
  useLazyGetUsersGroupedByFloorQuery,

  useDeleteAdminMutation,
  useGetSingleUserQuery,
  useDeleteUserMutation,
  useEditProfileMutation,
  useUpdateLoggedInAdminMutation,
  useUploadSingleImageMutation,
  useCreateAdminMutation,
  useUpdateUserMutation,
} = userApi;

