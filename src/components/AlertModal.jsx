import React from "react";

function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info", // info, warning, error, success
  showCancel = false,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getColor = () => {
    switch (type) {
      case "success":
        return "#28a745";
      case "warning":
        return "#ffc107";
      case "error":
        return "#dc3545";
      default:
        return "#667eea";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          textAlign: "center",
          animation: "modalSlideIn 0.3s ease-out",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "20px" }}>
          {getIcon()}
        </div>

        <h3
          style={{
            color: getColor(),
            marginBottom: "20px",
            fontSize: "1.5rem",
            fontWeight: "600",
          }}
        >
          {title}
        </h3>

        <div
          style={{
            marginBottom: "25px",
            fontSize: "16px",
            lineHeight: "1.5",
            color: "#333",
            whiteSpace: "pre-line",
          }}
        >
          {message}
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {showCancel && (
            <button
              className="btn btn-danger"
              onClick={onCancel || onClose}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                minWidth: "120px",
              }}
            >
              {cancelText}
            </button>
          )}

          <button
            className="btn"
            onClick={onConfirm || onClose}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              minWidth: "120px",
              background: `linear-gradient(135deg, ${getColor()} 0%, ${getColor()}dd 100%)`,
              color: "white",
              border: "none",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;



