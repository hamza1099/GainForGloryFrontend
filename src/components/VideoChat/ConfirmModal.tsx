"use client";
import React from "react";
import { Modal, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import AppMessage from "@/constants/AppMessage";

type Props = {
  showConfirmModal: boolean;
  onPressConfirm: () => void;
  onPressClose: () => void;
};

const ConfirmModal = ({ showConfirmModal, onPressConfirm, onPressClose }: Props) => {
  return (
    <Modal
      open={showConfirmModal} // Antd mein 'show' ki jagah 'open' hota hai
      onCancel={onPressClose}
      centered
      footer={null} // Hum apna custom footer div use kar rahe hain isliye default ko null kiya
      closable={false} // Agar cross icon hide karna ho
      className="errorModal"
      width={400}
    >
      <div className="error_modal_content" style={{ textAlign: 'center', padding: '20px 0' }}>
        <div className="check-icon" style={{ marginBottom: '20px' }}>
          <FontAwesomeIcon
            icon={faCircleXmark as IconProp}
            className="uncheck_circle"
            style={{ fontSize: '50px', color: '#ff4d4f' }} // Custom red color for error
          />
        </div>
        
        <div className="error_text_content" style={{ fontSize: '18px', marginBottom: '30px', fontWeight: 500 }}>
          {AppMessage.callEndConfirmation}
        </div>

        <div className="error_end_btn" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button 
            onClick={onPressClose} 
            size="large"
            className="v_button"
          >
            Close
          </Button>
          <Button 
            type="primary" // Antd ka blue/brand color button
            danger // Agar call end hai toh red button ke liye 'danger' use karein
            onClick={onPressConfirm} 
            size="large"
            className="v_button"
          >
            Accept
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;