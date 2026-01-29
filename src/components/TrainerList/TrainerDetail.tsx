"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Mail,
  MapPin,
  User,
  Calendar,
  Plus,
  UserPlus,
  Loader2,
  Trash2,
  X,
  Video,
} from "lucide-react";
import {
  useAssignTrainerMutation,
  useGetTrainerDetailQuery,
  useRemoveTrainerMutation,
  useUpdateTrainerMutation,
} from "@/redux/api/trainerApi";
import { toast } from "react-toastify";
import { useGetUsersWithoutTrainerQuery } from "@/redux/api/userApi";
import { useGetMeQuery } from "@/redux/api/auth";

const TrainerDetail = () => {
  const { id } = useParams() as { id: string };
  const { data: authData } = useGetMeQuery("");
  const router = useRouter();
  const userRole = authData?.data?.role || "Admin";
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetTrainerDetailQuery(id);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState("");
  const [startingCallId, setStartingCallId] = useState<string | null>(null);

  // API Call to get all trainees (to assign them)
  const {
    data: allTrainees,
    isLoading: userLoader,
    refetch,
  } = useGetUsersWithoutTrainerQuery({
    page: currentPage,
    limit: 100,
  });

  const [assignTrainer, { isLoading: isAssigningBtn }] =
    useAssignTrainerMutation();
  const [removeTrainer, { isLoading: isRemoving }] = useRemoveTrainerMutation();

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );

  const trainer = data?.data;

  const handleAssignTrainee = async () => {
    if (!selectedTrainee) return toast.error("Please select a trainee");

    try {
      await assignTrainer({
        trainerId: id,
        traineeId: selectedTrainee,
      }).unwrap();

      toast.success("Trainee assigned successfully!");
      setIsAssigning(false);
      setSelectedTrainee("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to assign trainee");
    }
  };

  const handleToggleAssign = () => {
    if (!isAssigning) {
      refetch(); // Jab open ho to fresh data fetch kare
    }
    setIsAssigning(!isAssigning);
  };

  // 1. Pehle logic function jo actual API call karega
  const executeUnassign = async (traineeId: string) => {
    const toastId = toast.loading("Removing trainee...");
    try {
      await removeTrainer({
        trainerId: id, // Trainer ki ID jo useParams se li thi
        traineeId: traineeId, // Woh user jisay remove karna hai
      }).unwrap();

      toast.update(toastId, {
        render: "Trainee removed successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err: any) {
      toast.update(toastId, {
        render: err?.data?.message || "Failed to remove trainee",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // 2. Main handler jo Toastify modal dikhayega
  const handleUnassign = (traineeId: string) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3 p-2">
          <p className="font-semibold text-gray-800">
            Are you sure you want to remove this trainee from this trainer?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={closeToast}
              className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                closeToast();
                executeUnassign(traineeId); // Call actual logic
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      },
    );
  };

  const handleStartCall = (traineeId: string) => {
    setStartingCallId(traineeId);
    router.push(`/VideoChat/${traineeId}`);
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header / Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-24 h-24 bg-secondaryColor/10 rounded-full flex items-center justify-center text-secondaryColor">
          <User size={48} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800">{trainer?.name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-gray-600 text-sm">
            <span className="flex items-center gap-1">
              <Mail size={16} /> {trainer?.email}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={16} /> Joined{" "}
              {new Date(trainer?.createdAt).toLocaleDateString()}
            </span>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-bold ${trainer?.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
            >
              {trainer?.status}
            </span>
          </div>
        </div>
      </div>

      {/* Trainees Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Assigned Trainees</h2>
          {userRole === "ADMIN" && (
            <button
              onClick={handleToggleAssign}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isAssigning
                  ? "bg-gray-100 text-gray-600"
                  : "bg-secondaryColor text-white"
              }`}
            >
              {isAssigning ? (
                <>
                  <X size={18} /> Cancel
                </>
              ) : (
                <>
                  <UserPlus size={18} /> Assign New
                </>
              )}
            </button>
          )}
        </div>

        {isAssigning && (
          <div className="mb-6 p-4 border border-secondaryColor/20 bg-secondaryColor/5 rounded-xl flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-bold mb-1 uppercase text-gray-500">
                Select Trainee
              </label>
              <select
                className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-secondaryColor outline-none"
                value={selectedTrainee}
                onChange={(e) => setSelectedTrainee(e.target.value)}
              >
                {userLoader ? (
                  <option>Loading users...</option>
                ) : allTrainees?.data?.length > 0 ? (
                  <>
                    <option value="">Choose a user...</option>
                    {allTrainees.data.map((t: any) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.email})
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="">No available users to assign</option>
                )}
              </select>
            </div>
            <button
              onClick={handleAssignTrainee}
              disabled={
                isAssigningBtn ||
                allTrainees?.data?.length === 0 ||
                !selectedTrainee
              }
              className="bg-secondaryColor text-white px-6 py-2 rounded-lg font-medium disabled:bg-gray-400"
            >
              {isAssigningBtn ? (
                <Loader2 className="animate-spin mx-auto" size={20} />
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        )}

        {trainer?.trainees?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainer.trainees.map((trainee: any) => (
              <div
                key={trainee.id}
                className=" relative border p-4 rounded-xl hover:border-secondaryColor transition-colors group"
              >
                <p className="font-bold text-gray-800 group-hover:text-secondaryColor">
                  {trainee.name}
                </p>
                <p className="text-sm text-gray-500">{trainee.email}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-400 uppercase tracking-wider font-bold">
                    ID: {trainee.id.slice(-6)}
                  </span>
                  {userRole === "TRAINER" && (
                    <button
                      onClick={() => handleStartCall(trainee.id)}
                      disabled={startingCallId === trainee.id}
                      className=" absolute top-3.5 right-8 p-2 flex items-center gap-1 px-3 py-1 bg-[#f97316] text-white text-xs rounded-md hover:bg-green-600 transition-all mr-2  disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {startingCallId === trainee.id ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Video size={14} />
                          Start Call
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleUnassign(trainee.id)}
                    className="absolute top-2 right-2 p-2 text-darkgray-300 hover:text-red-500 transition-colors"
                    title="Remove Trainee"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div>
                    <span className="text-xs text-green-500 font-medium">
                      {trainee.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
            <p className="text-gray-400">
              No trainees assigned to this trainer yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDetail;
