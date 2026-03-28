"use client";
import React, { useState, FormEvent, useEffect, useRef } from "react";
import "../../Style/BiblePlans.css"; // Import the separate CSS file
import DeleteConfirmModal from "./DeleteConfirmModal";
// TODO: Update this import path to match where your API slice is exported
import {
  useGetBiblePlansQuery,
  useCreateBiblePlanMutation,
  useUpdateBiblePlanMutation,
  useGetBiblePlanByIdQuery,
  useDeleteBiblePlanMutation,
  useUpdateFeaturedBiblePlanMutation,
} from "../../redux/api/biblePlan";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ==========================================
// TYPESCRIPT INTERFACES
// ==========================================

export interface DayPlan {
  title: string;
  devotionalText: string;
  reflectionQuestion: string;
  verse: string;
  verseReference: string;
}

export interface BiblePlanData {
  id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  days: DayPlan[];
}

interface FormDataState {
  title: string;
  description: string;
  imageFile: File | null;
  days: DayPlan[];
}

const BiblePlans: React.FC = () => {
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [allPlans, setAllPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [featuredTargetId, setFeaturedTargetId] = useState<string | null>(null);
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);

  // Pagination State for API
  const [page, setPage] = useState<number>(1);
  const limit: number = 10;

  // --- API HOOKS ---
  const { data: plansData, isLoading: isLoadingPlans } = useGetBiblePlansQuery({
    page,
    limit,
  });
  const { data: singlePlanData, isLoading: isSingleLoading } =
    useGetBiblePlanByIdQuery(selectedPlanId!, {
      skip: !selectedPlanId,
    });

  const [deleteBiblePlan, { isLoading: isDeleting }] =
    useDeleteBiblePlanMutation();
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [updateFeaturedBiblePlan, { isLoading: isFeaturing }] =
    useUpdateFeaturedBiblePlanMutation();

  const [createBiblePlan, { isLoading: isCreating }] =
    useCreateBiblePlanMutation();
  const [updateBiblePlan, { isLoading: isUpdating }] =
    useUpdateBiblePlanMutation();
  const [editId, setEditId] = useState<string | null>(null);

  // --- FORM STATE FOR CREATE PLAN ---
  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    description: "",
    imageFile: null,
    days: [
      {
        title: "",
        devotionalText: "",
        reflectionQuestion: "",
        verse: "",
        verseReference: "",
      },
    ],
  });

  useEffect(() => {
    if (singlePlanData?.data) {
      const plan = singlePlanData.data;

      setFormData({
        title: plan.title || "",
        description: plan.description || "",
        imageFile: null,
        days:
          plan.days?.length > 0
            ? plan.days
            : [
                {
                  title: "",
                  devotionalText: "",
                  reflectionQuestion: "",
                  verse: "",
                  verseReference: "",
                },
              ],
      });
    }
  }, [singlePlanData]);

  useEffect(() => {
    if (plansData?.data) {
      setAllPlans((prev) => {
        // Agar page 1 hai toh purana data khatam karke naya set karein
        if (page === 1) return plansData.data;

        // Duplicate check: Sirf wo plans add karein jo pehle se state mein nahi hain
        const existingIds = new Set(prev.map((p) => p.id));
        const newPlans = plansData.data.filter(
          (p: any) => !existingIds.has(p.id),
        );

        return [...prev, ...newPlans];
      });
    }
  }, [plansData, page]);
  const featuredPlan = allPlans.find((p: any) => p.isFeatured);

  // --- MODAL FORM HANDLERS ---
  const handleAddDay = () => {
    setFormData({
      ...formData,
      days: [
        ...formData.days,
        {
          title: "",
          devotionalText: "",
          reflectionQuestion: "",
          verse: "",
          verseReference: "",
        },
      ],
    });
  };

  const handleDayChange = (
    index: number,
    field: keyof DayPlan,
    value: string,
  ) => {
    const newDays = [...formData.days];
    newDays[index][field] = value;
    setFormData({ ...formData, days: newDays });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, imageFile: e.target.files[0] });
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ VALIDATIONS
    // Validations with Toast Warning
    if (!formData.title.trim()) return toast.warning("Title is required");
    if (!formData.description.trim())
      return toast.warning("Description is required");
    if (!formData.imageFile && !editId)
      return toast.warning("Image is required");
    for (let i = 0; i < formData.days.length; i++) {
      const day = formData.days[i];

      if (
        !day.title ||
        !day.devotionalText ||
        !day.reflectionQuestion ||
        !day.verse ||
        !day.verseReference
      ) {
        alert(`All fields required in Day ${i + 1}`);
        return;
      }
    }
    const cleanedDays = formData.days.map((day) => ({
      title: day.title,
      devotionalText: day.devotionalText,
      reflectionQuestion: day.reflectionQuestion,
      verse: day.verse,
      verseReference: day.verseReference,
    }));

    // ✅ BODY DATA (NO FILE HERE)
    const bodyDataJson = {
      title: formData.title,
      description: formData.description,
      days: cleanedDays,
    };

    const submitData = new FormData();

    // 🔥 IMPORTANT (Postman jaisa)
    submitData.append("bodyData", JSON.stringify(bodyDataJson));

    // 🔥 image optional in update
    if (formData.imageFile) {
      submitData.append("biblePlanImage", formData.imageFile);
    }
    try {
      if (editId) {
        // ✅ UPDATE CALL
        await updateBiblePlan({
          id: editId,
          data: submitData,
        }).unwrap();
        toast.success("Bible Plan Updated Successfully!");
      } else {
        // ✅ CREATE CALL
        await createBiblePlan(submitData).unwrap();

        toast.success("Bible Plan Created Successfully!");
      }

      handleCloseModal();
      setEditId(null);
    } catch (error) {
      console.error("Failed to create plan: ", error);
      toast.error("Operation failed. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setSelectedPlanId(null);
    // 🔥 RESET EVERYTHING
    setFormData({
      title: "",
      description: "",
      imageFile: null,
      days: [
        {
          title: "",
          devotionalText: "",
          reflectionQuestion: "",
          verse: "",
          verseReference: "",
        },
      ],
    });
  };

  const handleEdit = (plan: any) => {
    setEditId(plan.id);
    setSelectedPlanId(plan.id);
    setFormData({
      title: plan.title,
      description: plan.description,
      imageFile: null, // image optional on edit
      days: plan.days || [
        {
          title: "",
          devotionalText: "",
          reflectionQuestion: "",
          verse: "",
          verseReference: "",
        },
      ],
    });

    setIsModalOpen(true);
  };

  const handleDelete = async (planId: string) => {
    try {
      setDeletingPlanId(planId); // Start loading
      await deleteBiblePlan(planId).unwrap();
      toast.success("Bible Plan deleted successfully!");
    } catch (error) {
      console.error("Failed to delete plan:", error);
      toast.error("Failed to delete plan.");
    } finally {
      setDeletingPlanId(null); // Reset loading state
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
    }
  };

  const handleToggleFeatured = (planId: string) => {
    const plan = allPlans.find((p) => p.id === planId);
    if (plan?.isFeatured) {
      return;
    }
    setFeaturedTargetId(planId);
    setIsFeaturedModalOpen(true);
  };

  const handleFeaturedSubmit = async () => {
    if (!featuredFile || !featuredTargetId) {
      return toast.warning("Please select an image first");
    }

    const formData = new FormData();
    // Image key matching Postman: biblePlanFeaturedImage
    formData.append("biblePlanFeaturedImage", featuredFile);

    try {
      await updateFeaturedBiblePlan({
        id: featuredTargetId,
        data: formData,
      }).unwrap();
      toast.success("Plan is now featured!");

      // Update local state
      setAllPlans((prev) =>
        prev.map((p) => ({
          ...p,
          isFeatured: p.id === featuredTargetId,
        })),
      );

      // Reset & Close
      setIsFeaturedModalOpen(false);
      setFeaturedFile(null);
      setFeaturedTargetId(null);
    } catch (error) {
      console.error("Failed to feature plan:", error);
      toast.error("Failed to feature plan");
    }
  };
  return (
    <main className="hm--main">
      <ToastContainer position="top-right" autoClose={3000} />
      <>
        <section className="hm--hero-section first--hero--section">
          <div className="hm--hero-card first--hero--card">
            <img
              alt="Bible in sunlight"
              className="hm--hero-image"
              src={
                featuredPlan?.featuredImage ||
                featuredPlan?.imageUrl ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBkNWkn7VBR9WhzXac11cZGjmX0PHRxooR2dfD14N2QHS869eCfsMw7SKOrasfgZLa4JWInPxkfIE89VMJk2ZaO7nApEAFPLf2XHeKnGPnZ9dDpwD97VkXAd13rPc2dMDbZUt5-gPCtNeyEDyt1QouaPH4fP_xeUqHibCQCBlx_k5Lam36Onn58ztKimze3PDIRXLsvTKhTxusIKT97XfIH95X8K-Oo4H820hOpv4zkDUBvI0Xwpwtn5LEX5pvozZJR5azzoFMvfBs"
              }
            />
            <div className="hm--hero-overlay">
              <div className="hm--hero-content">
                <div>
                  <span className="hm--hero-badge">Recommended for you</span>
                  <h1 className="hm--hero-title">This Weeks Bible Plan</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="hm--plans-section">
          <div className="hm--section-header">
            <h2 className="hm--section-title">Bible Plans</h2>
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  backgroundColor: "#f97316",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                + Add Plan
              </button>
            </div>
          </div>

          {isLoadingPlans ? (
            <p className="errorbox">Loading plans...</p>
          ) : (
            <div className="hm--plans-grid">
              {allPlans.length > 0 ? (
                allPlans.map((plan) => (
                  <div className="hm--plan-card" key={plan.id}>
                    <div className="hm--card-image-wrapper">
                      <img
                        alt={`${plan.title} thumbnail`}
                        className="hm--card-image"
                        src={plan.imageUrl || ""}
                      />
                    </div>
                    <div className="check--box--wrapper">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={plan.isFeatured}
                          onChange={() => handleToggleFeatured(plan.id)}
                          className="custom-checkbox"
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                    <div className="hm--card-content">
                      <span className="hm--card-duration">
                        {plan.totalDays || 0} Days
                      </span>
                      <div className="hm--card-header">
                        <h3 className="hm--card-title">{plan.title}</h3>
                      </div>
                      <p className="hm--card-description">{plan.description}</p>

                      <div className="edit-dell-btn-wraper">
                        <button
                          className="hm--edit-button"
                          onClick={() => handleEdit(plan)}
                          disabled={deletingPlanId === plan.id}
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                          {/* edit plan */}
                        </button>
                        {/* <button
                          className="hm--delete-button"
                          onClick={() => handleDelete(plan.id)}
                          disabled={deletingPlanId === plan.id}
                        >
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                          {deletingPlanId === plan.id
                            ? "Deleting..."
                            : "Delete"}
                        </button> */}
                        <button
                          className="hm--delete-button"
                          onClick={() => {
                            setPlanToDelete(plan.id);
                            setIsDeleteModalOpen(true);
                          }}
                          disabled={deletingPlanId === plan.id}
                        >
                          {deletingPlanId === plan.id ? (
                            <span className="material-symbols-outlined">
                              hourglass_top
                            </span>
                          ) : (
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No plans available. Add one!</p>
              )}
              {plansData?.meta?.page < plansData?.meta?.totalPages && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button
                    className="hm--start-button"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={isLoadingPlans}
                  >
                    {isLoadingPlans ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </>

      {/* ================================================= */}
      {/* MODAL: CREATE NEW BIBLE PLAN */}
      {/* ================================================= */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ marginTop: 0, fontSize: "20px", fontWeight: "700" }}>
              Add New Bible Plan
            </h2>
            {isSingleLoading && editId ? (
              <p className="errorbox mt-5">Loading plan details...</p>
            ) : (
              <form
                onSubmit={handleFormSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <input
                  required
                  type="text"
                  placeholder="Plan Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  style={inputStyle}
                />

                <textarea
                  required
                  placeholder="Plan Description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={inputStyle}
                />

                {/* <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    Feature Image (Upload)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={inputStyle}
                  />
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
                      toast.warning("Only image files are allowed");
                      return;
                    }
                    if (droppedFile.size > 2 * 1024 * 1024) {
                      toast.warning("File size must be less than 2MB");
                      return;
                    }
                    setFormData({ ...formData, imageFile: droppedFile });
                  }}
                  style={{
                    width: "100%",
                    padding: "30px",
                    borderRadius: "8px",
                    border: isDragging
                      ? "2px dashed rgb(249, 115, 22)"
                      : "2px dashed rgb(249, 115, 22)",
                    backgroundColor: "#f9fafb",
                    color: "#374151",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "border-color 0.3s",
                    marginTop: "5px",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "36px", color: "rgb(249, 115, 22)" }}
                  >
                    cloud_upload
                  </span>
                  <label
                    style={{
                      cursor: "pointer",
                      display: "block",
                      marginTop: "10px",
                      fontWeight: "700",
                    }}
                  >
                    Logo File (Drag & Drop or Click)
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                  <div className="drag-drop-text" style={{ marginTop: "5px" }}>
                    {formData.imageFile
                      ? formData.imageFile.name
                      : "Drag and drop an image here, or click to select"}
                  </div>
                </div>

                <hr
                  style={{
                    width: "100%",
                    borderColor: "#e5e7eb",
                    borderWidth: "1px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ margin: 0 }}>Days Curriculum</h3>
                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="default--btn"
                  >
                    + Add Day
                  </button>
                </div>

                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    paddingRight: "10px",
                  }}
                >
                  {formData.days.map((day, index) => (
                    <div key={index} style={dayCardStyle}>
                      <h4 style={{ margin: "0 0 10px 0" }}>Day {index + 1}</h4>
                      <input
                        required
                        type="text"
                        placeholder="Day Title (e.g., Day 1: Peace)"
                        value={day.title}
                        onChange={(e) =>
                          handleDayChange(index, "title", e.target.value)
                        }
                        style={inputStyle}
                      />
                      <textarea
                        required
                        placeholder="Devotional Text"
                        rows={2}
                        value={day.devotionalText}
                        onChange={(e) =>
                          handleDayChange(
                            index,
                            "devotionalText",
                            e.target.value,
                          )
                        }
                        style={inputStyle}
                      />
                      <input
                        required
                        type="text"
                        placeholder="Reflection Question"
                        value={day.reflectionQuestion}
                        onChange={(e) =>
                          handleDayChange(
                            index,
                            "reflectionQuestion",
                            e.target.value,
                          )
                        }
                        style={inputStyle}
                      />
                      <input
                        required
                        type="text"
                        placeholder="Verse Text (e.g., Do not be anxious...)"
                        value={day.verse}
                        onChange={(e) =>
                          handleDayChange(index, "verse", e.target.value)
                        }
                        style={inputStyle}
                      />
                      <input
                        required
                        type="text"
                        placeholder="Verse Reference (e.g., Philippians 4:6)"
                        value={day.verseReference}
                        onChange={(e) =>
                          handleDayChange(
                            index,
                            "verseReference",
                            e.target.value,
                          )
                        }
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "20px",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={cancelBtnStyle}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="default--btn"
                  >
                    {editId
                      ? isUpdating
                        ? "Updating..."
                        : "Update Plan"
                      : isCreating
                        ? "Saving..."
                        : "Create Plan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* ================================================= */}
      {/* MODAL: UPLOAD FEATURED IMAGE */}
      {/* ================================================= */}
      {isFeaturedModalOpen && (
        <div style={modalOverlayStyle} className="featuredmodal">
          <div style={modalContentStyle}>
            <h2 style={{ marginTop: 0 }}>Mark as Featured</h2>
            <p>Please upload a high-quality featured image for this plan.</p>

            {/* <div style={{ margin: "20px 0" }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) setFeaturedFile(e.target.files[0]);
                }}
                style={inputStyle}
              />
            </div> */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setFeaturedFile(e.dataTransfer.files[0]);
                }
              }}
              style={{
                width: "100%",
                padding: "30px",
                borderRadius: "8px",
                border: isDragging
                  ? "2px dashed #rgb(249, 115, 22)"
                  : "2px dashed rgb(249, 115, 22)",
                backgroundColor: "#f9fafb",
                color: "#374151",
                textAlign: "center",
                cursor: "pointer",
                transition: "border-color 0.3s",
                margin: "20px 0",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "36px", color: "rgb(249, 115, 22)" }}
              >
                cloud_upload
              </span>
              {featuredFile ? (
                <p>{featuredFile.name}</p>
              ) : (
                <p>Drag & drop an image here, or click to select</p>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.[0]) setFeaturedFile(e.target.files[0]);
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setIsFeaturedModalOpen(false)}
                style={cancelBtnStyle}
              >
                Cancel
              </button>
              <button
                onClick={handleFeaturedSubmit}
                className="default--btn"
                disabled={isFeaturing} // Request ke dauran button disable ho jayega
              >
                {isFeaturing ? "Featuring..." : "Confirm & Feature"}
              </button>
            </div>
          </div>
        </div>
      )}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (planToDelete) handleDelete(planToDelete);
        }}
        title="Delete Bible Plan"
        message="Are you sure you want to delete this Bible Plan?"
      />
    </main>
  );
};

// --- MODAL INLINE STYLES ---
const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};
const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "600px",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginTop: "5px",
  boxSizing: "border-box",
  fontFamily: "inherit",
};
const dayCardStyle: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  marginBottom: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};
const addBtnStyle: React.CSSProperties = {
  backgroundColor: "#10b981",
  color: "white",
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
};
const cancelBtnStyle: React.CSSProperties = {
  backgroundColor: "#f3f4f6",
  color: "#374151",
  padding: "10px 20px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  cursor: "pointer",
  fontWeight: "bold",
};
const submitBtnStyle: React.CSSProperties = {
  backgroundColor: "#4F46E5",
  color: "white",
  padding: "10px 20px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
};

export default BiblePlans;
