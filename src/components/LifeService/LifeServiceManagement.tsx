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
  const [formState, setFormState] = useState({
    title: "",
    videoUrl: "",
    startsAt: "",
  });

  const liveServices = servicesData?.data || [];
  const meta = servicesData?.meta;

  useEffect(() => {
    if (editData) {
      setFormState({
        title: editData.title,
        videoUrl: editData.videoUrl,
        startsAt: moment(editData.startsAt).format("YYYY-MM-DDTHH:mm"),
      });
    } else {
      setFormState({ title: "", videoUrl: "", startsAt: "" });
    }
  }, [editData]);

  const handleSubmit = async () => {
    if (!formState.title || !formState.videoUrl || !formState.startsAt) {
      return toast.warn("Please fill all required fields!");
    }
    const selectedDate = new Date(formState.startsAt);
    const now = new Date();

    if (selectedDate < now) {
      return toast.error("Past date and time are not allowed!");
    }
    try {
      const payload = {
        ...formState,
        startsAt: new Date(formState.startsAt).toISOString(),
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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await toast.promise(deleteLiveService(id).unwrap(), {
          pending: "Deleting...",
          success: "Service deleted!",
          error: "Delete failed!",
        });
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
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
                      Loading services...
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
                          onClick={() => handleDelete(service.id)}
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
          {meta && meta.totalPage > 1 && (
            <div className="m--pagination">
              <button
                className="m--pagination-prev"
                disabled={currentPage === 1 || isFetching}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>
              <span className="m--page-indicator">
                Page <strong>{currentPage}</strong> of {meta.totalPage}
              </span>
              <button
                className="m--pagination-next"
                disabled={currentPage >= meta.totalPage || isFetching}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="m--modal-overlay">
          <div className="m--modal-container">
            <div className="m--modal-header">
              <h2>{editData ? "Edit" : "Add"} Live Service</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
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
              </div>
            </div>
            <div className="m--modal-footer">
              <button
                onClick={() => setIsModalOpen(false)}
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
    </div>
  );
};

export default LifeServiceManagement;
