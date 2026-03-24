import { baseApi } from "./baseApi";

const LifeGroupApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ==============================
    // Create LifeGroup (form-data)
    // POST /lifegroup/create
    // ==============================
    createLifeGroup: build.mutation({
      query: (formData: FormData) => ({
        url: `/lifegroup/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["lifegroup"],
    }),

    // ==============================
    // Get all LifeGroups
    // GET /lifegroup/
    // ==============================
    getAllLifeGroups: build.query({
      query: () => ({
        url: `/lifegroup/`,
        method: "GET",
      }),
      providesTags: ["lifegroup"],
    }),

    // ==============================
    // Get LifeGroups for a user
    // GET /lifegroup/user
    // ==============================
    getUserLifeGroups: build.query({
      query: () => ({
        url: `/lifegroup/user`,
        method: "GET",
      }),
      providesTags: ["lifegroup"],
    }),

    // ==============================
    // Delete LifeGroup
    // DELETE /lifegroup/delete/:id
    // ==============================
    deleteLifeGroup: build.mutation({
      query: (id: string) => ({
        url: `/lifegroup/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["lifegroup"],
    }),

    // ==============================
    // Update LifeGroup (form-data)
    // PUT /lifegroup/update/:id
    // ==============================
    updateLifeGroup: build.mutation({
      query: ({ id, formData }: { id: string; formData: FormData }) => ({
        url: `/lifegroup/update/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["lifegroup"],
    }),

    // ==============================
    // Join LifeGroup
    // POST /lifegroup/join
    // ==============================
    joinLifeGroup: build.mutation({
      query: (payload: any) => ({
        url: `/lifegroup/join`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["lifegroup"],
    }),

    // ==============================
    // Update LifeGroup Member Status
    // POST /lifegroup/member/status
    // ==============================
    updateMemberStatus: build.mutation({
      query: (payload: any) => ({
        url: `/lifegroup/member/status`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["lifegroup"],
    }),

    // ==============================
    // Get LifeGroup members with pagination
    // GET /lifegroup/lifeMembers/:id?page=&limit=
    // ==============================
    getLifeGroupMembers: build.query({
      query: ({ id, page, limit }: { id: string; page: number; limit: number }) => ({
        url: `/lifegroup/lifeMembers/${id}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["lifegroup"],
    }),
  }),
});

export const {
  useCreateLifeGroupMutation,
  useGetAllLifeGroupsQuery,
  useGetUserLifeGroupsQuery,
  useDeleteLifeGroupMutation,
  useUpdateLifeGroupMutation,
  useJoinLifeGroupMutation,
  useUpdateMemberStatusMutation,
  useGetLifeGroupMembersQuery,
} = LifeGroupApi;

export default LifeGroupApi;