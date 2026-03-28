export const RequestDetailsModal = ({
  request,
  onClose,
}: {
  request: any;
  onClose: () => void;
}) => {
  if (!request) return null;

  // API se aane wale data ko map karein
  const responses = request.formResponses || {};

  const renderBoolean = (value: boolean | undefined) => {
    return (
      <div style={{ display: "flex", gap: "20px", marginTop: "6px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input type="radio" checked={value === true} readOnly />
          Yes
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input type="radio" checked={value === false} readOnly />
          No
        </label>
      </div>
    );
  };

  return (
    <div className="m--modal-overlay">
      <div className="m--modal-container" style={{ maxWidth: "700px" }}>
        <div className="m--modal-header">
          <h2>Application Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="m--modal-body">
          {/* User Info Row */}
          <section className="m--form-row">
            <div className="m--form-group">
              <label className="m--form-label">Full Name</label>
              <input
                className="m--form-input"
                value={request.user?.name || ""}
                readOnly
              />
            </div>
            <div className="m--form-group">
              <label className="m--form-label">Email / Phone</label>
              <input
                className="m--form-input"
                value={request.user?.email || request.user?.phone || "N/A"}
                readOnly
              />
            </div>
          </section>

          {/* Questions Section */}
          <section className="m--form-section">
            <div className="m--form-group">
              <label className="m--form-label">
                Why do you want to join this group?
              </label>
              <textarea
                className="m--form-textarea"
                value={responses.whyJoinGroup || "No response"}
                readOnly
              />
            </div>

            <div className="m--form-group">
              <label className="m--form-label">
                What are you hoping God grows in you during this season?
              </label>
              <textarea
                className="m--form-textarea"
                value={responses.spiritualGrowthGoal || "No response"}
                readOnly
              />
            </div>

            <div className="m--form-group">
              <label className="m--form-label">
                What’s your biggest struggle right now related to this group
                topic?
              </label>
              <textarea
                className="m--form-textarea"
                value={responses.biggestStruggle || "No response"}
                readOnly
              />
            </div>
            <div className="m--form-group">
              <label className="m--form-label">
                Are you willing to keep this group confidential and respectful?
              </label>
              {renderBoolean(responses.confidentialAgreement)}
            </div>

            <div className="m--form-group">
              <label className="m--form-label">
                Commitment: Can you attend at least 3 out of 4 weeks each month?
              </label>
              {renderBoolean(responses.commitment)}
            </div>
            <div className="m--form-group">
              <label className="m--form-label">
                Any notes you want the leader to know?
              </label>
              <textarea
                className="m--form-textarea"
                value={responses.leaderNotes || "No response"}
                readOnly
              />
            </div>
          </section>

          {/* Preferences Row */}
          <section className="m--form-row">
            <div className="m--form-group">
              <label className="m--form-label">Preferred meeting time</label>
              <input
                className="m--form-input"
                value={responses.preferredMeetingTime || "N/A"}
                readOnly
              />
            </div>
            <div className="m--form-group">
              <label className="m--form-label">Preferred meeting day</label>
              <input
                className="m--form-input"
                value={responses.preferredMeetingDays?.join(", ") || "N/A"}
                readOnly
              />
            </div>
          </section>
        </div>

        <div className="m--modal-footer">
          <button className="m--btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
