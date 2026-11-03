import { baseApi } from "../../base/baseAPI";

const packagesApi = baseApi.injectEndpoints({
    endpoints: build=>({
        getPackages: build.query({
            query: ()=>`/packages`,
            transformResponse: (res: {data: any})=>res?.data
        }),
        addPackage: build.mutation({
            query: (data: any)=>({
                url: `/packages`,
                method: 'POST',
                body: data
            }),
            transformResponse: (res: {data: any})=>res?.data
        }),
        updatePackage: build.mutation({
            query: ({id, data}: {id: string, data: any})=>({
                url: `/packages/${id}`,                
                method: 'PATCH',
                body: data
            }),
            transformResponse: (res: {data: any})=>res?.data
        }),
        deletePackage: build.mutation({
            query: (id: string)=>({
                url: `/packages/${id}`,
                method: 'DELETE',
        })
        }),        
    })
})


export const {
    useGetPackagesQuery,
    useAddPackageMutation,
    useUpdatePackageMutation,
    useDeletePackageMutation
} = packagesApi;