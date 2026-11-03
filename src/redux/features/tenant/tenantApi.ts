import { baseApi } from "../../base/baseAPI";

export const initialTenantQueryPayload = {
  pagination: {
    pageSize: 100,
    currentPage: 0,
  },
  filter: null,
  select: {
    name: 1,
    phoneNo: 1,
    username: 1,
    email: 1,
    fatherName: 1,
    motherName: 1,
    nidNo: 1,
    maritalStatus: 1,
    profileImg: 1,
    hasAccess: 1,
    role: 1,
    building: 1,
    floor: 1,
    unit: 1,
    emergencyContact: 1,
    familyMembers: 1,
    permanentAddress: 1,
    documents: 1,
    status: 1,
    createdAt: 1,
    updatedAt: 1,
  },
  sort: {
    createdAt: -1,
  },
};

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create / Signup Tenant (user/signup)
    signupTenant: builder.mutation({
      query: (body) => ({
        url: "/user/signup",
        method: "POST",
        body: {
          ...body,
          role: body.role || "user",
          username: body.username || body.phoneNo,
        },
      }),
      invalidatesTags: ["tenant", "user"],
    }),

    // Get All Tenants (POST user/get-all-tenants)
    getTenants: builder.mutation({
      query: (body) => {
        const search = body?.search || body?.q;
        const queryParams = search ? `?q=${encodeURIComponent(search)}` : "";
        return {
          url: `/user/get-all-tenants${queryParams}`,
          method: "POST",
          body: body ?? initialTenantQueryPayload,
        };
      },
      invalidatesTags: ["tenant"],
    }),

    // Get Tenant Details (GET user/get-by/:id)
    getTenantById: builder.query({
      query: (id) => `/user/get-by/${id}`,
      providesTags: ["tenant"],
    }),

    // Update Tenant (PUT user/update/:id)
    updateTenantById: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/update-data/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["tenant", "user"],
    }),

    // Delete Tenant (DELETE user/delete-data/:id)
    deleteTenantById: builder.mutation({
      query: (id) => ({
        url: `/user/delete-data/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tenant", "user"],
    }),
  }),
});

export const {
  useSignupTenantMutation,
  useGetTenantsMutation,
  useGetTenantByIdQuery,
  useUpdateTenantByIdMutation,
  useDeleteTenantByIdMutation,
} = tenantApi;
