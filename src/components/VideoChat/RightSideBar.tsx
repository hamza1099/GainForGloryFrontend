import React, { useEffect, useState } from "react";
import logo2 from "@/assets/notes.svg";
import Image from "next/image";
import sendIcon from "@/assets/send-icon.svg";
import historyIcon from "@/assets/history.svg";
import chevron from "@/assets/chevron-right.svg";
import { formatDate } from "@/constants/formatDate";
interface Props {
  saveLoader: boolean;
  isSuccess: boolean;
  isError: boolean;
  PrevSessionLoader: boolean;
  previousSessions: any;
  handleSave: (notes: string) => Promise<void>;
}
const RightSideBar = (props: Props) => {
  const [notes, setNotes] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);


  // success pe textarea clear
  useEffect(() => {
    if (props.isSuccess) {
      setNotes("");
    }
  }, [props.isSuccess]);

  const onSave = async () => {
    if (!notes.trim()) return;
    await props.handleSave(notes);
  };
  return (
    <>
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
            <p className="flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
              <span className="text-sm">⚠️</span>
              Saving again will update and replace the previously saved session
              notes.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-40 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm focus:ring-primary focus:border-primary transition-all dark:text-slate-300 placeholder:text-slate-400"
              placeholder="Trainer will leave notes here..."
            />
            <button
              onClick={onSave}
              disabled={props.saveLoader || !notes.trim()}
              className={`w-full py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all
                ${
                  props.saveLoader
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-[#EA580C] hover:bg-orange-400 text-white"
                }`}
            >
              {props.saveLoader ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Image src={sendIcon} alt="send" width={28} height={28} />
                  Save Note
                </>
              )}
            </button>

            {props.isError && (
              <p className="text-xs text-red-500 text-center">
                Failed to save notes. Please try again.
              </p>
            )}

            {props.isSuccess && (
              <p className="text-xs text-green-500 text-center">
                Notes saved successfully
              </p>
            )}
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
                  <Image src={historyIcon} alt="notes" width={28} height={28} />
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
         {/* Sessions List */}
<div className="p-4 space-y-3 h-[235px] overflow-auto">
  {props.PrevSessionLoader && (
    <div className="py-10 flex flex-col items-center justify-center opacity-40">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-[10px] font-medium mt-3 text-slate-500 uppercase tracking-widest">
        Loading History
      </p>
    </div>
  )}

  {!props.PrevSessionLoader &&
    props.previousSessions?.data?.map((session: any) => {
      const isOpen = activeSessionId === session.id;

      return (
        <div key={session.id} className="relative">
          {/* Session Card */}
          <div
            onClick={() =>
              setActiveSessionId(isOpen ? null : session.id)
            }
            className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950
            border border-transparent hover:border-slate-200 dark:hover:border-slate-800
            transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase">
                {formatDate(session.createdAt)}
              </span>
              <Image src={chevron} alt="open" width={20} height={20} />
            </div>

            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Session Notes
            </h4>

            <p className="text-xs text-slate-500 line-clamp-1 mt-1">
              {session.notes ?? "No notes added"}
            </p>
          </div>

          {/* 🔥 POP OPEN NOTE */}
          {isOpen && (
            <div
              className="absolute z-50 top-full mt-2 w-full
              bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800
              rounded-xl shadow-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  {formatDate(session.createdAt)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSessionId(null);
                  }}
                  className="text-slate-400 hover:text-red-500 text-sm"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {session.notes || "No notes available for this session."}
              </p>
            </div>
          )}
        </div>
      );
    })}
</div>

        </div>
      </div>
    </>
  );
};

export default RightSideBar;
