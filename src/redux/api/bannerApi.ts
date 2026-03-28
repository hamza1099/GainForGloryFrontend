import { baseApi } from "./baseApi";

const BannerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ==============================
    // Get all banners
    // GET /banner
    // ==============================
    getAllBanners: build.query({
      query: () => ({
        url: "/banner/all",
        method: "GET",
      }),
      providesTags: ["banner"],
    }),

    // ==============================
    // Create banner
    // POST /banner/create
    // ==============================
    createBanner: build.mutation({
      query: (formData: FormData) => ({
        url: "/banner/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["banner"],
    }),

    // ==============================
    // Delete banner by ID
    // DELETE /banner/delete/:id
    // ==============================
    deleteBanner: build.mutation({
      query: (id: string | number) => ({
        url: `/banner/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banner"],
    }),
  }),
});

export const {
  useGetAllBannersQuery,
  useCreateBannerMutation,
  useDeleteBannerMutation,
} = BannerApi;

export default BannerApi;