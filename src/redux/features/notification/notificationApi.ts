import { baseApi } from "../../base/baseAPI";

const notificationApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getNotifications: build.query({
            query: () => `/notifications/admin${location?.search}`,
            providesTags: ['notifications'],            
        }),
        getNotificationsCount: build.query({
            query: () => `/notifications/admin${location?.search}`,
            transformResponse: (response: { meta: any }) => response?.meta?.unreadCount,
            providesTags: ['notifications'],            
        }),
        getRecentActivities: build.query({
            query: () => `/notifications/admin/recent${location?.search}`,
            providesTags: ['notifications'],            
        }),

        notificationCount: build.query({
            query: () => `/notifications${location?.search}`,
            providesTags: ['notifications'],
            transformResponse: (response: { data: any }) => response?.data?.unreadCount,
        }),

        readAllNotification: build.mutation({
            query: () => ({
                url: `/notifications/admin`,
                method: "PATCH",
            }),
            invalidatesTags: ['notifications']
        })
    })
})

export const { useGetNotificationsQuery, useGetRecentActivitiesQuery, useGetNotificationsCountQuery, useNotificationCountQuery, useReadAllNotificationMutation } = notificationApi;