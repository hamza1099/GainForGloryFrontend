"use client";

import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  message?: string;
}

const DeleteConfirmModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
}) => {
  if (!isOpen) return null;

  return (
    <div className="m--modal-overlay">
      <div className="m--modal">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="m--modal-actions">
          <button
            className="m--btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="m--btn-delete"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
