import React, { useState } from "react";
import { useLocation } from "react-router-dom";

function MobileFloatingActions() {
  const location = useLocation();
  const [showActions, setShowActions] = useState(false);

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  const getQuickActions = () => {
    switch (location.pathname) {
      case "/employees":
        return [
          {
            label: "Add Employee",
            icon: "➕",
            action: () => {
              // Trigger add employee form
              const addButton = document.querySelector(
                '[onClick*="setShowForm"]'
              );
              if (addButton) addButton.click();
            },
          },
        ];
      case "/schedule":
        return [
          {
            label: "Export PDF",
            icon: "📄",
            action: () => {
              const exportButton = document.querySelector(
                '[onClick*="handleExportPDF"]'
              );
              if (exportButton) exportButton.click();
            },
          },
          {
            label: "Export Summary",
            icon: "📊",
            action: () => {
              const summaryButton = document.querySelector(
                '[onClick*="handleExportSummary"]'
              );
              if (summaryButton) summaryButton.click();
            },
          },
        ];
      case "/payments":
        return [
          {
            label: "Calculate",
            icon: "🧮",
            action: () => {
              const calculateButton = document.querySelector(
                '[onClick*="handleCalculate"]'
              );
              if (calculateButton) calculateButton.click();
            },
          },
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  if (quickActions.length === 0) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="floating-action-btn"
        onClick={toggleActions}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: "50%",
          width: "56px",
          height: "56px",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          transform: showActions ? "rotate(45deg)" : "rotate(0deg)",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = showActions
            ? "rotate(45deg) scale(1.1)"
            : "rotate(0deg) scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = showActions
            ? "rotate(45deg) scale(1)"
            : "rotate(0deg) scale(1)";
        }}
      >
        {showActions ? "✕" : "⚡"}
      </button>

      {/* Quick Actions Menu */}
      {showActions && (
        <div
          className="floating-actions-menu"
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            animation: "slideInUp 0.3s ease",
          }}
        >
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-btn"
              onClick={() => {
                action.action();
                setShowActions(false);
              }}
              style={{
                background: "white",
                border: "2px solid #e1e5e9",
                borderRadius: "25px",
                padding: "12px 20px",
                color: "#333",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                minWidth: "140px",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f8f9fa";
                e.target.style.transform = "translateX(-5px)";
                e.target.style.borderColor = "#667eea";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "white";
                e.target.style.transform = "translateX(0)";
                e.target.style.borderColor = "#e1e5e9";
              }}
            >
              <span style={{ fontSize: "18px" }}>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close menu */}
      {showActions && (
        <div
          className="floating-actions-overlay"
          onClick={() => setShowActions(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 998,
            background: "transparent",
          }}
        />
      )}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .floating-action-btn {
            display: flex !important;
          }
        }

        @media (min-width: 769px) {
          .floating-action-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default MobileFloatingActions;






