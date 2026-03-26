
// "use client";
// import React, { useState } from "react";
// import "../../Style/Banner.css";
// import {
//   useGetAllBannersQuery,
//   useCreateBannerMutation,
//   useDeleteBannerMutation,
// } from "@/redux/api/bannerApi"; 

// const Banner = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const fileInputRef = React.useRef<HTMLInputElement>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [dragOver, setDragOver] = useState(false);

//   // RTK Query Hooks
//   const { data: banners, isLoading, isError } = useGetAllBannersQuery({});
//   const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
//   const [deleteBanner] = useDeleteBannerMutation();

//   const handleSaveBanner = async () => {
//     if (!selectedFile) {
//       alert("Please select an image first.");
//       return;
//     }

//     const formData = new FormData();
//     // Sirf image bhej rahe hain backend ko
//     formData.append("bannerImage", selectedFile); 

//     try {
//       await createBanner(formData).unwrap();
//       setIsModalOpen(false);
//       setSelectedFile(null);
//     } catch (err) {
//       console.error("Failed to save banner:", err);
//     }
//   };

//   const handleDelete = async (id: string | number) => {
//     if (window.confirm("Are you sure you want to delete this banner?")) {
//       try {
//         await deleteBanner(id).unwrap();
//       } catch (err) {
//         console.error("Failed to delete banner:", err);
//       }
//     }
//   };

//   return (
//     <div className="m--container">
//       <main className="m--main">
//         <div className="m--header">
//           <h1 className="m--title">Banner Management</h1>
//         </div>

//         <div className="m--grid">
//           {/* Loading & Error States */}
//           {isLoading && <div className="m--loading">Loading banners...</div>}
//           {isError && <div className="m--error">Error loading banners.</div>}

//           {/* Banners List */}
//           {banners?.data?.map((banner: any) => (
//             <div className="m--card" key={banner._id || banner.id}>
//               <div className="m--card-media">
//                 <img
//                   alt="Banner"
//                   className="m--card-img"
//                   src={banner.image || banner.url} 
//                 />
//               </div>
//               <div className="m--card-content">
//                 <div className="m--card-header">
//                   <button
//                     className="m--card-btn m--card-btn-delete"
//                     onClick={() => handleDelete(banner._id || banner.id)}
//                   >
//                     <span className="material-symbols-outlined">delete</span>
//                   </button>
//                   <span className="m--card-date">
//                     {banner.createdAt ? new Date(banner.createdAt).toLocaleDateString() : "Recent"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>

//       <button className="m--fab" onClick={() => setIsModalOpen(true)}>
//         <span className="material-symbols-outlined m--fab-icon">add</span>
//       </button>

//       {isModalOpen && (
//         <div className="m--modal-overlay">
//           <div
//             className="m--modal-backdrop"
//             onClick={() => !isCreating && setIsModalOpen(false)}
//           ></div>

//           <div className="m--modal-container">
//             <div className="m--modal-header">
//               <h2 className="m--modal-title">Add New Banner</h2>
//               <button
//                 className="m--modal-close-btn"
//                 onClick={() => setIsModalOpen(false)}
//                 disabled={isCreating}
//               >
//                 <span className="material-symbols-outlined">close</span>
//               </button>
//             </div>

//             <div className="m--modal-body">
//               {/* Image Upload Area Only */}
//               <div className="m--form-field">
//                 <label className="m--form-label">Creative Asset</label>
//                 <div
//                   className={`m--upload-area ${
//                     dragOver ? "m--upload-area-dragover" : ""
//                   }`}
//                   onClick={() => fileInputRef.current?.click()}
//                   onDragOver={(e) => {
//                     e.preventDefault();
//                     setDragOver(true);
//                   }}
//                   onDragLeave={() => setDragOver(false)}
//                   onDrop={(e) => {
//                     e.preventDefault();
//                     setDragOver(false);
//                     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//                       setSelectedFile(e.dataTransfer.files[0]);
//                     }
//                   }}
//                 >
//                   <input
//                     type="file"
//                     accept=".jpg,.jpeg,.png,.webp"
//                     ref={fileInputRef}
//                     style={{ display: "none" }}
//                     onChange={(e) => {
//                       if (e.target.files && e.target.files[0]) {
//                         setSelectedFile(e.target.files[0]);
//                       }
//                     }}
//                   />
//                   <div className="m--upload-icon-wrapper">
//                     <span className="material-symbols-outlined m--upload-icon">
//                       upload_file
//                     </span>
//                   </div>
//                   <div className="m--upload-text">
//                     <p className="m--upload-title">
//                       {selectedFile
//                         ? `Selected: ${selectedFile.name}`
//                         : "Drag and drop image upload"}
//                     </p>
//                     <p className="m--upload-subtitle">
//                       Supports JPG, PNG, WebP (Max 10MB)
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="m--modal-footer">
//                 <button
//                   className="m--btn-save"
//                   onClick={handleSaveBanner}
//                   disabled={isCreating || !selectedFile}
//                 >
//                   {isCreating ? "Uploading..." : "Save Banner"}
//                 </button>
//                 <button
//                   className="m--btn-cancel"
//                   onClick={() => setIsModalOpen(false)}
//                   disabled={isCreating}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Banner;


"use client";
import React, { useState } from "react";
import "../../Style/Banner.css";
import {
  useGetAllBannersQuery,
  useCreateBannerMutation,
  useDeleteBannerMutation,
} from "@/redux/api/bannerApi";
import { toast } from "react-toastify"; // React-Toastify import kiya

const Banner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // RTK Query Hooks
  const { data: banners, isLoading, isError } = useGetAllBannersQuery({});
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const handleSaveBanner = async () => {
    if (!selectedFile) {
      toast.warn("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("bannerImage", selectedFile); 

    try {
      await createBanner(formData).unwrap();
      toast.success("Banner added successfully!"); // Success Toast
      setIsModalOpen(false);
      setSelectedFile(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add banner."); // Error Toast
      console.error(err);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteBanner(id).unwrap();
        toast.success("Banner deleted successfully!"); // Delete Toast
      } catch (err: any) {
        toast.error("Failed to delete banner.");
        console.error(err);
      }
    }
  };

  return (
    <div className="m--container">
      <main className="m--main">
        <div className="m--header">
          <h1 className="m--title">Banner Management</h1>
        </div>
        {isLoading && <div className="m--loading">Loading banners...</div>}
        {isError && <div className="m--error">Error loading banners.</div>}

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
                />
              </div>
              <div className="m--card-content">
                <div className="m--card-header">
                  <button
                    className="m--card-btn m--card-btn-delete"
                    onClick={() => handleDelete(banner._id || banner.id)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                  <span className="m--card-date">
                    <span className="material-symbols-outlined">
                      calendar_month
                    </span>
                    {banner.createdAt
                      ? new Date(banner.createdAt).toLocaleDateString()
                      : "Recent"}
                  </span>
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
            onClick={() => !isCreating && setIsModalOpen(false)}
          ></div>

          <div className="m--modal-container">
            <div className="m--modal-header">
              <h2 className="m--modal-title">Add New Banner</h2>
              <button
                className="m--modal-close-btn"
                onClick={() => setIsModalOpen(false)}
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

              <div className="m--modal-footer">
                <button
                  className="m--btn-save"
                  onClick={handleSaveBanner}
                  disabled={isCreating || !selectedFile}
                >
                  {isCreating ? "Uploading..." : "Save Banner"}
                </button>
                <button
                  className="m--btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;