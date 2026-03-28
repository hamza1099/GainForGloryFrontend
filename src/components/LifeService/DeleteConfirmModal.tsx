import React from 'react'

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }: any) => {
  if (!isOpen) return null;
  return (
    <div className="m--modal-overlay">
      <div className="m--modal-container">
        <div style={{ fontSize: "40px", marginBottom: "10px" }}>⚠️</div>
        <h3>Are you sure?</h3>
        <p>You want to delete this service.</p>

        <div className="m--modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="m--btn-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal
