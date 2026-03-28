"use client";

import { useEffect, useState, useRef } from "react";
import "../../Style/LifeGroupsManagement.css";
import {
  useGetAllLifeGroupsQuery,
  useCreateLifeGroupMutation,
  useUpdateLifeGroupMutation,
  useDeleteLifeGroupMutation,
  useUpdateMemberStatusMutation,
  useGetLifeGroupMembersQuery,
} from "@/redux/api/lifeGroup";
import { skipToken } from "@reduxjs/toolkit/query";
import { RequestDetailsModal } from "./RequestDetailsModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

type TabType = "groups" | "requests";

interface LifeGroupItem {
  id: string; // API string IDs use kar rhi hai (MongoDB style)
  title: string;
  description: string;
  logo: string;
}

const LifeGroup = () => {
  const [activeTab, setActiveTab] = useState<TabType>("groups");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Items per page
  // ✅ ID string hai based on your API response
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const {
    data: groupsData,
    refetch: refetchGroups,
    isLoading: groupsLoading,
  } = useGetAllLifeGroupsQuery({});

  const [createLifeGroup, { isLoading: isCreating }] =
    useCreateLifeGroupMutation();
  const [updateLifeGroup, { isLoading: isUpdating }] =
    useUpdateLifeGroupMutation();
  const [deleteLifeGroup, { isLoading: isDeleting }] =
    useDeleteLifeGroupMutation();
  const [updateMemberStatus] = useUpdateMemberStatusMutation();

  // ✅ Automatically fetches members when selectedGroupId changes

  const {
    data: membersData,
    isLoading: membersLoading,
    refetch: refetchMembers,
  } = useGetLifeGroupMembersQuery(
    selectedGroupId
      ? { id: selectedGroupId, page: currentPage, limit }
      : skipToken,
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Separate add modal for cleanliness
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [editGroupData, setEditGroupData] = useState<LifeGroupItem | null>(
    null,
  );
  const [formState, setFormState] = useState({ title: "", description: "" });

  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const lifeGroups = groupsData?.data || [];

  // ✅ Safely checking nesting of your member list response
  const joinRequests = membersData?.data?.data || [];
  const totalPages = membersData?.data?.meta?.totalPage || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGroupId]);
  // Edit form handling

  useEffect(() => {
    if (editGroupData) {
      setFormState({
        title: editGroupData.title,
        description: editGroupData.description,
      });
    } else {
      setFormState({ title: "", description: "" });
    }
  }, [editGroupData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setErrorMsg("Only image files are allowed");
      return;
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
      setErrorMsg("File size must be less than 2MB");
      return;
    }

    setFile(selectedFile);
    setErrorMsg(null);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // ✅ Member list trigger
  const handleSelectGroupForMembers = (groupId: string) => {
    setSelectedGroupId(groupId);
    setActiveTab("requests"); // Tab shift kar do user ko
  };

  const handleApproveRequest = async (memberId: string) => {
    try {
      await updateMemberStatus({ memberId, status: "ACTIVE" }).unwrap();
      refetchMembers();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Approve failed");
    }
  };

  const handleRejectRequest = async (memberId: string) => {
    try {
      await updateMemberStatus({ memberId, status: "BLOCKED" }).unwrap();
      refetchMembers();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Reject failed");
    }
  };

  const handleDeleteGroup = async () => {
    if (!deleteId) return;

    try {
      await deleteLifeGroup(String(deleteId)).unwrap();
      refetchGroups();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Delete failed");
    }
  };

  const handleAddSubmit = async () => {
    try {
      setErrorMsg(null);
      if (!formState.title || !formState.description || !file) {
        throw new Error("All fields and logo are required");
      }

      const formData = new FormData();
      formData.append("title", formState.title);
      formData.append("description", formState.description);
      formData.append("logo", file);
      if (bannerFile) formData.append("lifeBanner", bannerFile);

      await createLifeGroup(formData).unwrap();

      setIsAddModalOpen(false);
      setFormState({ title: "", description: "" });
      setFile(null);
      setBannerFile(null);
      refetchGroups();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err.message || "Failed to create");
    }
  };

  const handleEditClick = (group: LifeGroupItem) => {
    setEditGroupData(group);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      if (!editGroupData?.id) throw new Error("Invalid group");
      if (!formState.title || !formState.description)
        throw new Error("Fields required");

      const formData = new FormData();
      formData.append("title", formState.title);
      formData.append("description", formState.description);
      if (file) formData.append("logo", file);
      if (bannerFile) formData.append("lifeBanner", bannerFile);

      await updateLifeGroup({
        id: editGroupData.id,
        formData,
      }).unwrap();

      setIsEditModalOpen(false);
      setEditGroupData(null);
      setFile(null);
      setBannerFile(null);
      refetchGroups();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err.message);
    }
  };

  return (
    <div className="m--container">
      <main className="m--main">
        {/* Header */}
        <header className="m--content-header">
          <div className="m--header-left">
            <h1>Life Groups Management</h1>
            <p>Manage community groups and user join requests.</p>
          </div>
          <button
            className="m--btn-primary"
            onClick={() => {
              setIsAddModalOpen(true);
              setFormState({ title: "", description: "" });
              setFile(null);
            }}
          >
            <svg viewBox="0 0 24 24">
              <path
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Add New Life Group
          </button>
        </header>

        {/* Tabs Card */}
        <section className="m--groups-card">
          <div className="m--tabs-header">
            <div className="m--tabs-list">
              <button
                className={`m--tab-button ${activeTab === "groups" ? "active" : ""}`}
                onClick={() => setActiveTab("groups")}
              >
                Life Groups List
              </button>
              <button
                className={`m--tab-button ${activeTab === "requests" ? "active" : ""}`}
                onClick={() => setActiveTab("requests")}
              >
                Join Requests{" "}
                {selectedGroupId && (
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    (Selected Group)
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="m--tab-panel">
            {/* Groups Panel */}
            {activeTab === "groups" && (
              <div className="m--tab-panel-content">
                <div className="m--table-wrapper">
                  <table className="m--table">
                    <thead>
                      <tr>
                        <th>Logo</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupsLoading ? (
                        <tr>
                          <td colSpan={6} className="errorbox">
                            Loading groups...
                          </td>
                        </tr>
                      ) : (
                        lifeGroups.map((group: any) => (
                          <tr key={group.id}>
                            <td>
                              {/* Display Actual image if available */}
                              {group.logo ? (
                                <img
                                  src={group.logo}
                                  alt={group.title}
                                  className="m--logo-circle"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                  }}
                                />
                              ) : (
                                <div className="m--logo-circle m--logo-blue">
                                  {group.title.charAt(0)}
                                </div>
                              )}
                            </td>
                            <td className="font-semibold">{group.title}</td>
                            <td className="m--desc">{group.description}</td>
                            <td className="text-right">
                              {/* ✅ Select group and go to requests tab */}
                              <button
                                className="m--btn-edit"
                                style={{
                                  background: "#4f46e5",
                                  color: "#fff",
                                  marginRight: "5px",
                                }}
                                onClick={() =>
                                  handleSelectGroupForMembers(group.id)
                                }
                              >
                                View Requests
                              </button>
                              <button
                                className="m--btn-edit"
                                onClick={() => handleEditClick(group)}
                              >
                                Edit
                              </button>
                              <button
                                className="m--btn-delete"
                                onClick={() => {
                                  setDeleteId(group.id);
                                  setShowDeleteModal(true);
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
              </div>
            )}

            {/* Requests Panel */}
            {activeTab === "requests" && (
              <div className="m--tab-panel-content">
                {!selectedGroupId ? (
                  <p
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    Please select a Life Group from the list to view its pending
                    requests.
                  </p>
                ) : (
                  <>
                    <div className="m--table-wrapper">
                      <table className="m--table">
                        <thead>
                          <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {membersLoading ? (
                            <tr>
                              <td colSpan={6} className="errorbox">
                                Loading requests...
                              </td>
                            </tr>
                          ) : joinRequests.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="errorbox">
                                No requests found for this group.
                              </td>
                            </tr>
                          ) : (
                            joinRequests.map((request: any) => (
                              <tr key={request.id}>
                                <td>
                                  <div className="m--user-cell">
                                    <div className="m--user-avatar">
                                      {request.user?.name
                                        ? request.user.name.charAt(0)
                                        : "U"}
                                    </div>
                                    <span>
                                      {request.user?.name || "Unknown"}
                                    </span>
                                  </div>
                                </td>
                                <td>{request.user?.email || "N/A"}</td>
                                <td>{request.user?.role || "N/A"}</td>

                                <td>{request.user?.location || "N/A"}</td>
                                <td>
                                  <span
                                    className={`m--badge-${request.status.toLowerCase()}`}
                                  >
                                    {request.status}
                                  </span>
                                </td>
                                <td className="tdflex">
                                  <button
                                    className="view-detail-btn"
                                    onClick={() => {
                                      setSelectedRequest(request);
                                      setIsDetailsModalOpen(true);
                                    }}
                                  >
                                    <span className="material-symbols-outlined">
                                      visibility
                                    </span>
                                    {/* View <br /> Detailss */}
                                  </button>
                                  {request.status === "PENDING" ? (
                                    <div
                                      className="m--btn-group"
                                      style={{
                                        display: "flex",
                                        gap: "4PX",
                                        alignItems: "center",
                                      }}
                                    >
                                      <button
                                        className="m--btn-approve"
                                        style={{
                                          display: "flex",
                                          gap: "5px",
                                          alignItems: "center",
                                        }}
                                        onClick={() =>
                                          handleApproveRequest(request.id)
                                        }
                                      >
                                        <span
                                          className="material-symbols-outlined"
                                          style={{ fontSize: "15px" }}
                                        >
                                          check_circle
                                        </span>
                                        Approve
                                      </button>
                                      <button
                                        className="m--btn-reject"
                                        onClick={() =>
                                          handleRejectRequest(request.id)
                                        }
                                      >
                                        <span className="material-symbols-outlined">
                                          close_small
                                        </span>
                                        Reject
                                      </button>
                                    </div>
                                  ) : (
                                    <span
                                      className={
                                        request.status === "ACTIVE"
                                          ? "m--processed-text accepted-text"
                                          : "m--processed-text rejected-text"
                                      }
                                    >
                                      {request.status === "ACTIVE"
                                        ? "ACCEPTED"
                                        : "REJECTED"}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    {joinRequests.length > 0 && (
                      // <div className="m--pagination">
                      //   <button
                      //     className="m--pagination-prev"
                      //     onClick={handlePrevPage}
                      //     disabled={currentPage === 1}
                      //   >
                      //     <svg
                      //       viewBox="0 0 24 24"
                      //       width="20"
                      //       height="20"
                      //       fill="none"
                      //       stroke="currentColor"
                      //       strokeWidth="2"
                      //     >
                      //       <path
                      //         d="M15 19l-7-7 7-7"
                      //         strokeLinecap="round"
                      //         strokeLinejoin="round"
                      //       />
                      //     </svg>
                      //   </button>

                      //   <span className="m--page-indicator">
                      //     Page <strong>{currentPage}</strong> of {totalPages}
                      //   </span>

                      //   <button
                      //     className="m--pagination-next"
                      //     onClick={handleNextPage}
                      //     disabled={currentPage >= totalPages}
                      //   >
                      //     <svg
                      //       viewBox="0 0 24 24"
                      //       width="20"
                      //       height="20"
                      //       fill="none"
                      //       stroke="currentColor"
                      //       strokeWidth="2"
                      //     >
                      //       <path
                      //         d="M9 5l7 7-7 7"
                      //         strokeLinecap="round"
                      //         strokeLinejoin="round"
                      //       />
                      //     </svg>
                      //   </button>
                      // </div>
                      <div className="m--pagination">
                        <button
                          className="m--page-btn"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <span className="material-symbols-outlined">
                            chevron_left
                          </span>
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            className={`m--page-number ${
                              currentPage === i + 1 ? "active" : ""
                            }`}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          className="m--page-btn"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <span className="material-symbols-outlined">
                            chevron_right
                          </span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* --- ✅ ADD LIFE GROUP MODAL --- */}
      {isAddModalOpen && (
        <div className="m--modal-overlay">
          <div className="m--modal-container default--modal">
            <div className="m--modal-header">
              <h2>Add Life Group</h2>
              <button onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <div className="m--modal-body pr-0">
              {errorMsg && <p className="m--error-text">{errorMsg}</p>}
              <div className="m--form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  className="m--form-input"
                />
              </div>
              <div className="m--form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formState.description}
                  onChange={handleInputChange}
                  className="m--form-textarea"
                />
              </div>
              {/* <div className="m--form-group">
                <label>Logo File</label>
                <input type="file" onChange={handleFileChange} />
              </div> */}
              {/* Banner File (Optional) */}
              <div
                className={`m--form-group m--drag-drop ${isDragging ? "drag-over" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const droppedFile = e.dataTransfer.files[0];
                  if (!droppedFile) return;
                  if (!droppedFile.type.startsWith("image/")) {
                    setErrorMsg("Only image files are allowed");
                    return;
                  }
                  if (droppedFile.size > 2 * 1024 * 1024) {
                    setErrorMsg("File size must be less than 2MB");
                    return;
                  }
                  setBannerFile(droppedFile);
                  setErrorMsg(null);
                }}
              >
                <span className="material-symbols-outlined">cloud_upload</span>
                <label style={{ cursor: "pointer" }}>
                  Banner File (Optional)
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith("image/")) {
                        setErrorMsg("Only image files are allowed");
                        return;
                      }
                      if (file.size > 2 * 1024 * 1024) {
                        setErrorMsg("File size must be less than 2MB");
                        return;
                      }
                      setBannerFile(file);
                      setErrorMsg(null);
                    }}
                    style={{ display: "none" }}
                  />
                  <div className="drag-drop-text">
                    {bannerFile
                      ? bannerFile.name
                      : "Drag and drop an image here, or click to select"}
                  </div>
                </label>
              </div>
            </div>
            <div className="m--modal-footer">
              <button onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button
                className="m--btn-primary"
                onClick={handleAddSubmit}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ✅ EDIT LIFE GROUP MODAL --- */}
      {isEditModalOpen && (
        <div className="m--modal-overlay edit--life--group--modal">
          <div className="m--modal-container">
            <div className="m--modal-header p-0">
              <h2>Edit Life Group</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditGroupData(null);
                }}
              >
                ✕
              </button>
            </div>
            <div className="m--modal-body">
              {errorMsg && <p className="m--error-text">{errorMsg}</p>}
              <div className="m--form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  className="m--form-input"
                />
              </div>
              <div className="m--form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formState.description}
                  onChange={handleInputChange}
                  className="m--form-textarea"
                />
              </div>
              {/* <div className="m--form-group">
                <label>Logo (Optional update)</label>
                <input type="file" onChange={handleFileChange} />
              </div> */}
              <div
                className={`m--form-group m--drag-drop ${isDragging ? "drag-over" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const droppedFile = e.dataTransfer.files[0];
                  if (!droppedFile) return;
                  if (!droppedFile.type.startsWith("image/")) {
                    setErrorMsg("Only image files are allowed");
                    return;
                  }
                  if (droppedFile.size > 2 * 1024 * 1024) {
                    setErrorMsg("File size must be less than 2MB");
                    return;
                  }
                  setFile(droppedFile);
                  setErrorMsg(null);
                }}
              >
                <span className="material-symbols-outlined">cloud_upload</span>
                <label style={{ cursor: "pointer" }}>
                  Logo File (Drag & Drop or Click)
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <div className="drag-drop-text">
                    {file
                      ? file.name
                      : "Drag and drop an image here, or click to select"}
                  </div>
                </label>
              </div>
            </div>
            <div className="m--modal-footer">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditGroupData(null);
                }}
              >
                Cancel
              </button>
              <button
                className="m--btn-primary"
                onClick={handleUpdateSubmit}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
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
        onConfirm={handleDeleteGroup}
        loading={isDeleting}
        title="Delete Life Group"
        message="Are you sure you want to delete this life group?"
      />
      {isDetailsModalOpen && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedRequest(null);
          }}
        />
      )}
    </div>
  );
};

export default LifeGroup;
