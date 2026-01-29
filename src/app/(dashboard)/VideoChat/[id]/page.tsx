import TrainerList from "@/components/TrainerList/TrainerList";
import VideoCallScreen from "@/components/VideoChat/VideoCallScreen";
import React from "react";
import logo2 from "@/assets/notes.svg";
import Image from "next/image";
import sendIcon from "@/assets/send-icon.svg";
import historyIcon from "@/assets/history.svg";
import chevron from "@/assets/chevron-right.svg";

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
        <div className="flex justify-between">
          <div className="w-[70%]">
            <VideoCallScreen />
          </div>
          <div className="w-[28%]">
            <div className="session--notes mb-5">
              <div className="bg-white dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] dark:bg-orange-950/30 flex items-center justify-center">
                      <span className="">
                        <Image src={logo2} alt="notes" width={24} height={24} />
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Session Notes
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Trainers notes for this session
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                  <textarea
                    className="w-full h-40 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm focus:ring-primary focus:border-primary transition-all dark:text-slate-300 placeholder:text-slate-400"
                    placeholder="Your trainer will leave notes here..."
                  />

                  <button className="w-full bg-[#EA580C] hover:bg-orange-400 text-white py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 active:scale-[0.98]">
                    <span className="material-icons-round text-lg">
                      <Image
                        src={sendIcon}
                        alt="notes"
                        width={28}
                        height={28}
                      />
                    </span>
                    Save Note
                  </button>
                </div>
              </div>
            </div>
            <div className="past--sessions">
              <div className="bg-white dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                      <span className="material-icons-round text-lg">
                        <Image
                          src={historyIcon}
                          alt="notes"
                          width={28}
                          height={28}
                        />
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Past Sessions
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Review notes from previous training
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sessions List */}
                <div className="p-4 space-y-3">
                  {/* Item */}
                  <div className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                        Oct 24, 2023
                      </span>
                      <span className="">
                        <Image
                          src={chevron}
                          alt="notes"
                          width={24}
                          height={24}
                        />
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Upper Body Strength
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                      Focus on progressive overload with bench press...
                    </p>
                  </div>

                  {/* Item */}
                  <div className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                        Oct 21, 2023
                      </span>
                      <span className="">
                        <Image
                          src={chevron}
                          alt="notes"
                          width={24}
                          height={24}
                        />
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Active Recovery Yoga
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                      Mobility work for hips and lower back stability...
                    </p>
                  </div>

                  {/* Loader */}
                  <div className="py-10 flex flex-col items-center justify-center opacity-40">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-[10px] font-medium mt-3 text-slate-500 uppercase tracking-widest">
                      Updating History
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
