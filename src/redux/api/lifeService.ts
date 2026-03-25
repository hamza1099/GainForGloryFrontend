import { baseApi } from "./baseApi";

const LiveServiceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ==============================
    // Get all live services (Pagination)
    // GET /liveService?page=&limit=
    // ==============================
    getAllLiveServices: build.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/liveService?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["liveService"],
    }),
    // ==============================
    // Create live service (ADMIN)
    // POST /liveService/create
    // ==============================
    createLiveService: build.mutation({
      query: (payload) => ({
        url: `/liveService/create`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["liveService"],
    }),

    // ==============================
    // Update live service (ADMIN)
    // PUT /liveService/:id
    // ==============================
    updateLiveService: build.mutation({
      query: ({ id, data }) => ({
        url: `/liveService/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["liveService"],
    }),

    // ==============================
    // Delete live service (ADMIN)
    // DELETE /liveService/:id
    // ==============================
    deleteLiveService: build.mutation({
      query: (id: string) => ({
        url: `/liveService/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["liveService"],
    }),
  }),
});

export const {
  useGetAllLiveServicesQuery,
  useCreateLiveServiceMutation,
  useUpdateLiveServiceMutation,
  useDeleteLiveServiceMutation,
} = LiveServiceApi;

export default LiveServiceApi;