"use client";
import React, { useEffect, useRef, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
} from "agora-rtc-react";

import Cookies from "js-cookie";
import VideoCalling from "./VideoCall";
import { useParams } from "next/navigation";
import AppMessage from "@/constants/AppMessage";
import { AgoraAppId } from "@/redux/api/baseApi";
import {
  useGetCallEndedMutation,
  useGetPreviousSessionsQuery,
  useJoinCallMutation,
  useLeaveCallMutation,
  useSaveSessionNotesMutation,
} from "@/redux/api/VideoCallApi";
import { useGetMeQuery } from "@/redux/api/auth";
import RightSideBar from "./RightSideBar";

type RemoteUser = {
  uid: string;
  videoTrack?: IRemoteVideoTrack;
  audioTrack?: IRemoteAudioTrack;
  screenTrack?: IRemoteVideoTrack;
};
interface TutorProfile {
  id: number;
  title: string;
  rating: number;
  about: string;
  img: string;
  tags: string[] | null;
}
type StudentProfile = {
  userId: number;
  name: string;
  gender: string;
  email: string;
  dob: string;
  profile_pic_url: string;
  grade: {
    id: number;
    title: string;
  };
};

// Whether screen sharing is active
let isScreenSharing: boolean = false;

// Whether the remote user's video is turned on
let isRemoteVideoOn: boolean = false;

// Whether the remote user's audio is turned on
let isRemoteAudioOn: boolean = false;

// Stores the screen track (if screen sharing is active)
let _screenTrack: ILocalVideoTrack | null = null;

// Stores the local camera track
let _localCameraTrack: ILocalVideoTrack | null = null;

// Unique session ID, null if no session is active
let sessionId: number | null = null;

// Tracks whether the recording has started
// Used to ensure recording doesn't start multiple times
let recordingStarted: boolean = false;

const VideoCallScreen = () => {
  const _token = Cookies.get("token");

  const { id } = useParams() as { id: string };

  const { data: authData } = useGetMeQuery("");
  const trainerInfo = authData?.data;
  // Create a reference to store an array of remote users, initially set to an empty array.
  const remoteUsersRef = useRef<RemoteUser[]>([]);

  // States for tracking microphone and camera status
  const [micOn, setMic] = useState<boolean>(true);
  const [cameraOn, setCamera] = useState<boolean>(true);

  // States for tracking the connection and calling status
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [calling, setCalling] = useState<boolean>(false);

  // States for tracking remote users and their media tracks
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);

  // States for tracking local media tracks (microphone, camera, screen sharing)
  const [localMicrophoneTrack, setLocalMicrophoneTrack] =
    useState<ILocalAudioTrack | null>(null);
  const [localCameraTrack, setLocalCameraTrack] =
    useState<ILocalVideoTrack | null>(null);
  const [screenTrack, setScreenTrack] = useState<ILocalVideoTrack | null>(null);

  //concent modal states
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // State for managing UI and permission management
  const [showPermissionError, setShowPermissionError] =
    useState<boolean>(false);
  const [permissionsGranted, setPermissionsGranted] = useState({
    microphone: false,
    camera: false,
  });
  const [refrsh, setRefresh] = useState(false);

  // State for countdown (if required for call timer or other purposes)
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);
  const [countdownTime, setCountdownTime] = useState<number>(0);

  // State for managing toggle views (like switching between speaker view and gallery view)
  const [toggleView, setToggleView] = useState<boolean>(false);

  // State for managing errors and messages
  const [error, setError] = useState<string | null>("");
  const [msg, setMsg] = useState<string | null>("");

  // State for managing student and tutor profiles
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [studentsProfile, setStudentsProfile] = useState<StudentProfile[]>([]);

  // Reference to the Agora engine (RTC client)
  const agoraEngineRef = useRef<IAgoraRTCClient | null>(null);

  // States for remote video and audio
  const [remoteVideo, setRemoteVideo] = useState<boolean>(false);
  const [remoteAudio, setRemoteAudio] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);

  // State for session expiry time (time in milliseconds)
  const [sessionExpiryTime, setSessionExpiryTime] = useState<number | null>(
    null,
  );

  const [joinCall, { isLoading: iscalling }] = useJoinCallMutation();
  const [leaveCall, { isLoading: isleaving }] = useLeaveCallMutation();
  const [getCallEnded, { isLoading: isGetCallEnded }] =
    useGetCallEndedMutation();
  const {
    data,
    isLoading: PrevSessionLoader,
    refetch,
  } = useGetPreviousSessionsQuery(id);

  // Mutation hook
  const [saveSessionNotes, { isLoading, isSuccess, isError }] =
    useSaveSessionNotesMutation();

  // Update global screen and camera track references
  useEffect(() => {
    _screenTrack = screenTrack;
    _localCameraTrack = localCameraTrack;
  }, [screenTrack, localCameraTrack]);

  // Check for media permissions
  useEffect(() => {
    checkPermissions().then((hasPermission) => {
      if (hasPermission) {
        setHasPermissions(true);
      }
    });
  }, []);

  // Fetch Agora user info if token and permissions are available
  useEffect(() => {
    if (_token && hasPermissions) {
      agoraEngineRef.current = AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      });

      // Event listeners for Agora RTC client
      agoraEngineRef.current?.on("user-joined", handleUserPublished);

      agoraEngineRef.current?.on("user-left", handleUserUnpublished);

      // Event listener for remote user published
      agoraEngineRef.current?.on("user-published", handleUserPublished);

      agoraEngineRef.current?.on("user-unpublished", remoteUserUnpublished);

      fetchAgoraUserInfo();
      return () => {
        // Cleanup
        agoraEngineRef.current?.removeAllListeners();
      };
    }
  }, [_token, hasPermissions]);

  // It polls every 30 seconds to keep session Ending details updated
  useEffect(() => {
    if (isConnected) {
      getsessionEndingDetail();
      const intervalId = setInterval(getsessionEndingDetail, 30000);

      return () => clearInterval(intervalId);
    }
  }, [isConnected]);

  // If session expiry time is available, start the countdown
  useEffect(() => {
    if (sessionExpiryTime && sessionExpiryTime > 0) {
      const countdownInterval = setInterval(() => {
        setCountdownTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(countdownInterval);
            handleLeaveChannel(); // Call handleLeaveChannel when session expires
            return 0;
          }
          return prevTime - 60;
        });
      }, 60000);

      // If the countdown is below 5 minutes, show the countdown bar or message
      if (countdownTime <= 300 && countdownTime > 0) {
        setIsCountdownActive(true);
      } else {
        setIsCountdownActive(false);
      }

      return () => clearInterval(countdownInterval); // Cleanup on unmount
    }
  }, [sessionExpiryTime, countdownTime]);

  const handleSave = async (notes: string) => {
    try {
      // payload object me sessionId aur notes send karna
      const response = await saveSessionNotes({
        sessionId: sessionId?.toString() || "",
        notes,
      }).unwrap();
      console.log("Notes saved:", response);
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  };
  const remoteUserUnpublished = (user: any, mediaType: string) => {
    console.log("remoteUserUnpublished", mediaType, user);
    if (mediaType === "video") {
      setRemoteVideo(false);
    }
    if (mediaType === "audio") {
      setRemoteAudio(false);
    }
  };

  // Api calls

  const fetchAgoraUserInfo = async () => {
    try {
      let response = await joinCall({
        userId: id,
      }).unwrap();
      if (response.success) {
        const updatedProfile = { ...response.data?.user };
        setStudentsProfile((prevProfiles: any) => [
          ...prevProfiles,
          updatedProfile,
        ]);
        setTutorProfile(trainerInfo);

        setMsg(AppMessage.waitMsg);
        sessionId = response.data.sessionId;
        const channel = response.data.channelName;
        const token = response.data.token;
        const trainerUid = response.data.trainerId;
        handleJoinChannel(trainerUid, token, channel);
      }
    } catch (err) {
      setError(AppMessage.requestFailed);
      console.log(AppMessage.requestFailed);
    }
  };

  const getsessionEndingDetail = async () => {
    try {
      let response = await getCallEnded({
        sessionId: sessionId?.toString() || "",
      });
      if (response.data.isEnded) {
        setError(AppMessage.sessionExpire);
        handleLeaveChannel();
      }
    } catch (err) {
      setError(AppMessage.requestFailed);
    }
  };

  const onPressLeaveCall = async () => {
    try {
      let response: any = await leaveCall({
        sessionId: sessionId?.toString() || "",
      });

      if (response?.success) {
        setMsg(AppMessage.CallEnd);
        handleLeaveChannel();
      }
    } catch (err) {
      setError(AppMessage.requestFailed);
    } finally {
      setShowConfirmModal(false);
    }
  };

  // Api calls

  const checkPermissions = async () => {
    try {
      // Check microphone permission
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      micStream.getTracks().forEach((track) => track.stop());

      // Check camera permission
      const camStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      camStream.getTracks().forEach((track) => track.stop());

      setPermissionsGranted({ microphone: true, camera: true });
      return true;
    } catch (error) {
      console.error("Permission error:", error);
      setShowPermissionError(true);
      setPermissionsGranted({ microphone: false, camera: false });
      return false;
    }
  };

  const handleJoinChannel = async (
    tutorUid: number | null,
    token: string,
    channel: string,
  ) => {
    console.log("testCase==>", channel, tutorUid, token);
    if (hasPermissions) {
      try {
        agoraEngineRef.current?.on("connection-state-change", (state) => {
          console.log("Connection state changed:", state);
          if (state === "CONNECTED") {
            setIsConnected(true);
          } else {
            setIsConnected(false);
          }
        });
        setMsg("");

        await agoraEngineRef.current?.join(
          AgoraAppId,
          channel,
          token,
          tutorUid,
        );

        // Create Local Tracks (Microphone and Camera)
        const [micTrack, camTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalMicrophoneTrack(micTrack);
        setLocalCameraTrack(camTrack);

        if (!agoraEngineRef.current?.uid) return;
        // Publish Local Tracks
        await agoraEngineRef.current?.publish([micTrack, camTrack]);

        setCalling(true);
        // Api call getTutorProfileInfo
        // getTutorProfileInfo();
      } catch (error) {
        setError(AppMessage.requestFailed);
        console.error("Error joining channel:", error);
      }
    } else {
      setShowPermissionError(true);
      setMsg("");
    }
  };

  // Screen Sharing Logic

  const toggleScreenSharing = async () => {
    if (!isScreenSharing) {
      try {
        // Create a screen video track (possibly with an audio track)
        const screenTracks = await AgoraRTC.createScreenVideoTrack(
          {
            encoderConfig: "1080p_1",
            optimizationMode: "detail",
          },
          "auto",
        );

        let screenVideoTrack: ILocalVideoTrack;
        let screenAudioTrack: ILocalAudioTrack | null = null;

        if (Array.isArray(screenTracks)) {
          [screenVideoTrack, screenAudioTrack] = screenTracks;
        } else {
          screenVideoTrack = screenTracks;
        }

        // Stop and unpublish the local camera track (optional)
        if (localCameraTrack) {
          await agoraEngineRef.current?.unpublish(localCameraTrack);
          localCameraTrack.stop();
          setLocalCameraTrack(null);
        }

        // Publish the screen video track
        setScreenTrack(screenVideoTrack);
        await agoraEngineRef.current?.publish(screenVideoTrack);

        if (screenAudioTrack) {
          await agoraEngineRef.current?.publish(screenAudioTrack);
        }
        // setIsScreenSharing(true);
        isScreenSharing = true;

        screenVideoTrack.on("track-ended", async () => {
          console.log(
            "Screen sharing stopped from browser button===>>>>>",
            isScreenSharing,
          );

          if (isScreenSharing) {
            console.log("Screen sharing stopped from browser button===>");
            toggleScreenSharing(); // Stop screen sharing programmatically
          }
          setRefresh((prev) => !prev);
        });
      } catch (error) {
        console.error("Error starting screen sharing:", error);
      }
    } else {
      try {
        console.log("End screen");
        // Stop and unpublish the screen track
        if (_screenTrack) {
          await agoraEngineRef.current?.unpublish(_screenTrack);
          _screenTrack.stop();
          setScreenTrack(null);

          _screenTrack.getMediaStreamTrack()?.stop();
        }

        // Re-enable the local camera if it was active before screen sharing
        if (!_localCameraTrack) {
          const camTrack = await AgoraRTC.createCameraVideoTrack();
          setLocalCameraTrack(camTrack);
          await agoraEngineRef.current?.publish(camTrack);
        }

        // setIsScreenSharing(false);
        isScreenSharing = false;
        setRefresh((prev) => !prev);
      } catch (error) {
        console.error("Error stopping screen sharing:", error);
      }
    }
  };

  const onPressMic = (val: boolean) => {
    setMic(val);
    if (localMicrophoneTrack) {
      if (val) {
        localMicrophoneTrack.setVolume(100); // Unmute
      } else {
        localMicrophoneTrack.setVolume(0); // Mute
      }
    }
  };

  const onPressCamera = (val: boolean) => {
    setCamera(val);
    if (localCameraTrack) {
      if (val) {
        localCameraTrack.setEnabled(true); // Turn camera on
      } else {
        localCameraTrack.setEnabled(false); // Turn camera off
      }
    }
  };

  const handleLeaveChannel = async () => {
    try {
      if (localMicrophoneTrack) {
        localMicrophoneTrack.stop();
        localMicrophoneTrack.close();
      }
      if (localCameraTrack) {
        localCameraTrack.stop();
        localCameraTrack.close();
      }
      if (screenTrack) {
        screenTrack.stop();
        screenTrack.close();
      }

      await agoraEngineRef.current?.leave();
      setIsConnected(false);
      setCalling(false);
      setLocalMicrophoneTrack(null);
      setLocalCameraTrack(null);
      setScreenTrack(null);
      // setIsScreenSharing(false);
      isScreenSharing = false;
    } catch (error) {
      console.error("Error leaving channel:", error);
    }
  };

  const onPressCalling = (val: boolean) => {
    if (calling) {
      setShowConfirmModal(true); // If already calling, end the call
    }
  };

  const onPressPermissionsError = () => {
    setShowPermissionError(!showPermissionError);
  };

  // Handle a remote user publishing a stream (audio/video)
  const handleUserPublished = async (user: any, mediaType: string) => {
    const remoteUser: RemoteUser = {
      uid: user.uid.toString(),
    };
    if (remoteUsers.length > 0) {
      return;
    }

    // Handle video stream subscription
    if (mediaType === "video" && user.hasVideo) {
      await agoraEngineRef.current?.subscribe(user, "video");
      remoteUser.videoTrack = user.videoTrack as IRemoteVideoTrack;
      // Check if the video element exists and attach the video track to it
      const videoElement = document.getElementById(
        `remote-video-${user.uid}`,
      ) as HTMLVideoElement;

      if (!videoElement) {
        const newVideoElement = document.createElement("video");
        newVideoElement.id = `remote-video-${user.uid}`;
        newVideoElement.autoplay = true;
        newVideoElement.playsInline = true;
        document
          .getElementById("video-container")
          ?.appendChild(newVideoElement);
        setRemoteVideo(true);
      }
      if (videoElement && remoteUser.videoTrack) {
        remoteUser.videoTrack.play(videoElement);
        setRemoteVideo(true);
      }
    }

    // Handle audio stream subscription
    if (mediaType === "audio" && user.hasAudio) {
      await agoraEngineRef.current?.subscribe(user, "audio");
      remoteUser.audioTrack = user.audioTrack as IRemoteAudioTrack;
      user.audioTrack.play();
      setRemoteAudio(true);
    }

    // Api call getStudentProfile
    // getStudentProfile(user.uid);

    // Add the remote user to the state

    // single
    remoteUsersRef.current = [
      ...remoteUsersRef.current.filter((user) => user.uid !== remoteUser.uid),
      {
        ...remoteUsersRef.current.find((user) => user.uid === remoteUser.uid),
        ...remoteUser,
      },
    ];
    setRemoteUsers(remoteUsersRef.current);

    // multi user

    // setRemoteUsers((prev) => {
    //   let prevIndex = prev.findIndex((u) => u.uid === remoteUser.uid);
    //   console.log("agora:Remote user published:", prevIndex, prev);
    //   let updatedData = [...prev];
    //   if (prevIndex !== -1) {
    //     updatedData[prevIndex] = { ...updatedData[prevIndex], ...remoteUser };
    //   } else {
    //     updatedData.push(remoteUser);
    //   }
    //   return updatedData;
    // });
  };

  // Handle a remote user unpublished (e.g., leaving the call or stopping the video)
  const handleUserUnpublished = (user: any) => {
    console.log("Remote user unpublished:", user);
    // Remove the user from the remote users state
    setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid.toString()));

    // If video or audio track is available, we can also clean it up here if needed
    const videoElement = document.getElementById(
      `remote-video-${user.uid}`,
    ) as HTMLVideoElement;
    if (videoElement) {
      videoElement.srcObject = null; // Stop the video stream
    }
  };

  const onPressToggleView = () => {
    setToggleView(!toggleView);
  };

  const onPressClose = () => {
    setShowConfirmModal(!showConfirmModal);
  };

  const onPressConfirm = () => {
    handleLeaveChannel();
    onPressLeaveCall();
  };

  return (
    <div className="flex justify-between">
      <div className="w-[70%]">
        <VideoCalling
          isConnected={isConnected}
          remoteUsers={remoteUsers}
          onPressCalling={onPressCalling}
          muteLocalAudio={onPressMic}
          toggleScreenSharing={toggleScreenSharing}
          onPressMic={onPressMic}
          onPressCamera={onPressCamera}
          calling={calling}
          isScreenSharing={isScreenSharing}
          micOn={micOn}
          cameraOn={cameraOn}
          localMicrophoneTrack={localMicrophoneTrack}
          screenTrack={screenTrack}
          localCameraTrack={localCameraTrack}
          permissionsGranted={permissionsGranted}
          showPermissionError={showPermissionError}
          onPressPermissionsError={onPressPermissionsError}
          isRemoteAudioOn={isRemoteAudioOn}
          isRemoteVideoOn={isRemoteVideoOn}
          error={error}
          msg={msg}
          remoteVideo={remoteVideo}
          studentsProfile={studentsProfile}
          isCountdownActive={isCountdownActive}
          countdownTime={countdownTime}
          toggleView={toggleView}
          onPressToggleView={onPressToggleView}
          remoteAudio={remoteAudio}
          tutorProfile={tutorProfile}
          onPressClose={onPressClose}
          onPressConfirm={onPressConfirm}
          showConfirmModal={showConfirmModal}
          handleSave={handleSave}
        />
      </div>
      <div className="w-[28%]">
        <RightSideBar />
      </div>
    </div>
  );
};

export default VideoCallScreen;
