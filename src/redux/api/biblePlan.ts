import { baseApi } from "./baseApi";

const biblePlan = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ==============================
    // Get all bible plans (PAGINATED)
    // GET /biblePlan/all?page=&limit=
    // ==============================
    getBiblePlans: build.query({
      query: ({ page, limit }) => ({
        url: `/biblePlan/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["biblePlan"],
    }),

    // ==============================
    // Get single bible plan details by ID
    // GET /biblePlan/:id
    // ==============================
    getBiblePlanById: build.query({
      query: (id: string) => ({
        url: `/biblePlan/${id}`,
        method: "GET",
      }),
      providesTags: ["biblePlan"],
    }),

    // ==============================
    // Create bible plan (ADMIN)
    // POST /biblePlan/create
    // Note: Use FormData for image upload
    // ==============================
    createBiblePlan: build.mutation({
      query: (payload) => ({
        url: `/biblePlan/create`,
        method: "POST",
        body: payload, // Send as FormData
      }),
      invalidatesTags: ["biblePlan"],
    }),

    // ==============================
    // Update bible plan (ADMIN)
    // PUT /biblePlan/update/:id
    // ==============================
    updateBiblePlan: build.mutation({
      query: ({ id, data }) => ({
        url: `/biblePlan/update/${id}`,
        method: "PUT",
        body: data, // Send as FormData if image is included
      }),
      invalidatesTags: ["biblePlan"],
    }),

    // ==============================
    // Update Featured Image (ADMIN)
    // PUT /biblePlan/updateFeatured/:id
    // ==============================
    updateFeaturedBiblePlan: build.mutation({
      query: ({ id, data }) => ({
        url: `/biblePlan/updateFeatured/${id}`,
        method: "PUT",
        body: data, // Send as FormData (contains featured image)
      }),
      invalidatesTags: ["biblePlan"],
    }),

    // ==============================
    // Delete bible plan (ADMIN)
    // DELETE /biblePlan/delete/:id
    // ==============================
    deleteBiblePlan: build.mutation({
      query: (id: string) => ({
        url: `/biblePlan/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["biblePlan"],
    }),

    // ==============================
    // Delete specific plan day (ADMIN)
    // DELETE /biblePlan/deletePlanDay/:id
    // ==============================
    deleteBiblePlanDay: build.mutation({
      query: (id: string) => ({
        url: `/biblePlan/deletePlanDay/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["biblePlan"],
    }),
  }),
});

export const {
  useGetBiblePlansQuery,
  useGetBiblePlanByIdQuery,
  useCreateBiblePlanMutation,
  useUpdateBiblePlanMutation,
  useUpdateFeaturedBiblePlanMutation,
  useDeleteBiblePlanMutation,
  useDeleteBiblePlanDayMutation,
} = biblePlan;

export default biblePlan;