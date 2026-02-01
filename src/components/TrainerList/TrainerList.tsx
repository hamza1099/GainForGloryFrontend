"use client";
import React, { useState } from "react";
import Pagination from "../ui/Pagination";
import { ChevronDownIcon, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import {
  useGetAllTrainersQuery,
  useUpdateTrainerStatusMutation,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
} from "@/redux/api/trainerApi";
import { toast } from "react-toastify";
import Link from "next/link";
import { validatePassword } from "@/constants/CommonFunctions";
import { imgBaseUrl } from "@/redux/api/baseApi";

type TrainerStatus = "ACTIVE" | "PENDING" | "BLOCKED";
const options = [
  { value: "Active", key: "ACTIVE" },
  { value: "Inactive", key: "BLOCKED" },
];

const TrainerList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingTrainer, setEditingTrainer] = useState<any>(null);
  const [statusMap, setStatusMap] = useState<{ [key: string]: string }>({});
  const [msgError, setMsgError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "MALE",
    location: "",
    password: "",
    // image: null as File | null,
  });

  const { data, isLoading, refetch } = useGetAllTrainersQuery({
    page: currentPage,
    limit: 10,
  });

  const [createTrainer, { isLoading: isCreating }] = useCreateTrainerMutation();
  const [updateTrainer, { isLoading: isUpdating }] = useUpdateTrainerMutation();
  const [deleteTrainer, { isLoading: isDeleting }] = useDeleteTrainerMutation();
  const [updateUserStatus] = useUpdateTrainerStatusMutation();

  const [dropdownStates, setDropdownStates] = useState<{
    [key: string]: boolean;
  }>({});

  const trainers = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPages || 1;

  // --- Handlers ---

  const handleOpenModal = (trainer: any = null) => {
    if (trainer) {
      setEditingTrainer(trainer);
      setFormData({
        name: trainer.name,
        email: trainer.email,
        gender: trainer.gender,
        location: trainer.location,
        password: "", // Usually keep password empty on update
        // image: null as File | null,
      });
    } else {
      setEditingTrainer(null);
      setFormData({
        name: "",
        email: "",
        gender: "MALE",
        location: "",
        password: "",
        // image: null as File | null,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pwdError = validatePassword(formData.password);
      if (pwdError) {
        setMsgError(pwdError);
        return;
      } else {
        setMsgError(null);
      }
      // if (!formData.image) {
      //   setMsgError("Please upload an image for the trainer");
      //   return;
      // }
      const payload = new FormData();
      // loop through formData keys
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          payload.append(key, value as any); // File ya string dono ho sakta
        }
      });
      if (editingTrainer) {
        await updateTrainer({ id: editingTrainer.id, data: payload }).unwrap();
        toast.success("Trainer updated successfully");
      } else {
        await createTrainer(payload).unwrap();
        toast.success("Trainer created successfully");
      }
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        gender: "MALE",
        location: "",
        password: "",
        // image: null,
      });
    } catch (error: any) {
      console.error("Operation failed", error);
      const msg =
        error?.data?.message || "Something went wrong. Please try again.";
      setErrorMessage(msg);
    }
  };

  const handleDelete = (id: string) => {
    // 🚀 Toastify Custom Confirmation
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3 p-2">
          <p className="font-semibold text-gray-800">
            Are you sure you want to delete this trainer?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={closeToast}
              className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                closeToast(); // Pehle toast band karein
                await executeDelete(id); // Phir delete function call karein
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false, // User jab tak action na le, band na ho
        closeOnClick: false,
        draggable: false,
      },
    );
  };

  // 🚀 Actual Delete Execution Logic
  const executeDelete = async (id: string) => {
    const toastId = toast.loading("Deleting trainer...");
    try {
      await deleteTrainer(id).unwrap();
      toast.update(toastId, {
        render: "Trainer deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error: any) {
      toast.update(toastId, {
        render: error?.data?.message || "Delete failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  const toggleDropdown = (id: string) => {
    setDropdownStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelect = async (id: string, newValue: TrainerStatus) => {
    // Dropdown band karein
    setDropdownStates((prev) => ({ ...prev, [id]: false }));

    const toastId = toast.loading("Updating status...");

    try {
      await updateUserStatus({ id, status: newValue }).unwrap();

      // Local state update karein taake UI foran change ho
      setStatusMap((prev) => ({ ...prev, [id]: newValue }));

      toast.update(toastId, {
        render: `Trainer is now ${newValue.toLowerCase()}`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error: any) {
      toast.update(toastId, {
        render: error?.data?.message || "Failed to update status",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  return (
    <div className="bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-secondaryColor">Trainers</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-secondaryColor text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
        >
          <Plus size={18} /> Add Trainer
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="text-secondaryColor text-left text-sm md:text-base font-medium border-b">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Gender</th>
              <th className="py-2 px-4">Location</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : (
              trainers.map((info: any, index: number) => (
                <tr
                  key={info.id}
                  className="border-t text-textColor font-medium"
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">
                    <Link
                      href={`/trainerDetail/${info.id}`}
                      className="text-secondaryColor hover:underline font-semibold"
                    >
                      {info.name}
                    </Link>
                  </td>
                  <td className="py-2 px-4">{info.email}</td>
                  <td className="py-2 px-4">{info.gender}</td>
                  <td className="py-2 px-4">{info.location}</td>
                  <td className="py-2 px-4">
                    <div className="relative inline-block text-left">
                      {(() => {
                        const currentStatus = statusMap[info.id] ?? info.status;
                        const dropdownOptions =
                          currentStatus === "ACTIVE"
                            ? [{ value: "Inactive", key: "BLOCKED" }]
                            : [{ value: "Active", key: "ACTIVE" }];

                        return (
                          <>
                            <button
                              onClick={() => toggleDropdown(info.id)}
                              className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm md:text-base font-medium focus:outline-none ${currentStatus === "ACTIVE" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                            >
                              {currentStatus === "ACTIVE" ? "Active" : "Block"}
                              <ChevronDownIcon className="w-4 h-4 text-gray-500" />{" "}
                            </button>
                            {dropdownStates[info.id] && (
                              <div className="absolute mt-2 w-28 rounded-md bg-white shadow-lg z-50">
                                {" "}
                                <div className="py-1">
                                  {" "}
                                  {dropdownOptions.map((option) => (
                                    <button
                                      key={option.key}
                                      onClick={() =>
                                        handleSelect(
                                          info.id,
                                          option.key as TrainerStatus,
                                        )
                                      }
                                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                    >
                                      {option.value}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleOpenModal(info)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        disabled={isDeleting}
                        onClick={() => handleDelete(info.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        {isDeleting ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* --- CREATE / UPDATE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">
              {editingTrainer ? "Update Trainer" : "Create New Trainer"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  required
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-secondaryColor"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  required
                  type="email"
                  className="w-full border rounded-lg px-3 py-2 outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 outline-none"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 outline-none"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>
              {/* {!editingTrainer && ( */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  required
                  type="password"
                  className="w-full border rounded-lg px-3 py-2 outline-none"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              {/* )} */}
              {/* <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({ ...formData, image: e.target.files[0] });
                    }
                  }}
                  className="w-full border rounded-lg px-3 py-2 outline-none"
                />
                {editingTrainer && formData.image === null && (
                  <img
                    src={`${imgBaseUrl}${editingTrainer.image}`}
                    alt="Trainer"
                    className="mt-2 w-20 h-20 rounded-full object-cover"
                  />
                )}
              </div> */}
               {msgError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium animate-shake">
                  {msgError}
                </div>
              )}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium animate-shake">
                  {errorMessage}
                </div>
              )}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  disabled={isCreating || isUpdating}
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-secondaryColor text-white rounded-lg disabled:bg-gray-400"
                >
                  {(isCreating || isUpdating) && (
                    <Loader2 className="animate-spin" size={16} />
                  )}
                  {editingTrainer ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerList;
