"use client";
import React, { useState } from "react";
import "../../Style/Banner.css";
import {
  useGetAllBannersQuery,
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useUpdateBannerStatusMutation,
} from "@/redux/api/bannerApi";
import { toast, ToastContainer } from "react-toastify"; // React-Toastify import kiya
import DeleteConfirmModal from "./DeleteConfirmModal";

const Banner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // RTK Query Hooks
  const { data: banners, isLoading, isError } = useGetAllBannersQuery({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateBannerStatus] = useUpdateBannerStatusMutation();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<{
    file?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const handleSaveBanner = async () => {
    const newErrors: any = {};
    if (!selectedFile) {
      newErrors.file = "Image is required";
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = "End date must be greater than start date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const formData = new FormData();
    formData.append("bannerImage", selectedFile!);
    if (startDate) {
      formData.append("startDate", startDate);
    }

    if (endDate) {
      formData.append("endDate", endDate);
    }

    try {
      await createBanner(formData).unwrap();
      toast.success("Banner added successfully!"); // Success Toast
      setIsModalOpen(false);
      resetForm();
      setSelectedFile(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add banner."); // Error Toast
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";

    try {
      setUpdatingId(id);

      await updateBannerStatus({ id, status: newStatus }).unwrap();

      toast.success(
        `Banner ${newStatus === "ACTIVE" ? "activated" : "blocked"} successfully`,
      );
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteBanner(deleteId).unwrap();
      toast.success("Banner deleted successfully!");
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err: any) {
      toast.error("Failed to delete banner.");
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setStartDate("");
    setEndDate("");
    setErrors({});
  };
  return (
    <>
      <ToastContainer />
      <div className="m--container">
        <main className="m--main">
          <div className="m--header mb-3">
            <h1 className="m--title">Banner Management</h1>
          </div>
          {isLoading && (
            <div className="main--loader">
              <div className="loader"></div>
            </div>
          )}
          {isError && (
            <div className="main--loader">
              <div className="loader"></div>
            </div>
          )}

          <div className="m--grid">
            {/* Loading & Error States */}

            {/* Empty State: Jab banners na hon */}
            {!isLoading && !isError && banners?.data?.length === 0 && (
              <div
                className="m--empty-state"
                style={{
                  textAlign: "center",
                  padding: "40px",
                  gridColumn: "1 / -1",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "48px", color: "#999" }}
                >
                  imagesmode
                </span>
                <p style={{ color: "#666", marginTop: "10px" }}>
                  No banners found yet.
                </p>
              </div>
            )}

            {/* Banners List */}
            {banners?.data?.map((banner: any) => (
              <div className="m--card" key={banner._id || banner.id}>
                <div className="m--card-media">
                  <img
                    alt="Banner"
                    className="m--card-img"
                    src={banner.image || banner.url}
                    onClick={() => setPreviewImage(banner.image || banner.url)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="m--card-content">
                  <div className="m--card-header">
                    <button
                      className="m--card-btn m--card-btn-delete"
                      // onClick={() => handleDelete(banner._id || banner.id)}
                      onClick={() => {
                        setDeleteId(banner._id || banner.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    {banner.startDate && (
                      <span className="m--card-date">
                        <span className="material-symbols-outlined">
                          calendar_month
                        </span>
                        {banner.startDate
                          ? new Date(banner.startDate).toLocaleString()
                          : "--"}
                      </span>
                    )}
                    {banner.endDate && (
                      <span className="m--card-date">
                        <span className="material-symbols-outlined">
                          calendar_month
                        </span>
                        {banner.endDate
                          ? new Date(banner.endDate).toLocaleString()
                          : "--"}
                      </span>
                    )}
                    <div></div>
                    <label className="m--switch">
                      <input
                        type="checkbox"
                        checked={banner.status === "ACTIVE"}
                        onChange={() =>
                          handleToggleStatus(
                            banner._id || banner.id,
                            banner.status,
                          )
                        }
                        disabled={updatingId === (banner._id || banner.id)}
                      />
                      <span className="m--slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <button className="m--fab" onClick={() => setIsModalOpen(true)}>
          <span className="material-symbols-outlined m--fab-icon">add</span>
        </button>

        {isModalOpen && (
          <div className="m--modal-overlay">
            <div
              className="m--modal-backdrop"
              onClick={() => {
                if (!isCreating) {
                  setIsModalOpen(false);
                  resetForm();
                }
              }}
            ></div>

            <div className="m--modal-container">
              <div className="m--modal-header">
                <h2 className="m--modal-title">Add New Banner</h2>
                <button
                  className="m--modal-close-btn"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  disabled={isCreating}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="m--modal-body">
                <div className="m--form-field">
                  <label className="m--form-label">Creative Asset</label>
                  <div
                    className={`m--upload-area ${dragOver ? "m--upload-area-dragover" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        setSelectedFile(e.dataTransfer.files[0]);
                        setErrors((prev) => ({ ...prev, file: "" }));
                      }
                    }}
                  >
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                          setErrors((prev) => ({ ...prev, file: "" }));
                        }
                      }}
                    />
                    <div className="m--upload-icon-wrapper">
                      <span className="material-symbols-outlined m--upload-icon">
                        upload_file
                      </span>
                    </div>
                    <div className="m--upload-text">
                      <p className="m--upload-title">
                        {selectedFile
                          ? `Selected: ${selectedFile.name}`
                          : "Drag and drop image upload"}
                      </p>
                      <p className="m--upload-subtitle">
                        Supports JPG, PNG, WebP (Max 10MB)
                      </p>
                    </div>
                  </div>
                </div>
                {errors.file && (
                  <p
                    style={{ color: "red", fontSize: "12px", marginTop: "5px" }}
                  >
                    {errors.file}
                  </p>
                )}
                <div className="m--form-field">
                  <label className="m--form-label">Start Date (Optional)</label>
                  <input
                    // type="date"
                    type="datetime-local"
                    className="m--form-input"
                    // className="m--input "
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setErrors((prev) => ({ ...prev, startDate: "" }));
                    }}
                  />
                  {errors.startDate && (
                    <p style={{ color: "red", fontSize: "12px" }}>
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div className="m--form-field">
                  <label className="m--form-label">End Date (Optional)</label>
                  <input
                    type="datetime-local"
                    className="m--form-input"
                    // className="m--input"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setErrors((prev) => ({ ...prev, endDate: "" }));
                    }}
                  />
                  {errors.endDate && (
                    <p style={{ color: "red", fontSize: "12px" }}>
                      {errors.endDate}
                    </p>
                  )}
                </div>

                <div className="m--modal-footer">
                  <button
                    className="m--btn-save"
                    onClick={handleSaveBanner}
                    disabled={isCreating}
                  >
                    {isCreating ? "Uploading..." : "Save Banner"}
                  </button>
                  <button
                    className="m--btn-cancel"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {previewImage && (
          <div className="m--modal-overlay">
            <div
              className="m--modal-backdrop"
              onClick={() => setPreviewImage(null)}
            ></div>

            <div className="m--modal-container" style={{ maxWidth: "800px" }}>
              <div className="m--modal-header">
                <h2 className="m--modal-title">Preview</h2>
                <button
                  className="m--modal-close-btn"
                  onClick={() => setPreviewImage(null)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="m--modal-body" style={{ textAlign: "center" }}>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: "500px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>
          </div>
        )}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteId(null);
          }}
          onConfirm={handleDelete}
          title="Delete Banner"
          message="Are you sure you want to delete this banner?"
        />
      </div>
    </>
  );
};

export default Banner;
