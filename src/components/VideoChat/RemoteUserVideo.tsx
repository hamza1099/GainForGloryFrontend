"use client"
import React, { useEffect } from "react";
import logo from "../../assets/avatar_.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { imgBaseUrl } from "@/redux/api/baseApi";
import Image from "next/image";

type Props = {
  remoteUsers: any;
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
  remoteVideo: boolean;
  remoteAudio: boolean;
  screenView: boolean;
};

const RemoteUserVideo = (props: Props) => {
  useEffect(() => {
    props.remoteUsers.forEach((user: any) => {
      if (user.videoTrack) {
        user.videoTrack.play(`remote-video-${user.uid}`);
      }
    });
  }, [props.remoteUsers]);
  return (
    <div>
      {props.remoteUsers.length !== 0 ? (
        <>
          {props.remoteUsers.map((user: any) => {
            const studentProfile = props.studentsProfile?.find(
              (profile: any) => profile.user_uid == user.uid,
            );
            let studentProfilePic = `${imgBaseUrl}${studentProfile?.profile_pic_url}`;

            return (
              <>
                <div key={user.uid}>
                  <video
                    id={`remote-video-${user.uid}`}
                    autoPlay
                    playsInline
                    width="100%"
                    height="40%"
                  />
                </div>

                {!props.remoteVideo && (
                  <div className="new_user__avatar">
                    <div className="user__avatar">
                      <Image
                        src={
                          studentProfile?.profile_pic_url
                            ? studentProfilePic
                            : logo
                        }
                        alt="User Avatar"
                        width={100}
                        height={100}
                        className="rounded-full" // Agar styling chahiye
                      />
                    </div>
                    <div className="new_user__name">{studentProfile?.name}</div>
                  </div>
                )}

                {!props.remoteAudio && props.screenView && (
                  <div className="member_mute_icon">
                    <FontAwesomeIcon
                      color="#fff"
                      style={{ zIndex: "1" }}
                      className="icon"
                      icon={faMicrophoneSlash as IconProp}
                    />
                  </div>
                )}
                {!props.remoteAudio && !props.screenView && (
                  <div className="member_mute_icon">
                    <div className="muted_text">
                      {studentProfile?.name} Muted
                    </div>
                  </div>
                )}
              </>
            );
          })}
        </>
      ) : (
        <h1 className="waiting__user">Waiting For User to join</h1>
      )}
    </div>
  );
};

export default RemoteUserVideo;
