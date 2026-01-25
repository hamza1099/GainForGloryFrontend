import { baseApi } from "./baseApi";

const TrainerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ==============================
    // Get all trainers (ADMIN)
    // GET /trainer?page=&limit=
    // ==============================
    getAllTrainers: build.query({
      query: ({ page, limit }) => ({
        url: `/trainers?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["trainer"],
    }),

    // ==============================
    // Get trainer detail by ID (ADMIN)
    // GET /trainer/trainerDetail/:id
    // ==============================
    getTrainerDetail: build.query({
      query: (id: string) => ({
        url: `/trainers/trainerDetail/${id}`,
        method: "GET",
      }),
      providesTags: ["trainer"],
    }),

    // ==============================
    // Create trainer (ADMIN)
    // POST /trainer/create
    // ==============================
    createTrainer: build.mutation({
      query: (payload) => ({
        url: `/trainers/create`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["trainer"],
    }),

    // ==============================
    // Update trainer (ADMIN)
    // PUT /trainer/update/:id
    // ==============================
    updateTrainer: build.mutation({
      query: ({ id, data }) => ({
        url: `/trainers/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["trainer"],
    }),

    // ==============================
    // Delete trainer (ADMIN)
    // DELETE /trainer/delete/:id
    // ==============================
    deleteTrainer: build.mutation({
      query: (id: string) => ({
        url: `/trainers/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["trainer"],
    }),

    // ==============================
    // Assign trainer to user (ADMIN)
    // POST /trainer/assign
    // ==============================
    assignTrainer: build.mutation({
      query: (payload) => ({
        url: `/trainers/assign`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["trainer"],
    }),

    // ==============================
    // Remove trainer from user (ADMIN)
    // POST /trainer/remove
    // ==============================
    removeTrainer: build.mutation({
      query: (payload) => ({
        url: `/trainers/remove`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["trainer"],
    }),
    // ==============================
    // Update trainer status (ADMIN)
    // POST /trainerUpdateStatus/:id
    // ==============================
    updateTrainerStatus: build.mutation<
      any,
      { id: string; status: "PENDING" | "ACTIVE" | "BLOCKED" }
    >({
      query: ({ id, status }) => ({
        url: `/trainers/trainerUpdateStatus/${id}`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["trainer"],
    }),
  }),
});

export const {
  useGetAllTrainersQuery,
  useGetTrainerDetailQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
  useAssignTrainerMutation,
  useRemoveTrainerMutation,
  useUpdateTrainerStatusMutation,
} = TrainerApi;

export default TrainerApi;
