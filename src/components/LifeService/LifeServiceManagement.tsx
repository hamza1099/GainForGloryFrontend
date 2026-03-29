"use client";

import { useEffect, useState } from "react";
import {
  useGetAllLiveServicesQuery,
  useCreateLiveServiceMutation,
  useUpdateLiveServiceMutation,
  useDeleteLiveServiceMutation,
} from "@/redux/api/lifeService";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // CSS import zaroori hai
import "../../Style/LifeGroupsManagement.css";
import DeleteConfirmModal from "./DeleteConfirmModal"

const LifeServiceManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // API Hooks
  const {
    data: servicesData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllLiveServicesQuery({
    page: currentPage,
    limit,
  });
  const [createLiveService, { isLoading: isCreating }] =
    useCreateLiveServiceMutation();
  const [updateLiveService, { isLoading: isUpdating }] =
    useUpdateLiveServiceMutation();
  const [deleteLiveService] = useDeleteLiveServiceMutation();

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    title: "",
    videoUrl: "",
    startsAt: "",
    endsAt: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    videoUrl: "",
    startsAt: "",
    endsAt: "",
  });

  const resetForm = () => {
    setFormState({
      title: "",
      videoUrl: "",
      startsAt: "",
      endsAt: "",
    });

    setErrors({
      title: "",
      videoUrl: "",
      startsAt: "",
      endsAt: "",
    });

    setEditData(null);
  };
  const validate = () => {
    let newErrors = {
      title: "",
      videoUrl: "",
      startsAt: "",
      endsAt: "",
    };

    let isValid = true;

    if (!formState.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!formState.videoUrl.trim()) {
      newErrors.videoUrl = "Video URL is required";
      isValid = false;
    } else if (!/^https?:\/\/.+/.test(formState.videoUrl)) {
      newErrors.videoUrl = "Enter a valid URL";
      isValid = false;
    }

    if (!formState.startsAt) {
      newErrors.startsAt = "Start date is required";
      isValid = false;
    } else {
      const selectedDate = new Date(formState.startsAt);
      const now = new Date();

      if (selectedDate < now) {
        newErrors.startsAt = "Past date not allowed";
        isValid = false;
      }
    }
    if (!formState.endsAt) {
      newErrors.endsAt = "End date is required";
      isValid = false;
    } else {
      const endDate = new Date(formState.endsAt);
      const startDate = new Date(formState.startsAt);

      if (endDate <= startDate) {
        newErrors.endsAt = "End date must be after start date";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const liveServices = servicesData?.data || [];
  const meta = servicesData?.meta;

  useEffect(() => {
    if (editData) {
      setFormState({
        title: editData.title,
        videoUrl: editData.videoUrl,
        startsAt: moment(editData.startsAt).format("YYYY-MM-DDTHH:mm"),
        endsAt: moment(editData.endsAt).format("YYYY-MM-DDTHH:mm"),
      });
    } else {
      setFormState({ title: "", videoUrl: "", startsAt: "", endsAt: "" });
    }
  }, [editData]);

  const handleSubmit = async () => {
    if (!validate()) return;
    // if (!formState.title || !formState.videoUrl || !formState.startsAt) {
    //   return toast.warn("Please fill all required fields!");
    // }
    // const selectedDate = new Date(formState.startsAt);
    // const now = new Date();

    // if (selectedDate < now) {
    //   return toast.error("Past date and time are not allowed!");
    // }
    try {
      const payload = {
        ...formState,
        startsAt: new Date(formState.startsAt).toISOString(),
        endsAt: new Date(formState.endsAt).toISOString(),
      };

      if (editData) {
        await toast.promise(
          updateLiveService({ id: editData.id, data: payload }).unwrap(),
          {
            pending: "Updating service...",
            success: "Service updated successfully! ",
            error: "Update failed! ",
          },
        );
      } else {
        await toast.promise(createLiveService(payload).unwrap(), {
          pending: "Creating service...",
          success: "Service created successfully! ",
          error: "Creation failed! ",
        });
      }

      setIsModalOpen(false);
      setEditData(null);
      refetch();
    } catch (err: any) {
      // toast.promise already handles basic error, but custom msg here if needed
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      await toast.promise(deleteLiveService(selectedId).unwrap(), {
        pending: "Deleting...",
        success: "Service deleted!",
        error: "Delete failed!",
      });

      setIsDeleteModalOpen(false);
      setSelectedId(null);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  return (
    <div className="m--container">
      {/* Toast Container for Global Toasts */}
      <ToastContainer position="top-right" theme="colored" />

      <main className="m--main">
        <header className="m--content-header">
          <div className="m--header-left">
            <h1>Live Services Management</h1>
            <p>Schedule and manage your live video sessions.</p>
          </div>
          <button
            className="m--btn-primary"
            onClick={() => {
              setEditData(null);
              setIsModalOpen(true);
            }}
            disabled={isFetching}
          >
            Add New Live Service
          </button>
        </header>

        <section className="m--groups-card">
          <div className="m--table-wrapper">
            <table className="m--table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Video Link</th>
                  <th>Starts At</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      <div className="main--loader">
                        <div className="loader"></div>
                      </div>
                    </td>
                  </tr>
                ) : liveServices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  liveServices.map((service: any) => (
                    <tr key={service.id}>
                      <td className="font-semibold">{service.title}</td>
                      <td>
                        <a
                          href={service.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 underline"
                        >
                          Open Link
                        </a>
                      </td>
                      <td>{moment(service.startsAt).format("LLL")}</td>
                      <td className="text-right">
                        <button
                          className="m--btn-edit"
                          onClick={() => {
                            setEditData(service);
                            setIsModalOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="m--btn-delete"
                          onClick={() => {
                            setSelectedId(service.id);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="m--pagination">
              <button
                className="m--pagination-prev"
                disabled={currentPage === 1 || isFetching}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              {/* Only show current page number */}
              <span className="m--page-indicator">
                <strong>{currentPage}</strong>
              </span>

              <button
                className="m--pagination-next"
                disabled={currentPage >= meta.totalPages || isFetching}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="m--modal-overlay default--modal edit--life--service--modal">
          <div className="m--modal-container">
            <div className="m--modal-header p-0">
              <h2>{editData ? "Edit" : "Add"} Live Service</h2>
              <button onClick={handleCloseModal}>✕</button>
            </div>
            <div className="m--modal-body">
              <div className="m--form-group">
                <label>Title</label>
                <input
                  type="text"
                  className="m--form-input"
                  disabled={isCreating || isUpdating}
                  value={formState.title}
                  onChange={(e) =>
                    setFormState({ ...formState, title: e.target.value })
                  }
                />
                {errors.title && <p className="m--error">{errors.title}</p>}
              </div>
              <div className="m--form-group">
                <label>Video URL</label>
                <input
                  type="text"
                  className="m--form-input"
                  disabled={isCreating || isUpdating}
                  value={formState.videoUrl}
                  onChange={(e) =>
                    setFormState({ ...formState, videoUrl: e.target.value })
                  }
                />
                {errors.videoUrl && (
                  <p className="m--error">{errors.videoUrl}</p>
                )}
              </div>
              <div className="m--form-group">
                <label>Start Date & Time</label>
                <input
                  type="datetime-local"
                  className="m--form-input"
                  disabled={isCreating || isUpdating}
                  value={formState.startsAt}
                  onChange={(e) =>
                    setFormState({ ...formState, startsAt: e.target.value })
                  }
                />
                {errors.startsAt && (
                  <p className="m--error">{errors.startsAt}</p>
                )}
              </div>
              <div className="m--form-group">
                <label>End Date & Time</label>
                <input
                  type="datetime-local"
                  className="m--form-input"
                  disabled={isCreating || isUpdating}
                  value={formState.endsAt}
                  onChange={(e) =>
                    setFormState({ ...formState, endsAt: e.target.value })
                  }
                />
                {errors.endsAt && <p className="m--error">{errors.endsAt}</p>}
              </div>
            </div>
            <div className="m--modal-footer">
              <button
                onClick={handleCloseModal}
                disabled={isCreating || isUpdating}
              >
                Cancel
              </button>
              <button
                className="m--btn-primary"
                onClick={handleSubmit}
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating
                  ? "Processing..."
                  : editData
                    ? "Update"
                    : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedId(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default LifeServiceManagement;
