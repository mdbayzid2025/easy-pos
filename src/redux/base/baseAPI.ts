// import { createApi } from "@reduxjs/toolkit/query/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    // credentials: "include",
  }),
  endpoints: () => ({}),
  tagTypes: [
    "user",
    "notifications",
    "admin",
    "category",
    "slider",
    "faqs",
    "withdrawal",
    "planner",
    "cars",
    "host",
    "booking",
    "profile",
    "rules",
    "commission",
    "building",
    "floor",
    "expense",
    "expenseCategory",
    "management",
    "utility",
    "floor",
    "unit",
    "tenant",
    "income",
    "bankDeposit",
    "openingBalance",
  ],
});

export const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;
