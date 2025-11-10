import React, { useState, useEffect } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEmployees } from "../hooks/useEmployees";
import { useSchedules } from "../hooks/useSchedules";
import {
  calculateHours,
  formatTime12Hour,
  getHourlyRate,
} from "../utils/timeUtils";

function PaymentCalculator() {
  const { employees } = useEmployees();
  const { schedules } = useSchedules();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [paymentData, setPaymentData] = useState({});

  const daysOfWeek = [
    { key: "monday", name: "Monday" },
    { key: "tuesday", name: "Tuesday" },
    { key: "wednesday", name: "Wednesday" },
    { key: "thursday", name: "Thursday" },
    { key: "friday", name: "Friday" },
    { key: "saturday", name: "Saturday" },
    { key: "sunday", name: "Sunday" },
  ];

  const getWeekKey = (date) => {
    return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
  };

  const getWeekDates = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return daysOfWeek.map((_, index) => addDays(start, index));
  };

  const calculateEmployeePayments = () => {
    const currentWeekKey = getWeekKey(selectedWeek);
    const weekSchedules = schedules[currentWeekKey] || {};
    const payments = {};

    employees.forEach((employee) => {
      payments[employee.id] = {
        name: employee.name,
        position: employee.position,
        totalHours: 0,
        totalPayment: 0,
        dailyBreakdown: {},
        schedules: [],
      };
    });

    // Processar cada dia da semana
    daysOfWeek.forEach((day) => {
      const daySchedules = weekSchedules[day.key] || [];

      daySchedules.forEach((schedule) => {
        const employeeId = schedule.employeeId;
        if (payments[employeeId]) {
          const hours = calculateHours(schedule.startTime, schedule.endTime);
          const employee = employees.find(
            (emp) => emp.id === parseInt(employeeId)
          );
          const rate = getHourlyRate(employee?.position || "Operador", day.key);
          const dayPayment = hours * rate;

          payments[employeeId].totalHours += hours;
          payments[employeeId].totalPayment += dayPayment;
          payments[employeeId].schedules.push({
            day: day.name,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            hours: hours,
            rate: rate,
            payment: dayPayment,
          });

          if (!payments[employeeId].dailyBreakdown[day.name]) {
            payments[employeeId].dailyBreakdown[day.name] = {
              hours: 0,
              payment: 0,
            };
          }
          payments[employeeId].dailyBreakdown[day.name].hours += hours;
          payments[employeeId].dailyBreakdown[day.name].payment += dayPayment;
        }
      });
    });

    return payments;
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + direction * 7);
    setSelectedWeek(newDate);
  };

  const weekDates = getWeekDates(selectedWeek);
  const currentWeekKey = getWeekKey(selectedWeek);
  const payments = calculateEmployeePayments();
  const totalWeeklyPayment = Object.values(payments).reduce(
    (sum, emp) => sum + emp.totalPayment,
    0
  );
  const totalWeeklyHours = Object.values(payments).reduce(
    (sum, emp) => sum + emp.totalHours,
    0
  );

  return (
    <div>
      <div className="card">
        <div
          className="date-navigation"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            💰 Payment Calculator
          </h2>
          <div
            className="date-controls"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <button
              className="btn btn-secondary"
              onClick={() => navigateWeek(-1)}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              ⬅️ Previous
            </button>
            <span
              className="date-range"
              style={{
                fontWeight: "bold",
                minWidth: "200px",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "10px 20px",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
              }}
            >
              📅 {format(weekDates[0], "dd/MM/yyyy", { locale: ptBR })} -{" "}
              {format(weekDates[6], "dd/MM/yyyy", { locale: ptBR })}
            </span>
            <button
              className="btn btn-secondary"
              onClick={() => navigateWeek(1)}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              Next ➡️
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
              padding: "25px",
              borderRadius: "16px",
              textAlign: "center",
              boxShadow: "0 8px 25px rgba(25, 118, 210, 0.2)",
              border: "1px solid rgba(25, 118, 210, 0.1)",
            }}
          >
            <h4
              style={{
                color: "#1976d2",
                marginBottom: "10px",
                fontSize: "1.1rem",
              }}
            >
              ⏰ Total Hours
            </h4>
            <p
              style={{ fontSize: "28px", fontWeight: "bold", color: "#1976d2" }}
            >
              {totalWeeklyHours.toFixed(1)}h
            </p>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
              padding: "25px",
              borderRadius: "16px",
              textAlign: "center",
              boxShadow: "0 8px 25px rgba(46, 125, 50, 0.2)",
              border: "1px solid rgba(46, 125, 50, 0.1)",
            }}
          >
            <h4
              style={{
                color: "#2e7d32",
                marginBottom: "10px",
                fontSize: "1.1rem",
              }}
            >
              💰 Total to Pay
            </h4>
            <p
              style={{ fontSize: "28px", fontWeight: "bold", color: "#2e7d32" }}
            >
              €{totalWeeklyPayment.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {Object.keys(payments).length === 0 ? (
        <div className="card">
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <h3>No schedule found for this week</h3>
            <p>
              Go to the "Create Schedule" page to add employees to this week's
              schedule
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {Object.values(payments).map((employee) => (
            <div key={employee.name} className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 5px 0" }}>{employee.name}</h3>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      color: "#667eea",
                      fontWeight: "600",
                    }}
                  >
                    {employee.position || "Operator"}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#2e7d32",
                    }}
                  >
                    €{employee.totalPayment.toFixed(2)}
                  </p>
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    {employee.totalHours.toFixed(1)} hours
                  </p>
                </div>
              </div>

              {employee.schedules.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: "15px", color: "#555" }}>
                    Weekly Breakdown
                  </h4>
                  <div style={{ display: "grid", gap: "10px" }}>
                    {employee.schedules.map((schedule, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "6px",
                          borderLeft: "4px solid #667eea",
                        }}
                      >
                        <div>
                          <strong>{schedule.day}</strong>
                          <br />
                          <span style={{ fontSize: "14px", color: "#666" }}>
                            {schedule.startTimeDisplay ||
                              formatTime12Hour(schedule.startTime)}{" "}
                            -{" "}
                            {schedule.endTimeDisplay ||
                              formatTime12Hour(schedule.endTime)}{" "}
                            ({schedule.hours.toFixed(1)}h)
                          </span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span
                            style={{ fontWeight: "bold", color: "#2e7d32" }}
                          >
                            €{schedule.payment.toFixed(2)}
                          </span>
                          <br />
                          <span style={{ fontSize: "12px", color: "#666" }}>
                            €{schedule.rate}/h
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="payment-summary">
        <h3>Weekly Summary</h3>
        <div className="payment-item">
          <span>Total Employees:</span>
          <span>{Object.keys(payments).length}</span>
        </div>
        <div className="payment-item">
          <span>Total Hours Worked:</span>
          <span>{totalWeeklyHours.toFixed(1)}h</span>
        </div>
        <div className="payment-item">
          <span>Total Amount to Pay:</span>
          <span>€{totalWeeklyPayment.toFixed(2)}</span>
        </div>
        <div style={{ marginTop: "15px", fontSize: "12px", color: "#ccc" }}>
          <p>
            <strong>Rates by Position:</strong>
          </p>
          <p>
            • <strong>Operator:</strong> €13.50/h (weekdays) | €23.00/h (Sunday)
          </p>
          <p>
            • <strong>Supervisor:</strong> €15.00/h (weekdays) | €25.00/h
            (Sunday)
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentCalculator;
