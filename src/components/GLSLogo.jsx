import React from "react";

const GLSLogo = ({ size = "medium", className = "" }) => {
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { fontSize: "16px", height: "24px" };
      case "large":
        return { fontSize: "48px", height: "72px" };
      case "medium":
      default:
        return { fontSize: "32px", height: "48px" };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <div
      className={`gls-logo ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        ...sizeStyles,
      }}
    >
      <span
        style={{
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          fontSize: "inherit",
          color: "white",
          letterSpacing: "1px",
        }}
      >
        GLS
      </span>
      <div
        style={{
          width: "12px",
          height: "12px",
          backgroundColor: "var(--gls-yellow)",
          borderRadius: "50%",
          flexShrink: 0,
        }}
      />
    </div>
  );
};

export default GLSLogo;
