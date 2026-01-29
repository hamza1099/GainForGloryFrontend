import TrainerList from "@/components/TrainerList/TrainerList";
import VideoCallScreen from "@/components/VideoChat/VideoCallScreen";
import React from "react";
export default function page() {
  return (
    <div className="min-h-screen p-5 mt-[75px] rounded-md">
      <div className="px-6 bg-white rounded-sm">
        <p className="text-2xl font-bold leading-[130%]">
          Personel Training Session
        </p>
        <div className="text-sm font-light mb-3 text-[#776666] flex gap-[7px] items-center">
          <span className="w-[8px] h-[8px] rounded-full bg-[#2AC764] inline"></span>
          Live video call with Your trainer.
        </div>
        <VideoCallScreen />
      </div>
    </div>
  );
}
