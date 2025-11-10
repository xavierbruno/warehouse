import React, { useState } from "react";
import { useEmployees } from "../hooks/useEmployees";
import AlertModal from "./AlertModal";

function EmployeeList() {
  const { employees, addEmployee, deleteEmployee, updateEmployee } =
    useEmployees();
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    phone: "",
    email: "",
    birthDate: "",
    documentType: "",
    visaExpiryDate: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    position: "",
    phone: "",
    email: "",
    birthDate: "",
    documentType: "",
    visaExpiryDate: "",
  });
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showAlert = (title, message, type = "info") => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeAlert = () => {
    setAlertModal({
      isOpen: false,
      title: "",
      message: "",
      type: "info",
    });
  };

  const showConfirm = (title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const closeConfirm = () => {
    setConfirmModal({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  const handleConfirm = () => {
    if (confirmModal.onConfirm) {
      confirmModal.onConfirm();
    }
    closeConfirm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newEmployee.name.trim()) {
      addEmployee(newEmployee);
      setNewEmployee({
        name: "",
        position: "",
        phone: "",
        email: "",
        birthDate: "",
        documentType: "",
        visaExpiryDate: "",
      });
      setShowForm(false);
    }
  };

  const handleDelete = (id) => {
    showConfirm(
      "Confirm Removal",
      "Are you sure you want to remove this employee?",
      () => {
        deleteEmployee(id);
      }
    );
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee.id);
    setEditForm({
      name: employee.name,
      position: employee.position,
      phone: employee.phone,
      email: employee.email,
      birthDate: employee.birthDate,
      documentType: employee.documentType,
      visaExpiryDate: employee.visaExpiryDate || "",
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editForm.name.trim()) {
      updateEmployee(editingEmployee, editForm);
      setEditingEmployee(null);
      setEditForm({
        name: "",
        position: "",
        phone: "",
        email: "",
        birthDate: "",
        documentType: "",
        visaExpiryDate: "",
      });
      showAlert("Success", "Employee updated successfully!", "success");
    }
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
    setEditForm({
      name: "",
      position: "",
      phone: "",
      email: "",
      birthDate: "",
      documentType: "",
      visaExpiryDate: "",
    });
  };

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          👥 Employee List
        </h2>
        <button
          className="btn"
          onClick={() => setShowForm(!showForm)}
          style={{
            background: showForm
              ? "linear-gradient(135deg, #dc3545 0%, #c82333 100%)"
              : "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
            boxShadow: showForm
              ? "0 8px 25px rgba(220, 53, 69, 0.3)"
              : "0 8px 25px rgba(40, 167, 69, 0.3)",
          }}
        >
          {showForm ? "❌ Cancel" : "➕ Add Employee"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: "30px",
            padding: "30px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3
            style={{ marginBottom: "25px", color: "#333", fontSize: "1.5rem" }}
          >
            ✨ Add New Employee
          </h3>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newEmployee.name}
              onChange={handleInputChange}
              required
              placeholder="Ex: John Smith"
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Position *</label>
            <select
              id="position"
              name="position"
              value={newEmployee.position}
              onChange={handleInputChange}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e1e5e9",
                borderRadius: "12px",
                fontSize: "16px",
                transition: "all 0.3s ease",
                background: "rgba(255, 255, 255, 0.9)",
              }}
            >
              <option value="">Select position</option>
              <option value="Operator">
                Operator (€13.50/h - €23/h Sunday)
              </option>
              <option value="Supervisor">
                Supervisor (€15/h - €25/h Sunday)
              </option>
            </select>
            <small
              style={{
                color: "#666",
                fontSize: "12px",
                marginTop: "5px",
                display: "block",
              }}
            >
              💡 Position determines hourly rate
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={newEmployee.phone}
              onChange={handleInputChange}
              placeholder="Ex: +1 (555) 123-4567"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={newEmployee.email}
              onChange={handleInputChange}
              placeholder="Ex: john@company.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">Birth Date</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={newEmployee.birthDate}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e1e5e9",
                borderRadius: "12px",
                fontSize: "16px",
                transition: "all 0.3s ease",
                background: "rgba(255, 255, 255, 0.9)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--gls-blue)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e1e5e9";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            />
            <small
              style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}
            >
              💡 Employee's date of birth
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="documentType">Document Type</label>
            <select
              id="documentType"
              name="documentType"
              value={newEmployee.documentType}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e1e5e9",
                borderRadius: "12px",
                fontSize: "16px",
                transition: "all 0.3s ease",
                background: "rgba(255, 255, 255, 0.9)",
              }}
            >
              <option value="">Select document type</option>
              <option value="European Passport">European Passport</option>
              <option value="Stamp1">Stamp1</option>
              <option value="Stamp2">Stamp2</option>
              <option value="Stamp4">Stamp4</option>
            </select>
            <small
              style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}
            >
              💡 Stamp2 employees have a 20h weekly limit
            </small>
          </div>

          {/* Visa Expiry Date - Only show for Stamp1, Stamp2, or Stamp4 */}
          {(newEmployee.documentType === "Stamp1" ||
            newEmployee.documentType === "Stamp2" ||
            newEmployee.documentType === "Stamp4") && (
            <div className="form-group">
              <label htmlFor="visaExpiryDate">Visa Expiry Date *</label>
              <input
                type="date"
                id="visaExpiryDate"
                name="visaExpiryDate"
                value={newEmployee.visaExpiryDate}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "12px",
                  fontSize: "16px",
                  transition: "all 0.3s ease",
                  background: "rgba(255, 255, 255, 0.9)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--gls-blue)";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e1e5e9";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <small
                style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}
              >
                🛂 Visa expiry date for {newEmployee.documentType} employees
              </small>
            </div>
          )}

          <button
            type="submit"
            className="btn"
            style={{
              marginTop: "20px",
              padding: "16px 32px",
              fontSize: "18px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
              boxShadow: "0 8px 25px rgba(40, 167, 69, 0.3)",
            }}
          >
            🚀 Add Employee
          </button>
        </form>
      )}

      {employees.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <h3>No employees registered</h3>
          <p>Click "Add Employee" to get started</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {employees.map((employee) => (
            <div key={employee.id} className="employee-card">
              {editingEmployee === employee.id ? (
                <form onSubmit={handleSaveEdit} className="edit-form">
                  <h3
                    style={{ marginBottom: "20px", color: "var(--gls-blue)" }}
                  >
                    ✏️ Edit Employee
                  </h3>

                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditInputChange}
                      placeholder="Ex: John Smith"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Position *</label>
                    <select
                      name="position"
                      value={editForm.position}
                      onChange={handleEditInputChange}
                      required
                    >
                      <option value="">Select position</option>
                      <option value="Operator">
                        Operator (€13.50/h - €23/h Sunday)
                      </option>
                      <option value="Supervisor">
                        Supervisor (€15/h - €25/h Sunday)
                      </option>
                    </select>
                    <small>💡 Position determines hourly rate</small>
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditInputChange}
                      placeholder="Ex: +1 (555) 123-4567"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditInputChange}
                      placeholder="Ex: john@company.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Birth Date</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={editForm.birthDate}
                      onChange={handleEditInputChange}
                    />
                    <small>💡 Employee's date of birth</small>
                  </div>

                  <div className="form-group">
                    <label>Document Type</label>
                    <select
                      name="documentType"
                      value={editForm.documentType}
                      onChange={handleEditInputChange}
                    >
                      <option value="">Select document type</option>
                      <option value="European Passport">
                        European Passport
                      </option>
                      <option value="Stamp1">Stamp1</option>
                      <option value="Stamp2">Stamp2</option>
                      <option value="Stamp4">Stamp4</option>
                    </select>
                    <small>💡 Stamp2 employees have a 20h weekly limit</small>
                  </div>

                  {/* Visa Expiry Date - Only show for Stamp1, Stamp2, or Stamp4 */}
                  {(editForm.documentType === "Stamp1" ||
                    editForm.documentType === "Stamp2" ||
                    editForm.documentType === "Stamp4") && (
                    <div className="form-group">
                      <label>Visa Expiry Date *</label>
                      <input
                        type="date"
                        name="visaExpiryDate"
                        value={editForm.visaExpiryDate}
                        onChange={handleEditInputChange}
                        required
                      />
                      <small>
                        🛂 Visa expiry date for {editForm.documentType}{" "}
                        employees
                      </small>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <button type="submit" className="btn">
                      ✅ Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleCancelEdit}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3>{employee.name}</h3>
                  {employee.position && (
                    <p>
                      <strong>Position:</strong> {employee.position}
                    </p>
                  )}
                  {employee.phone && (
                    <p>
                      <strong>Phone:</strong> {employee.phone}
                    </p>
                  )}
                  {employee.email && (
                    <p>
                      <strong>Email:</strong> {employee.email}
                    </p>
                  )}
                  {employee.birthDate && (
                    <p>
                      <strong>Birth Date:</strong>{" "}
                      {new Date(employee.birthDate).toLocaleDateString("en-US")}
                    </p>
                  )}
                  {employee.documentType && (
                    <p>
                      <strong>Document:</strong> {employee.documentType}
                    </p>
                  )}
                  {employee.visaExpiryDate && (
                    <p>
                      <strong>Visa Expiry:</strong>{" "}
                      {new Date(employee.visaExpiryDate).toLocaleDateString(
                        "en-US"
                      )}
                      {new Date(employee.visaExpiryDate) < new Date() && (
                        <span
                          style={{
                            color: "#dc3545",
                            fontWeight: "bold",
                            marginLeft: "8px",
                          }}
                        >
                          ⚠️ EXPIRED
                        </span>
                      )}
                    </p>
                  )}
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#999",
                      marginTop: "10px",
                    }}
                  >
                    Registered on:{" "}
                    {new Date(employee.createdAt).toLocaleDateString("en-US")}
                  </p>
                  {employee.updatedAt && (
                    <p style={{ fontSize: "12px", color: "#999" }}>
                      Last updated:{" "}
                      {new Date(employee.updatedAt).toLocaleDateString("en-US")}
                    </p>
                  )}
                  <div
                    style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                  >
                    <button
                      className="btn"
                      onClick={() => handleEdit(employee)}
                      style={{
                        background:
                          "linear-gradient(135deg, #ffcc00 0%, #ffb300 100%)",
                        color: "#000000",
                        fontSize: "14px",
                        padding: "8px 16px",
                        fontWeight: "600",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(employee.id)}
                      style={{
                        fontSize: "14px",
                        padding: "8px 16px",
                      }}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />

      {/* Confirm Modal */}
      <AlertModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type="warning"
        showCancel={true}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
        confirmText="Yes, Remove"
        cancelText="Cancel"
      />
    </div>
  );
}

export default EmployeeList;
