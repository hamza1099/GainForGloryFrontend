import { baseApi } from "./baseApi";

const biblePlan = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ==============================
    // Get all bible plans (PAGINATED)
    // GET /bible-plans/all?page=&limit=
    // ==============================
    getBiblePlans: build.query({
      query: ({ page, limit }) => ({
        url: `/bible-plans/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["biblePlan"],
    }),

    // ==============================
    // Get single bible plan details by ID
    // GET /bible-plans/:id
    // ==============================
    getBiblePlanById: build.query({
      query: (id: string) => ({
        url: `/bible-plans/${id}`,
        method: "GET",
      }),
      providesTags: ["biblePlan"],
    }),

    // ==============================
    // Create bible plan (ADMIN)
    // POST /bible-plans/create
    // Note: Use FormData for image upload
    // ==============================
    createBiblePlan: build.mutation({
      query: (payload) => ({
        url: `/bible-plans/create`,
        method: "POST",
        body: payload, // Send as FormData
      }),
      invalidatesTags: ["biblePlan"],
    }),

    // ==============================
    // Update bible plan (ADMIN)
    // PUT /bible-plans/update/:id
    // ==============================
    updateBiblePlan: build.mutation({
      query: ({ id, data }) => ({
        url: `/bible-plans/update/${id}`,
        method: "PUT",
        body: data, // Send as FormData if image is included
      }),
      invalidatesTags: ["biblePlan"],
    }),

    // ==============================
    // Update Featured Image (ADMIN)
    // PUT /bible-plans/updateFeatured/:id
    // ==============================
    updateFeaturedBiblePlan: build.mutation({
      query: ({ id, data }) => ({
        url: `/bible-plans/updateFeatured/${id}`,
        method: "PUT",
        body: data, // Send as FormData (contains featured image)
      }),
      invalidatesTags: ["biblePlan"],
    }),

    // ==============================
    // Delete bible plan (ADMIN)
    // DELETE /bible-plans/delete/:id
    // ==============================
    deleteBiblePlan: build.mutation({
      query: (id: string) => ({
        url: `/bible-plans/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["biblePlan"],
    }),

    // ==============================
    // Delete specific plan day (ADMIN)
    // DELETE /bible-plans/deletePlanDay/:id
    // ==============================
    deleteBiblePlanDay: build.mutation({
      query: (id: string) => ({
        url: `/bible-plans/deletePlanDay/${id}`,
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