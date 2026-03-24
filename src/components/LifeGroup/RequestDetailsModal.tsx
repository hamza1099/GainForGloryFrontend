export const RequestDetailsModal = ({ request, onClose }: { request: any, onClose: () => void }) => {
  if (!request) return null;

  // API se aane wale data ko map karein
  const responses = request.formResponses || {};

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
              <input className="m--form-input" value={request.user?.name || ""} readOnly />
            </div>
            <div className="m--form-group">
              <label className="m--form-label">Email / Phone</label>
              <input className="m--form-input" value={request.user?.email || request.user?.phone || "N/A"} readOnly />
            </div>
          </section>

          {/* Questions Section */}
          <section className="m--form-section">
            <div className="m--form-group">
              <label className="m--form-label">Why do you want to join this group?</label>
              <textarea className="m--form-textarea" value={responses.whyJoinGroup || "No response"} readOnly />
            </div>

            <div className="m--form-group">
              <label className="m--form-label">Spiritual Goals</label>
              <textarea className="m--form-textarea" value={responses.spiritualGrowthGoal || "No response"} readOnly />
            </div>

            <div className="m--form-group">
              <label className="m--form-label">Current Struggles</label>
              <textarea className="m--form-textarea" value={responses.biggestStruggle || "No response"} readOnly />
            </div>
          </section>

          {/* Preferences Row */}
          <section className="m--form-row">
             <div className="m--form-group">
              <label className="m--form-label">Preferred Time</label>
              <input className="m--form-input" value={responses.preferredMeetingTime || "N/A"} readOnly />
            </div>
            <div className="m--form-group">
              <label className="m--form-label">Preferred Days</label>
              <input className="m--form-input" value={responses.preferredMeetingDays?.join(", ") || "N/A"} readOnly />
            </div>
          </section>
        </div>

        <div className="m--modal-footer">
          <button className="m--btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};