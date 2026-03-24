"use client";

import { useState } from "react";
import "../../Style/LifeGroupsManagement.css";

type TabType = "groups" | "requests";

interface LifeGroup {
  id: number;
  logo: string;
  logoColor: "blue" | "emerald" | "orange";
  title: string;
  description: string;
}

interface JoinRequest {
  id: number;
  userName: string;
  userInitials: string;
  groupRequested: string;
  status: "pending" | "approved" | "rejected";
}

interface ApplicationFormData {
  fullName: string;
  emailPhone: string;
  targetGroup: string;
  reasonForJoining: string;
  spiritualGoals: string;
  struggles: string;
  confidential: "yes" | "no" | null;
  commitment: "yes" | "no" | null;
  preferredTime: "Morning" | "Afternoon" | "Evening" | null;
  preferredDays: string[];
  notes: string;
}

const LifeGroup = () => {
  const [activeTab, setActiveTab] = useState<TabType>("groups");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<{
    name: string;
    email: string;
  } | null>(null);

  // Sample data
  const lifeGroups: LifeGroup[] = [
    {
      id: 1,
      logo: "Y",
      logoColor: "blue",
      title: "Youth Fellowship",
      description:
        "Community for ages 18-25 focusing on spiritual growth and leadership.",
    },
    {
      id: 2,
      logo: "M",
      logoColor: "emerald",
      title: "Morning Prayer",
      description:
        "Daily morning sessions for collective meditation and prayer.",
    },
    {
      id: 3,
      logo: "F",
      logoColor: "orange",
      title: "Family Circle",
      description:
        "Resources and support for growing families in the community.",
    },
  ];

  const joinRequests: JoinRequest[] = [
    {
      id: 1,
      userName: "John Doe",
      userInitials: "JD",
      groupRequested: "Youth Fellowship",
      status: "pending",
    },
    {
      id: 2,
      userName: "Sarah Adams",
      userInitials: "SA",
      groupRequested: "Family Circle",
      status: "pending",
    },
  ];

  // Modal form state
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: "Sarah Jenkins",
    emailPhone: "sarah.j@example.com",
    targetGroup: "Young Professionals - Downtown",
    reasonForJoining: "",
    spiritualGoals: "",
    struggles: "",
    confidential: null,
    commitment: null,
    preferredTime: "Afternoon",
    preferredDays: ["TUE", "WED"],
    notes: "",
  });

  const [selectedDays, setSelectedDays] = useState<string[]>(["TUE", "WED"]);

  const groupOptions = [
    "Young Professionals - Downtown",
    "Marriage Matters - Evening Group",
    "Men's Morning Study",
    "Women in Leadership",
  ];

  const timeOptions: Array<"Morning" | "Afternoon" | "Evening"> = [
    "Morning",
    "Afternoon",
    "Evening",
  ];

  const dayOptions = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const handleAddGroup = () => {
    console.log("Add new life group");
    // Implement add group functionality
  };

  const handleEditGroup = (id: number) => {
    console.log("Edit group", id);
    // Implement edit functionality
  };

  const handleDeleteGroup = (id: number) => {
    console.log("Delete group", id);
    // Implement delete functionality
  };

  const handleApproveRequest = (id: number) => {
    console.log("Approve request", id);
    // Find the request and open modal with applicant data
    const request = joinRequests.find((r) => r.id === id);
    if (request) {
      setSelectedApplicant({
        name: request.userName,
        email: `${request.userName.toLowerCase().replace(" ", ".")}@example.com`,
      });
      setFormData((prev) => ({
        ...prev,
        fullName: request.userName,
        emailPhone: `${request.userName.toLowerCase().replace(" ", ".")}@example.com`,
        targetGroup: request.groupRequested,
      }));
      setIsModalOpen(true);
    }
  };

  const handleRejectRequest = (id: number) => {
    console.log("Reject request", id);
    // Implement reject functionality
  };

  const handlePrevPage = () => {
    console.log("Previous page");
    // Implement pagination
  };

  const handleNextPage = () => {
    console.log("Next page");
    // Implement pagination
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
    // Reset form to default values
    setFormData({
      fullName: "Sarah Jenkins",
      emailPhone: "sarah.j@example.com",
      targetGroup: "Young Professionals - Downtown",
      reasonForJoining: "",
      spiritualGoals: "",
      struggles: "",
      confidential: null,
      commitment: null,
      preferredTime: "Afternoon",
      preferredDays: ["TUE", "WED"],
      notes: "",
    });
    setSelectedDays(["TUE", "WED"]);
  };

  const handleModalSubmit = () => {
    console.log("Submit application", formData);
    // Implement submit functionality
    alert("Application submitted successfully!");
    handleModalClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: "yes" | "no") => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeSelect = (time: "Morning" | "Afternoon" | "Evening") => {
    setFormData((prev) => ({ ...prev, preferredTime: time }));
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) => {
      const newDays = prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day];
      setFormData((prevData) => ({ ...prevData, preferredDays: newDays }));
      return newDays;
    });
  };

  const getLogoClass = (color: string): string => {
    switch (color) {
      case "blue":
        return "m--logo-blue";
      case "emerald":
        return "m--logo-emerald";
      case "orange":
        return "m--logo-orange";
      default:
        return "m--logo-blue";
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
          <button className="m--btn-primary" onClick={handleAddGroup}>
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
                Join Requests
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
                        <th>#</th>
                        <th>Logo</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lifeGroups.map((group) => (
                        <tr key={group.id}>
                          <td>{group.id}</td>
                          <td>
                            <div
                              className={`m--logo-circle ${getLogoClass(group.logoColor)}`}
                            >
                              {group.logo}
                            </div>
                          </td>
                          <td className="font-semibold">{group.title}</td>
                          <td className="m--desc">{group.description}</td>
                          <td className="text-right">
                            <button
                              className="m--btn-edit"
                              onClick={() => handleEditGroup(group.id)}
                            >
                              Edit
                            </button>
                            <button
                              className="m--btn-delete"
                              onClick={() => handleDeleteGroup(group.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Requests Panel */}
            {activeTab === "requests" && (
              <div className="m--tab-panel-content">
                <div className="m--table-wrapper">
                  <table className="m--table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Group Requested</th>
                        <th>Status</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {joinRequests.map((request) => (
                        <tr key={request.id}>
                          <td>
                            <div className="m--user-cell">
                              <div className="m--user-avatar">
                                {request.userInitials}
                              </div>
                              <span>{request.userName}</span>
                            </div>
                          </td>
                          <td>{request.groupRequested}</td>
                          <td>
                            <span className="m--badge-pending">
                              Pending
                              <svg viewBox="0 0 24 24">
                                <path
                                  d="M19 9l-7 7-7-7"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          </td>
                          <td className="text-right">
                            <button
                              className="m--btn-approve"
                              onClick={() => handleApproveRequest(request.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="m--btn-reject"
                              onClick={() => handleRejectRequest(request.id)}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            <div className="m--pagination">
              <button className="m--pagination-prev" onClick={handlePrevPage}>
                <svg viewBox="0 0 24 24">
                  <path
                    d="M15 19l-7-7 7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="m--page-indicator">1</span>
              <button className="m--pagination-next" onClick={handleNextPage}>
                <svg viewBox="0 0 24 24">
                  <path
                    d="M9 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Application Modal - Light Mode Only */}
      {isModalOpen && (
        <div className="m--modal-overlay">
          <div className="m--modal-container">
            {/* Modal Header */}
            <div className="m--modal-header">
              <div>
                <h2 className="m--modal-title">Life Group Application</h2>
                <p className="m--modal-subtitle">
                  Please review the application details below.
                </p>
              </div>
              <button className="m--modal-close" onClick={handleModalClose}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="m--modal-body">
              {/* 1. Full Name & 2. Email/Phone */}
              <section className="m--form-row">
                <div className="m--form-group">
                  <label className="m--form-label">1. Full Name</label>
                  <input
                    className="m--form-input"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
                <div className="m--form-group">
                  <label className="m--form-label">2. Email / Phone</label>
                  <input
                    className="m--form-input"
                    type="text"
                    name="emailPhone"
                    value={formData.emailPhone}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
              </section>

              {/* 3. Target Life Group */}
              <section className="m--form-section">
                <label className="m--form-label">
                  3. Which Life Group are you applying to?
                </label>
                <select
                  className="m--form-select"
                  name="targetGroup"
                  value={formData.targetGroup}
                  onChange={handleInputChange}
                >
                  {groupOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </section>

              {/* 4, 5, 6. Narrative Questions */}
              <section className="m--form-section">
                <div className="m--form-group">
                  <label className="m--form-label">
                    4. Why do you want to join this group?
                  </label>
                  <textarea
                    className="m--form-textarea"
                    name="reasonForJoining"
                    value={formData.reasonForJoining}
                    onChange={handleInputChange}
                    placeholder="Share your reasons for interest..."
                  />
                </div>

                <div className="m--form-group">
                  <label className="m--form-label">
                    5. What are you hoping God grows in you during this season?
                  </label>
                  <textarea
                    className="m--form-textarea"
                    name="spiritualGoals"
                    value={formData.spiritualGoals}
                    onChange={handleInputChange}
                    placeholder="Spiritual growth goals..."
                  />
                </div>

                <div className="m--form-group">
                  <label className="m--form-label">
                    6. What's your biggest struggle right now related to this
                    group topic?
                  </label>
                  <textarea
                    className="m--form-textarea"
                    name="struggles"
                    value={formData.struggles}
                    onChange={handleInputChange}
                    placeholder="Be as open as you're comfortable with..."
                  />
                </div>
              </section>

              {/* 7 & 10. Yes/No Questions */}
              <section className="m--form-highlight">
                <div className="m--form-row">
                  <span className="m--form-label">
                    7. Are you willing to keep this group confidential and
                    respectful?
                  </span>
                  <div className="m--radio-group">
                    <label className="m--radio-label">
                      <input
                        type="radio"
                        name="confidential"
                        className="m--radio-input"
                        checked={formData.confidential === "yes"}
                        onChange={() =>
                          handleRadioChange("confidential", "yes")
                        }
                      />
                      <span>Yes</span>
                    </label>
                    <label className="m--radio-label">
                      <input
                        type="radio"
                        name="confidential"
                        className="m--radio-input"
                        checked={formData.confidential === "no"}
                        onChange={() => handleRadioChange("confidential", "no")}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div className="m--form-row">
                  <span className="m--form-label">
                    10. Commitment: Can you attend at least 3 out of 4 weeks
                    each month?
                  </span>
                  <div className="m--radio-group">
                    <label className="m--radio-label">
                      <input
                        type="radio"
                        name="commitment"
                        className="m--radio-input"
                        checked={formData.commitment === "yes"}
                        onChange={() => handleRadioChange("commitment", "yes")}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="m--radio-label">
                      <input
                        type="radio"
                        name="commitment"
                        className="m--radio-input"
                        checked={formData.commitment === "no"}
                        onChange={() => handleRadioChange("commitment", "no")}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* 8 & 9. Time & Day Preferences */}
              <section className="m--form-row">
                <div className="m--form-group">
                  <label className="m--form-label">
                    8. Preferred meeting time (pick one)
                  </label>
                  <div className="m--time-buttons">
                    {timeOptions.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`m--time-button ${
                          formData.preferredTime === time ? "active" : ""
                        }`}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="m--form-group">
                  <label className="m--form-label">
                    9. Preferred meeting day (multi-select)
                  </label>
                  <div className="m--day-buttons">
                    {dayOptions.map((day) => (
                      <label
                        key={day}
                        className={`m--day-label ${
                          selectedDays.includes(day) ? "selected" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="m--day-checkbox"
                          checked={selectedDays.includes(day)}
                          onChange={() => handleDayToggle(day)}
                        />
                        <span>{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              {/* 11. Optional Notes */}
              <div className="m--form-group">
                <label className="m--form-label">
                  11. Any notes you want the leader to know? (Optional)
                </label>
                <textarea
                  className="m--form-textarea"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any extra details..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="m--modal-footer">
              <button className="m--btn-secondary" onClick={handleModalClose}>
                Cancel
              </button>
              <button className="m--btn-primary" onClick={handleModalSubmit}>
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LifeGroup;
