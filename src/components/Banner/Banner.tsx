"use client";
import React, { useState } from "react";
import "../../Style/Banner.css";

const Banner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleSaveBanner = () => {
    // Handle save logic here
    console.log("Banner saved");
    setIsModalOpen(false);
  };

  return (
    <div className="m--container">
      <main className="m--main">
        {/* Header Section */}
        <div className="m--header">
          <span className="m--eyebrow">Editorial Gallery</span>
          <h1 className="m--title">Banner Management</h1>
        </div>

        {/* Featured Banner (The Curator Banner Signature Component) */}
        <section className="m--featured-section">
          <div className="m--featured-card">
            <img
              alt="Featured Banner"
              className="m--featured-img"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXsrR_bhnbp3J7gwyPamJaNE1OVKjFijATd18U-Bjo0LUMCJsW2Pwn-cVKE_LMXCJQ58M6doCFj_h_rBFlUOwD-MNU12-AnLSKhCdwZoc1WYZpqf_H-cj7lWDCDyeZjcNUCUdilbEpiTSF1lWfPWOUXidMu3w8lnUJxmGL4DTaT1cCy6g-5UThHzWA8wYWlyIcV3n3Alukm7FzmvvlaVxjkSQ8bpJz1ukgBfWelAZO6Pr7Yr0RVqzY5-yVxZzFHuKJ_Zorty9VPVXe"
            />
            <div className="m--featured-overlay"></div>
            <div className="m--featured-content">
              <h2 className="m--featured-headline">
                Summer Collection 2024 Launch Campaign
              </h2>
              <div className="m--featured-team">
                <span className="m--team-label">
                  Assigned to Editorial Team
                </span>
              </div>
            </div>
            <div className="m--featured-actions">
              <button className="m--icon-btn m--icon-btn-light">
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button className="m--icon-btn m--icon-btn-light">
                <span className="material-symbols-outlined">delete</span>
              </button>
              <button className="m--action-btn">Analytics Overview</button>
            </div>
          </div>
        </section>

        {/* Grid Header */}
        <div className="m--grid-header">
          <div className="m--filter-group">
            <h3 className="m--section-title">Recent Banners</h3>
            <div className="m--status-tabs">
              <span className="m--status-badge m--status-badge-active">
                All (12)
              </span>
              <span className="m--status-badge">Active (8)</span>
              <span className="m--status-badge">Drafts (4)</span>
            </div>
          </div>
          <div className="m--view-actions">
            <button className="m--view-btn">
              <span className="material-symbols-outlined">grid_view</span>
            </button>
            <button className="m--view-btn">
              <span className="material-symbols-outlined">list</span>
            </button>
          </div>
        </div>

        {/* Banners Grid */}
        <div className="m--grid">
          {/* Banner Card 1 */}
          <div className="m--card">
            <div className="m--card-media">
              <img
                alt="Tech Banner"
                className="m--card-img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxs2epM4xl75e7wRUXa84MzniCH2mNdKSyq7d0kf2QpXdF1HW2HiUELUMWm9g3UdW9ixVEP1vArzvsIkDYBwfWDEkI9sxa6AmNTDtuPviaJNKjZpfM4WmxQLrezqbS_UNCJt70fZtiDpjWT_XqeZ0J1kHubhqp7DbmCny6gGENrcDujjaszGP9d2O8_Cm4cheLEoNhY6z9mf7EMXoA6hiesN96W24orAsqkgGKwt7Zxvv_tcvmeDJDq1cTmzCvTXfsA6_4BkXkLXIk"
              />
              <div className="m--live-badge">
                <div className="m--live-dot"></div>
                <span className="m--live-text">LIVE</span>
              </div>
            </div>
            <div className="m--card-content">
              <div className="m--card-header">
                <h4 className="m--card-title">Retro Tech Showcase</h4>
                <span className="m--card-date">2d ago</span>
              </div>
              <p className="m--card-description">
                Promoting the vintage electronics auction happening next week on
                the main landing page.
              </p>
              <div className="m--card-actions">
                <div className="m--card-buttons-left">
                  <button className="m--card-btn">
                    <span className="material-symbols-outlined">
                      visibility
                    </span>
                  </button>
                  <button className="m--card-btn">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
                <button className="m--card-btn m--card-btn-delete">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Banner Card 2 */}
          <div className="m--card">
            <div className="m--card-media">
              <img
                alt="Fashion Banner"
                className="m--card-img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsHwKqucDEgXFg3Sx5ykGt1CA5ncfFX_kHJWRtaRM1A6dWfrUZcuSUrACPh7uYqUj5s4yCQMaSfTravFtYgU4bdFwm_e3X_OxYUCG2PjOyeNCrIO-V2cSbiMXelFFThtSBsMiAkgcdm5smIjG3jc6sRf5ZTDMoEAZg8H7ky6FDN2lph3z1roOltJMgNpOiZfyQD99Rrw7rdjwflg0AWc09W0B_w1Ve6c-ekIpgVEupcK0zhtGrQdFGzUep79yS1p2tIUrAHwNJeelt"
              />
              <div className="m--pending-badge">
                <div className="m--pending-dot"></div>
                <span className="m--pending-text">PENDING</span>
              </div>
            </div>
            <div className="m--card-content">
              <div className="m--card-header">
                <h4 className="m--card-title">Paris Autumn Look</h4>
                <span className="m--card-date">5h ago</span>
              </div>
              <p className="m--card-description">
                Seasonal fashion highlight focusing on European aesthetics and
                sustainable fabrics.
              </p>
              <div className="m--card-actions">
                <div className="m--card-buttons-left">
                  <button className="m--card-btn">
                    <span className="material-symbols-outlined">
                      visibility
                    </span>
                  </button>
                  <button className="m--card-btn">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
                <button className="m--card-btn m--card-btn-delete">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Banner Card 3 */}
          <div className="m--card">
            <div className="m--card-media">
              <img
                alt="Event Banner"
                className="m--card-img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_uVC42dCnB9ca6Z1EEfekNbik1tt9VtOl5hTJmoC-SUGvatWRyGfUUxc9UzPLIxXvSS1NFPy8l47NKKddLmy7PTggNaR7mhJaFUbjUzUOvv1Zio6tDHdeLI05kIhuvEkrCF31q_M2BWdd5vFAsPUxOMDozW5ALiUG3awR3qS8SRjbjCeUfLBFiNW4n8ggIXxTMzbftv8y0hYaULWfNYm5ZykuAMCJb66G6NvE46Y9qSL8sIzUYRoWPVgBa4XWJBqYOxrT6KiEOA6g"
              />
              <div className="m--live-badge">
                <div className="m--live-dot"></div>
                <span className="m--live-text">LIVE</span>
              </div>
            </div>
            <div className="m--card-content">
              <div className="m--card-header">
                <h4 className="m--card-title">Neon Nights Festival</h4>
                <span className="m--card-date">1w ago</span>
              </div>
              <p className="m--card-description">
                Global music event promotion banner with high-impact visuals and
                ticket CTAs.
              </p>
              <div className="m--card-actions">
                <div className="m--card-buttons-left">
                  <button className="m--card-btn">
                    <span className="material-symbols-outlined">
                      visibility
                    </span>
                  </button>
                  <button className="m--card-btn">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
                <button className="m--card-btn m--card-btn-delete">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile / Quick Create */}
      <button className="m--fab" onClick={() => setIsModalOpen(true)}>
        <span className="material-symbols-outlined m--fab-icon">add</span>
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="m--modal-overlay">
          {/* Backdrop Blur and Dim */}
          <div
            className="m--modal-backdrop"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Add New Banner Modal */}
          <div className="m--modal-container">
            {/* Modal Header */}
            <div className="m--modal-header">
              <h2 className="m--modal-title">Add New Banner</h2>
              <button
                className="m--modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="m--modal-body">
              {/* Banner Name Field */}
              <div className="m--form-field">
                <label className="m--form-label">Banner Name</label>
                <div className="m--input-wrapper">
                  <input
                    className="m--form-input"
                    placeholder="Enter a descriptive name for this campaign"
                    type="text"
                  />
                </div>
              </div>

              {/* Drag and Drop Image Upload Area */}
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
                    if (
                      e.dataTransfer.files &&
                      e.dataTransfer.files.length > 0
                    ) {
                      const file = e.dataTransfer.files[0];
                      setSelectedFile(file);
                      e.dataTransfer.clearData();
                    }
                  }}
                >
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
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

              {/* Footer Actions */}
              <div className="m--modal-footer">
                <button className="m--btn-save" onClick={handleSaveBanner}>
                  Save Banner
                </button>
                <button
                  className="m--btn-cancel"
                  onClick={() => setIsModalOpen(false)}
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
