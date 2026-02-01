import { baseApi } from "./baseApi";

const VideoCallApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // 1. Get Call Ended Status
    // GET /session/callEnded?sessionId=...
    getCallEnded: build.mutation<any, { sessionId: string }>({
      query: ({ sessionId }) => ({
        // Template literal use karein taaki sessionId variable fetch ho sake
        url: `/session/callEnded?sessionId=${sessionId}`,
        method: "GET",
      }),
    }),
    // 2. Get Previous Sessions by User ID
    // GET /session/previousSessions?userId=...
    getPreviousSessions: build.query<any, string>({
      query: (userId) => ({
        url: `/session/previousSessions?userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["trainer"], // Ya jo bhi tag sessions ke liye relevant ho
    }),

    // 3. Save Session Notes
    // POST /session/saveNotes
    saveSessionNotes: build.mutation<any, { sessionId: string; notes: string }>(
      {
        query: (payload) => ({
          url: `/session/saveNotes`,
          method: "POST",
          body: payload,
        }),
      },
    ),

    // 4. Join Call
    // POST /session/joinCall
    joinCall: build.mutation<any, { userId: number | string }>({
      query: (payload) => ({
        url: `/session/joinCall`,
        method: "POST",
        body: payload,
      }),
    }),

    // 5. Leave/End Call (Jo humne pehle banaya tha)
    leaveCall: build.mutation<any, { sessionId: string }>({
      query: (payload) => ({
        url: `/session/leaveCall`,
        method: "POST",
        body: payload,
      }),
    }),

        // 6. Heart beat Call (Jo humne pehle banaya tha)
    heartBeatCall: build.mutation<any, { sessionId: string }>({
      query: (payload) => ({
        url: `/session/heartbeat`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetCallEndedMutation,
  useGetPreviousSessionsQuery,
  useSaveSessionNotesMutation,
  useJoinCallMutation,
  useLeaveCallMutation,
  useHeartBeatCallMutation,

} = VideoCallApi;

export default VideoCallApi;
