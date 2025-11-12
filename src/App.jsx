import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import EmployeeList from "./components/EmployeeList";
import ScheduleCreator from "./components/ScheduleCreator";
import PaymentCalculator from "./components/PaymentCalculator";
import GLSLogo from "./components/GLSLogo";
import MobileNavigation from "./components/MobileNavigation";
import MobileFloatingActions from "./components/MobileFloatingActions";

function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <Link
        to="/employees"
        className={location.pathname === "/employees" ? "active" : ""}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        👥 Employees
      </Link>
      <Link
        to="/schedule"
        className={location.pathname === "/schedule" ? "active" : ""}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        📅 Create Schedule
      </Link>
      <Link
        to="/payments"
        className={location.pathname === "/payments" ? "active" : ""}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        💰 Payment Calculator
      </Link>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <span style={{ fontSize: "14px", color: "#FFD700", fontWeight: "600" }}>
          👤 {user?.username}
        </span>
        <button
          onClick={logout}
          style={{
            padding: "8px 16px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Sair
        </button>
      </div>
    </nav>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  if (isLoginPage) {
    return <Login />;
  }

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <GLSLogo size="large" />
            <h1
              style={{
                background: "linear-gradient(45deg, #fff, #f0f8ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: "2rem",
                fontWeight: "600",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                margin: "0",
                textAlign: "center",
              }}
            >
              Warehouse Schedule Control System
            </h1>
          </div>
          <Navigation />
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Mobile Floating Actions */}
      <MobileFloatingActions />

      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <ScheduleCreator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <PaymentCalculator />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
