"use client";
import React from "react";
import { Modal } from "antd";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import AppMessage from "@/constants/AppMessage";

type Props = {
  showPermissionError: boolean;
  onPressPermissionsError: () => void;
};

const ErrorModal = ({ showPermissionError, onPressPermissionsError }: Props) => {
  return (
    <Modal
      open={showPermissionError} // antd v5+ mein 'open' use hota hai
      onCancel={onPressPermissionsError}
      centered
      footer={null} // Default OK/Cancel buttons hatane ke liye
      closable={false} // Agar cross icon hide karna ho
      className="errorModal"
      width={400}
    >
      <div className="error_modal_content" style={{ textAlign: "center", padding: "10px 0" }}>
        <div className="check-icon" style={{ marginBottom: "15px" }}>
          <FontAwesomeIcon
            icon={faCircleXmark as IconProp}
            className="uncheck_circle"
            style={{ fontSize: "50px", color: "#ff4d4f" }}
          />
        </div>
        
        <div 
          className="error_text_content" 
          style={{ fontSize: "16px", color: "#333", fontWeight: 500 }}
        >
          {AppMessage.permissionsMsg}
        </div>

        {/* Agar aapko button wapas chahiye ho toh isko uncomment karein */}
        {/* <div className="error_end_btn" style={{ marginTop: "20px" }}>
          <button
            onClick={onPressPermissionsError}
            className="v_button"
            style={{
               padding: "8px 25px",
               borderRadius: "6px",
               border: "none",
               cursor: "pointer"
            }}
          >
            Close
          </button>
        </div> 
        */}
      </div>
    </Modal>
  );
};

export default ErrorModal;