import { baseApi } from "../../base/baseAPI";

const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder)=>({
        getAnalytics:  builder.query({
            query: ()=>`/analytics/stat-counts${location?.search}`,
            transformResponse: (res: {data: any})=> res?.data,
        }),
        getUsersGrowth:  builder.query({
            query: ()=>`/analytics/admin-user-growth-chart${location?.search}`,
            transformResponse: (res: {data: any})=> res?.data,
        }),
        getOverView: builder.query({
            query: ()=>`/analytics/overview${location?.search}`,
            transformResponse: (res: {data: any})=> res?.data
        }),
        getRevenueGrowth: builder.query({
            query: (year)=>`/analytics/yearly-revenue-chart?year=${year}`,
            transformResponse: (res: {data: any})=> res?.data
        }),
        getBookingUsersGrowth: builder.query({
            query: (year)=>`/analytics/yearly-booking-user-chart?year=${year}`,
            transformResponse: (res: {data: any})=> res?.data
        }),
        getAdminDashboard: builder.query({
            query: (params?: { month?: string | number; year?: string | number }) => {
                const queryParts: string[] = [];
                if (params?.month && params.month !== 'ALL') queryParts.push(`month=${params.month}`);
                if (params?.year && params.year !== 'ALL') queryParts.push(`year=${params.year}`);
                const qs = queryParts.length ? `?${queryParts.join('&')}` : '';
                return `/dashboard/admin-dashboard${qs}`;
            },
            transformResponse: (res: { data: any }) => res?.data,
            providesTags: ["building", "unit", "income", "expense", "tenant", "bankDeposit"],
        }),
        getIncomeChart: builder.query({
            query: (year?: number) => `/dashboard/income-chart?year=${year || new Date().getFullYear()}`,
            transformResponse: (res: { data: any }) => res?.data,
            providesTags: ["income"],
        }),
        getExpenseChart: builder.query({
            query: (year?: number) => `/dashboard/expense-chart?year=${year || new Date().getFullYear()}`,
            transformResponse: (res: { data: any }) => res?.data,
            providesTags: ["expense"],
        }),
        getBankDepositChart: builder.query({
            query: (year?: number) => `/dashboard/deposit-chart?year=${year || new Date().getFullYear()}`,
            transformResponse: (res: { data: any }) => res?.data,
            providesTags: ["bankDeposit"],
        }),
    })
})

export const {
    useGetAnalyticsQuery,
    useGetUsersGrowthQuery,
    useGetOverViewQuery,
    useGetRevenueGrowthQuery,
    useGetBookingUsersGrowthQuery,
    useGetAdminDashboardQuery,
    useGetIncomeChartQuery,
    useGetExpenseChartQuery,
    useGetBankDepositChartQuery,
} = dashboardApi;