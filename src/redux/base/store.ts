import { configureStore } from "@reduxjs/toolkit";
import { baseReducer } from "./baseReducer";
import { baseApi } from "./baseAPI";

export const store = configureStore({
    reducer: baseReducer,
    middleware: (getDefaultMiddleware)=> getDefaultMiddleware().concat(baseApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type ApiDispatch = typeof store.dispatch;