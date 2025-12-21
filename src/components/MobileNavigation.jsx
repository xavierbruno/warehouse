import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function MobileNavigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    {
      path: "/employees",
      label: "Employees",
      icon: "👥",
      description: "Manage employees",
    },
    {
      path: "/schedule",
      label: "Schedule",
      icon: "📅",
      description: "Create schedules",
    },
    {
      path: "/payments",
      label: "Payments",
      icon: "💰",
      description: "Calculate payments",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={toggleMenu}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1001,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
        }}
      >
        {isMenuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={closeMenu}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="mobile-menu-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              maxWidth: "350px",
              width: "90%",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              animation: "slideInUp 0.3s ease",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "30px",
                color: "#333",
                fontSize: "1.5rem",
              }}
            >
              📱 Navigation
            </h3>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`mobile-nav-item ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    padding: "20px",
                    borderRadius: "15px",
                    textDecoration: "none",
                    color: location.pathname === item.path ? "white" : "#333",
                    background:
                      location.pathname === item.path
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : "#f8f9fa",
                    transition: "all 0.3s ease",
                    border: "2px solid transparent",
                    fontSize: "18px",
                    fontWeight: "600",
                    minHeight: "60px",
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.background = "#e9ecef";
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.background = "#f8f9fa";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  <span style={{ fontSize: "24px" }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: "600" }}>{item.label}</div>
                    <div
                      style={{
                        fontSize: "14px",
                        opacity: 0.7,
                        marginTop: "2px",
                      }}
                    >
                      {item.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: "30px",
                padding: "15px",
                background: "#f8f9fa",
                borderRadius: "10px",
                fontSize: "14px",
                color: "#666",
              }}
            >
              💡 Tap outside to close
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default MobileNavigation;






