import React from "react";
import "../../Style/VideoCallStyle.css"
import logo from "../../assets/avatar_.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faPhone,
  faMicrophone,
  faArrowUpFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { LocalUser } from "agora-rtc-react";
import RemoteUserVideo from "./RemoteUserVideo";
import { formatTime } from "@/constants/CommonFunctions";
import ErrorModal from "./ErrorModal";
import ConfirmModal from "./ConfirmModal";

type Props = {
  onPressCalling: (val: any) => void;
  muteLocalAudio: any;
  onPressMic: (val: any) => void;
  onPressCamera: (val: any) => void;
  remoteVideo: boolean;

  calling: boolean;
  isScreenSharing: boolean;
  micOn: boolean;
  cameraOn: boolean;
  localMicrophoneTrack: any;
  screenTrack: any;
  localCameraTrack: any;
  toggleScreenSharing: () => Promise<void>;
  permissionsGranted: {
    microphone: boolean;
    camera: boolean;
  };
  showPermissionError: boolean;
  onPressPermissionsError: () => void;
  isConnected: boolean;
  remoteUsers: any;

  isRemoteAudioOn: boolean;
  isRemoteVideoOn: boolean;
  error: string | null;
  msg: string | null;
  studentsProfile: {
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
  }[];
  isCountdownActive: boolean;
  countdownTime: number;
  toggleView: boolean;
  onPressToggleView: () => void;
  remoteAudio: boolean;
  tutorProfile: any;
  onPressConfirm: () => void;
  onPressClose: () => void;
  showConfirmModal: boolean;
};

const VideoCalling = (props: Props) => {
  return (
    <>
      <div className="room">
        <ConfirmModal
          showConfirmModal={props.showConfirmModal}
          onPressConfirm={props.onPressConfirm}
          onPressClose={props.onPressClose}
        />
        {props.isConnected ? (
          <div className="room__members">
            {props.isCountdownActive && props.countdownTime > 0 && (
              <div
                className={`toast-container ${
                  props.countdownTime > 0 ? "toast-active" : ""
                }`}
              >
                <h1>{`Session expires in: ${formatTime(
                  props.countdownTime
                )}`}</h1>
              </div>
            )}

            <div className="host__user">
              {/* remoteUser */}
              {props.toggleView ? (
                <LocalUser
                  className="new__members"
                  audioTrack={props.localMicrophoneTrack}
                  cameraOn={props.cameraOn}
                  micOn={props.micOn}
                  videoTrack={
                    props.isScreenSharing && props.screenTrack
                      ? props.screenTrack[0]
                      : props.localCameraTrack
                  }
                  cover={
                    props.tutorProfile?.img ? props.tutorProfile?.img : logo
                  }
                  playAudio={false}
                ></LocalUser>
              ) : (
                <RemoteUserVideo
                  remoteUsers={props.remoteUsers}
                  studentsProfile={props.studentsProfile}
                  remoteVideo={props.remoteVideo}
                  remoteAudio={props.remoteAudio}
                  screenView={false}
                />
              )}
              {props.isConnected && (
                <div className="control">
                  <div className="left-control">
                    <button
                      className="btn v_button"
                      onClick={() => props.onPressMic((a: any) => !a)}
                    >
                      {!props.micOn ? (
                        <>
                          <FontAwesomeIcon
                            icon={faMicrophoneSlash as IconProp}
                          />
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faMicrophone as IconProp} />
                        </>
                      )}
                    </button>
                    <button
                      className="btn v_button"
                      onClick={() => props.onPressCamera((a: any) => !a)}
                    >
                      {!props.cameraOn ? (
                        <>
                          <FontAwesomeIcon icon={faVideoSlash as IconProp} />
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faVideo as IconProp} />
                        </>
                      )}
                    </button>

                    <button
                      className={`${
                        props.isScreenSharing
                          ? "btn v_button screenshare_active"
                          : "btn v_button"
                      }`}
                      onClick={props.toggleScreenSharing}
                    >
                      <FontAwesomeIcon
                        icon={faArrowUpFromBracket as IconProp}
                      />
                    </button>
                    {/* Hang_up_button */}
                    <button
                      className={`btn btn-phone v_button hang_btn ${
                        props.calling ? "btn-phone-active" : ""
                      }`}
                      onClick={() => props.onPressCalling((a: any) => !a)}
                    >
                      <>
                        <i className="i-phone-hangup" />
                        <FontAwesomeIcon icon={faPhone as IconProp} />
                        <i className="i-mdi-phone" />
                      </>
                    </button>
                    {/* hang up button */}
                  </div>
                </div>
              )}
            </div>

            {/* Local User */}
            <div className="members__list" onClick={props.onPressToggleView}>
              <div className="new__members">
                {props.toggleView ? (
                  <RemoteUserVideo
                    screenView={true}
                    remoteUsers={props.remoteUsers}
                    studentsProfile={props.studentsProfile}
                    remoteVideo={props.remoteVideo}
                    remoteAudio={props.remoteAudio}
                  />
                ) : (
                  <LocalUser
                    className="new__members"
                    audioTrack={props.localMicrophoneTrack}
                    cameraOn={props.cameraOn}
                    micOn={props.micOn}
                    videoTrack={
                      props.isScreenSharing && props.screenTrack
                        ? props.screenTrack[0]
                        : props.localCameraTrack
                    }
                    cover={
                      props.tutorProfile?.img ? props.tutorProfile?.img : logo
                    }
                    playAudio={false}
                  ></LocalUser>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="join-room">
            {props.error && <h1 className="full-page-error">{props.error}</h1>}
            {props.msg && (
              <h1 style={{ color: "lighgrey", width: "500px" }}>{props.msg}</h1>
            )}

            <ErrorModal
              showPermissionError={props.showPermissionError}
              onPressPermissionsError={props.onPressPermissionsError}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default VideoCalling;
