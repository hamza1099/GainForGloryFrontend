// src/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// Utility function to handle the base API URL
const baseApiHandler = () => {
  // const apiUrl = "http://82.180.161.133:6032/api/v1";
  const apiUrl = "https://api.nazir.info/api/v1";
  // const apiUrl = "http://localhost:6032/api/v1";

  return apiUrl;
};

export const imgBaseUrl = "https://api.nazir.info/api/v1";
// staging
export const AgoraAppId = "6d30eac0cdda40978f14c634d0ca8561";
export const AgoraAppKey = "1029e3311bca450a80f66af9044ec8ab";

// Define the base API using RTK Query   v
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseApiHandler(),
    prepareHeaders: (headers) => {
      // const token = (getState() as RootState).auth.token;
      const token = Cookies.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "service",
    "booking",
    // new
    "user",
    "dashboard",
    "product",
    "order",
    "trainer",
  ],
});
