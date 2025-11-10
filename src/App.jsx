import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import EmployeeList from "./components/EmployeeList";
import ScheduleCreator from "./components/ScheduleCreator";
import PaymentCalculator from "./components/PaymentCalculator";
import GLSLogo from "./components/GLSLogo";
import MobileNavigation from "./components/MobileNavigation";
import MobileFloatingActions from "./components/MobileFloatingActions";

function Navigation() {
  const location = useLocation();

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
    </nav>
  );
}

function App() {
  return (
    <Router>
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
            <Route path="/" element={<EmployeeList />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/schedule" element={<ScheduleCreator />} />
            <Route path="/payments" element={<PaymentCalculator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
