import React, { useState, useEffect } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import MultiSelect from "./MultiSelect";
import TimeInput from "./TimeInput";
import AlertModal from "./AlertModal";
import { useEmployees } from "../hooks/useEmployees";
import { useSchedules } from "../hooks/useSchedules";
import {
  calculateHours,
  formatTime12Hour,
  convertTo24Hour,
} from "../utils/timeUtils";
import {
  exportWeeklyScheduleToPDF,
  exportWeeklySummaryToPDF,
} from "../utils/pdfExporter";

function ScheduleCreator() {
  const { employees } = useEmployees();
  const { schedules, addSchedule, removeSchedule } = useSchedules();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [newSchedule, setNewSchedule] = useState({
    employeeId: "",
    days: [],
    startTime: "7:00 PM",
    endTime: "3:00 AM",
  });
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editingDay, setEditingDay] = useState(null);
  const [editForm, setEditForm] = useState({
    startTime: "",
    endTime: "",
  });
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitModalData, setLimitModalData] = useState(null);
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

  const daysOfWeek = [
    { key: "monday", name: "Monday", short: "Mon" },
    { key: "tuesday", name: "Tuesday", short: "Tue" },
    { key: "wednesday", name: "Wednesday", short: "Wed" },
    { key: "thursday", name: "Thursday", short: "Thu" },
    { key: "friday", name: "Friday", short: "Fri" },
    { key: "saturday", name: "Saturday", short: "Sat" },
    { key: "sunday", name: "Sunday", short: "Sun" },
  ];

  const dayOptions = daysOfWeek.map((day) => ({
    value: day.key,
    label: day.name,
  }));

  const getWeekDates = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Segunda-feira
    return daysOfWeek.map((_, index) => addDays(start, index));
  };

  const getWeekKey = (date) => {
    return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
  };

  const timeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
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

  const handleExportPDF = () => {
    const weekSchedules = schedules[currentWeekKey] || {};
    exportWeeklyScheduleToPDF(
      weekSchedules,
      employees,
      selectedWeek,
      formatTime12Hour
    );
    showAlert(
      "PDF Exported",
      "Weekly schedule has been exported to PDF successfully!",
      "success"
    );
  };

  const handleExportSummary = () => {
    const weekSchedules = schedules[currentWeekKey] || {};
    exportWeeklySummaryToPDF(weekSchedules, employees, selectedWeek);
    showAlert(
      "Summary Exported",
      "Weekly summary has been exported to PDF successfully!",
      "success"
    );
  };

  const currentWeekKey = getWeekKey(selectedWeek);
  const weekDates = getWeekDates(selectedWeek);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeChange = (field, value) => {
    setNewSchedule((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDaysChange = (selectedDays) => {
    setNewSchedule((prev) => ({
      ...prev,
      days: selectedDays,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('\n' + '='.repeat(80));
    console.log('🚀 INICIANDO CRIAÇÃO DE SCHEDULE');
    console.log('='.repeat(80));
    console.log('Dados do formulário:', newSchedule);
    
    if (
      newSchedule.employeeId &&
      newSchedule.days.length > 0 &&
      newSchedule.startTime &&
      newSchedule.endTime
    ) {
      // Validar formato de horário
      const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/;
      const startTimeValid = timeRegex.test(newSchedule.startTime);
      const endTimeValid = timeRegex.test(newSchedule.endTime);

      if (!startTimeValid || !endTimeValid) {
        console.error('❌ VALIDAÇÃO FALHOU: Formato de horário inválido');
        showAlert(
          "Invalid Time Format",
          "Please fill in the times completely (ex: 8:00 AM, 5:00 PM)",
          "error"
        );
        return;
      }

      // Converter horários para 24 horas
      const startTime24 = convertTo24Hour(newSchedule.startTime);
      const endTime24 = convertTo24Hour(newSchedule.endTime);
      
      console.log('✅ Horários convertidos:', { startTime24, endTime24 });

      // Validar se os horários são válidos
      if (!startTime24 || !endTime24) {
        console.error('❌ VALIDAÇÃO FALHOU: Conversão de horário');
        showAlert("Invalid Times", "Please enter valid times", "error");
        return;
      }

      // Check for schedule conflicts
      const currentWeekKey = getWeekKey(selectedWeek);
      const weekSchedules = schedules[currentWeekKey] || {};
      const conflicts = [];

      newSchedule.days.forEach((day) => {
        const daySchedules = weekSchedules[day] || [];
        const employeeId = parseInt(newSchedule.employeeId);

        daySchedules.forEach((existingSchedule) => {
          const existingEmployeeId =
            existingSchedule.employee_id || existingSchedule.employeeId;
          if (parseInt(existingEmployeeId) === employeeId) {
            // Check if the new schedule conflicts with existing one
            const existingStart =
              existingSchedule.start_time || existingSchedule.startTime;
            const existingEnd =
              existingSchedule.end_time || existingSchedule.endTime;

            // Convert to comparable format (minutes since midnight)
            const newStartMinutes = timeToMinutes(startTime24);
            const newEndMinutes = timeToMinutes(endTime24);
            const existingStartMinutes = timeToMinutes(existingStart);
            const existingEndMinutes = timeToMinutes(existingEnd);

            console.log("   Comparando horários:", {
              novo: `${startTime24} (${newStartMinutes}min) - ${endTime24} (${newEndMinutes}min)`,
              existente: `${existingStart} (${existingStartMinutes}min) - ${existingEnd} (${existingEndMinutes}min)`,
            });

            // Check for overlap (qualquer sobreposição)
            const hasOverlap =
              (newStartMinutes < existingEndMinutes &&
                newEndMinutes > existingStartMinutes) ||
              (newStartMinutes === existingStartMinutes &&
                newEndMinutes === existingEndMinutes);

            console.log("   Resultado overlap:", hasOverlap);

            if (hasOverlap) {
              console.log("   ❌ CONFLITO DETECTADO!");
              const dayName =
                daysOfWeek.find((d) => d.key === day)?.name || day;
              const employeeName = getEmployeeName(employeeId);
              conflicts.push({
                day: dayName,
                employeeName: employeeName,
                existingTime: `${
                  existingSchedule.startTimeDisplay ||
                  formatTime12Hour(existingStart)
                } - ${
                  existingSchedule.endTimeDisplay ||
                  formatTime12Hour(existingEnd)
                }`,
                newTime: `${newSchedule.startTime} - ${newSchedule.endTime}`,
              });
            }
          }
        });
      });

      if (conflicts.length > 0) {
        console.error('\n' + '❌'.repeat(40));
        console.error('❌ CONFLITO DE HORÁRIOS DETECTADO!');
        console.error('❌'.repeat(40));
        console.error('Total de conflitos:', conflicts.length);
        console.error('Detalhes:', conflicts);
        console.error('❌'.repeat(40) + '\n');
        
        const conflictMsg = conflicts.map(c => 
          `${c.day}: ${c.employeeName}\nExisting: ${c.existingTime}\nNew: ${c.newTime}`
        ).join("\n\n");
        
        // ALERT NATIVO (impossível ignorar)
        alert(`⚠️ CONFLITO DE HORÁRIO!\n\n${conflictMsg}\n\nO mesmo funcionário não pode ter horários sobrepostos no mesmo dia!`);
        
        showAlert(
          "⚠️ Schedule Conflict!",
          `Cannot create schedule:\n\n${conflictMsg}`,
          "error"
        );
        
        console.error('🛑 CRIAÇÃO CANCELADA - Conflito');
        return; // PARA AQUI
      }

      console.log('✅ VALIDAÇÃO 1: Sem conflitos');

      // Check for visa expiry for Stamp1, Stamp2, or Stamp4 employees
      const selectedEmployee = employees.find(
        (emp) => emp.id === parseInt(newSchedule.employeeId)
      );

      console.log("🔍 Verificando visto do funcionário:", {
        employee: selectedEmployee?.name,
        documentType: selectedEmployee?.documentType,
        visaExpiryDate: selectedEmployee?.visaExpiryDate,
      });

      if (
        selectedEmployee &&
        (selectedEmployee.documentType === "Stamp1" ||
          selectedEmployee.documentType === "Stamp2" ||
          selectedEmployee.documentType === "Stamp4") &&
        selectedEmployee.visaExpiryDate
      ) {
        const visaExpiryDate = new Date(selectedEmployee.visaExpiryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

        console.log("📅 Verificando expiração:", {
          visaExpiry: visaExpiryDate.toISOString(),
          today: today.toISOString(),
          expired: visaExpiryDate < today,
        });

        if (visaExpiryDate < today) {
          console.error('\n' + '🛂'.repeat(40));
          console.error('🛂 VISTO EXPIRADO!');
          console.error('Funcionário:', selectedEmployee.name);
          console.error('Expirou:', visaExpiryDate.toLocaleDateString());
          console.error('🛂'.repeat(40) + '\n');
          
          // ALERT NATIVO
          alert(`🛂 VISTO EXPIRADO!\n\nFuncionário: ${selectedEmployee.name}\nDocument: ${selectedEmployee.documentType}\nExpirou: ${visaExpiryDate.toLocaleDateString()}`);
          
          setLimitModalData({
            employee: selectedEmployee,
            visaExpired: true,
            visaExpiryDate: visaExpiryDate,
            days: newSchedule.days,
            startTime: startTime24,
            endTime: endTime24,
            startTimeDisplay: newSchedule.startTime,
            endTimeDisplay: newSchedule.endTime,
          });
          setShowLimitModal(true);
          
          console.error('🛑 PAUSADO - Visto expirado');
          return; // PARA AQUI
        }
        
        console.log('✅ VALIDAÇÃO 2: Visto OK');
      }

      // Check for Stamp2 employees and 20h limit
      if (selectedEmployee && selectedEmployee.documentType === "Stamp2") {
        console.log(
          "🔍 Verificando limite de 20h para Stamp2:",
          selectedEmployee.name
        );

        // Calculate current weekly hours for this employee
        const currentWeekKey = getWeekKey(selectedWeek);
        const weekSchedules = schedules[currentWeekKey] || {};
        let currentHours = 0;

        Object.values(weekSchedules).forEach((daySchedules) => {
          daySchedules.forEach((schedule) => {
            const scheduleEmployeeId =
              schedule.employee_id || schedule.employeeId;
            const scheduleStartTime = schedule.start_time || schedule.startTime;
            const scheduleEndTime = schedule.end_time || schedule.endTime;
            if (
              parseInt(scheduleEmployeeId) === parseInt(newSchedule.employeeId)
            ) {
              const hours = calculateHours(scheduleStartTime, scheduleEndTime);
              currentHours += hours;
              console.log(`   + ${hours.toFixed(2)}h de escala existente`);
            }
          });
        });

        // Calculate new hours that will be added
        const newHours =
          calculateHours(startTime24, endTime24) * newSchedule.days.length;
        const totalHours = currentHours + newHours;

        console.log("📊 Cálculo de horas Stamp2:", {
          currentHours: currentHours.toFixed(2),
          newHours: newHours.toFixed(2),
          totalHours: totalHours.toFixed(2),
          limit: 20,
          exceedsLimit: totalHours > 20,
        });

        if (totalHours > 20) {
          console.error('\n' + '⚠️'.repeat(40));
          console.error('⚠️ LIMITE STAMP2 EXCEDIDO!');
          console.error('Funcionário:', selectedEmployee.name);
          console.error('Total:', totalHours.toFixed(2) + 'h / 20h');
          console.error('⚠️'.repeat(40) + '\n');
          
          // ALERT NATIVO
          alert(`⚠️ LIMITE EXCEDIDO!\n\nFuncionário: ${selectedEmployee.name}\nStamp2 - Limite: 20h/semana\n\nAtual: ${currentHours.toFixed(2)}h\nNovo: ${newHours.toFixed(2)}h\nTotal: ${totalHours.toFixed(2)}h\nExcesso: ${(totalHours - 20).toFixed(2)}h`);
          
          setLimitModalData({
            employee: selectedEmployee,
            visaExpired: false,
            currentHours,
            newHours,
            totalHours,
            days: newSchedule.days,
            startTime: startTime24,
            endTime: endTime24,
            startTimeDisplay: newSchedule.startTime,
            endTimeDisplay: newSchedule.endTime,
          });
          setShowLimitModal(true);
          
          console.error('🛑 PAUSADO - Stamp2 limite');
          return; // PARA AQUI
        }
        
        console.log('✅ VALIDAÇÃO 3: Stamp2 OK (' + totalHours.toFixed(2) + 'h)');
      }

      // Criar uma escala para cada dia selecionado
      newSchedule.days.forEach((day) => {
        const schedule = {
          employee_id: parseInt(newSchedule.employeeId), // API espera snake_case
          start_time: startTime24,
          end_time: endTime24,
          break_minutes: 0, // Padrão
          notes: `${newSchedule.startTime} - ${newSchedule.endTime}`, // Salvar horário display
        };

        console.log("🚀 Criando escala:", {
          weekKey: currentWeekKey,
          day,
          schedule,
        });
        addSchedule(currentWeekKey, day, schedule);
      });

      setNewSchedule({
        employeeId: "",
        days: [],
        startTime: "7:00 PM",
        endTime: "3:00 AM",
      });

      // Mostrar mensagem de sucesso
      showAlert(
        "Schedule Created",
        `Schedule added successfully for ${newSchedule.days.length} day(s)!`,
        "success"
      );
    }
  };

  const handleDeleteSchedule = (day, scheduleId) => {
    showConfirm(
      "Confirm Removal",
      "Are you sure you want to remove this schedule?",
      () => {
        removeSchedule(currentWeekKey, day, scheduleId);
      }
    );
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule.id);
    setEditForm({
      startTime:
        schedule.startTimeDisplay || formatTime12Hour(schedule.startTime),
      endTime: schedule.endTimeDisplay || formatTime12Hour(schedule.endTime),
    });
  };

  const handleSaveEdit = (scheduleId, day) => {
    if (editForm.startTime && editForm.endTime) {
      const startTime24 = convertTo24Hour(editForm.startTime);
      const endTime24 = convertTo24Hour(editForm.endTime);

      // Validar se os horários são válidos
      if (!startTime24 || !endTime24) {
        showAlert("Invalid Times", "Please enter valid times", "error");
        return;
      }

      const currentWeekKey = getWeekKey(selectedWeek);
      const updatedSchedule = {
        startTime: startTime24,
        endTime: endTime24,
        startTimeDisplay: editForm.startTime,
        endTimeDisplay: editForm.endTime,
      };

      // Update the schedule using the hook
      setSchedules((prev) => ({
        ...prev,
        [currentWeekKey]: {
          ...prev[currentWeekKey],
          [day]:
            prev[currentWeekKey]?.[day]?.map((s) =>
              s.id === scheduleId
                ? {
                    ...s,
                    ...updatedSchedule,
                  }
                : s
            ) || [],
        },
      }));

      showAlert(
        "Schedule Updated",
        "Schedule has been updated successfully!",
        "success"
      );
    }
    setEditingSchedule(null);
    setEditForm({ startTime: "", endTime: "" });
  };

  const handleCancelEdit = () => {
    setEditingSchedule(null);
    setEditForm({ startTime: "", endTime: "" });
  };

  const handleConfirmLimitExceed = () => {
    if (limitModalData) {
      const currentWeekKey = getWeekKey(selectedWeek);

      limitModalData.days.forEach((day) => {
        const schedule = {
          employee_id: parseInt(limitModalData.employee.id),
          start_time: limitModalData.startTime,
          end_time: limitModalData.endTime,
          break_minutes: 0,
          notes: `${limitModalData.startTimeDisplay} - ${limitModalData.endTimeDisplay}`,
        };

        console.log("🚀 Criando escala (limit exceed):", {
          weekKey: currentWeekKey,
          day,
          schedule,
        });
        addSchedule(currentWeekKey, day, schedule);
      });

      setNewSchedule({
        employeeId: "",
        days: [],
        startTime: "",
        endTime: "",
      });
    }

    setShowLimitModal(false);
    setLimitModalData(null);
  };

  const handleCancelLimitExceed = () => {
    setShowLimitModal(false);
    setLimitModalData(null);
  };

  const handleEditDay = (day) => {
    setEditingDay(day);
  };

  const handleSaveDayEdit = (day) => {
    if (editForm.startTime && editForm.endTime) {
      const startTime24 = convertTo24Hour(editForm.startTime);
      const endTime24 = convertTo24Hour(editForm.endTime);

      // Validar se os horários são válidos
      if (!startTime24 || !endTime24) {
        showAlert("Invalid Times", "Please enter valid times", "error");
        return;
      }

      setSchedules((prev) => ({
        ...prev,
        [currentWeekKey]: {
          ...prev[currentWeekKey],
          [day]:
            prev[currentWeekKey]?.[day]?.map((s) => ({
              ...s,
              startTime: startTime24,
              endTime: endTime24,
              startTimeDisplay: editForm.startTime,
              endTimeDisplay: editForm.endTime,
            })) || [],
        },
      }));

      showAlert(
        "Day Schedule Updated",
        "All schedules for this day have been updated successfully!",
        "success"
      );
    }
    setEditingDay(null);
    setEditForm({ startTime: "", endTime: "" });
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find((emp) => emp.id === parseInt(employeeId));
    return employee ? employee.name : "Employee not found";
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + direction * 7);
    setSelectedWeek(newDate);
  };

  const getWeeklyHoursRanking = () => {
    const currentWeekKey = getWeekKey(selectedWeek);
    const weekSchedules = schedules[currentWeekKey] || {};

    // Calculate total hours for each employee
    const employeeHours = {};

    Object.values(weekSchedules).forEach((daySchedules) => {
      daySchedules.forEach((schedule) => {
        const employee = employees.find(
          (emp) => emp.id === parseInt(schedule.employeeId)
        );
        if (employee) {
          if (!employeeHours[employee.id]) {
            employeeHours[employee.id] = {
              id: employee.id,
              name: employee.name,
              position: employee.position,
              documentType: employee.documentType,
              totalHours: 0,
              exceedsLimit: false,
            };
          }

          const hours = calculateHours(schedule.startTime, schedule.endTime);
          employeeHours[employee.id].totalHours += hours;
        }
      });
    });

    // Check for Stamp2 employees exceeding 20h limit
    Object.values(employeeHours).forEach((employee) => {
      if (employee.documentType === "Stamp2" && employee.totalHours > 20) {
        employee.exceedsLimit = true;
      }
    });

    // Sort by total hours (descending)
    return Object.values(employeeHours).sort(
      (a, b) => b.totalHours - a.totalHours
    );
  };

  return (
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
          📅 Create Weekly Schedule
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

      {/* Export Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          className="btn"
          onClick={handleExportPDF}
          style={{
            background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
            color: "white",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          📄 Export Full Schedule
        </button>
        <button
          className="btn"
          onClick={handleExportSummary}
          style={{
            background: "linear-gradient(135deg, #17a2b8 0%, #138496 100%)",
            color: "white",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          📊 Export Summary
        </button>
      </div>

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
        <h3 style={{ marginBottom: "25px", color: "#333", fontSize: "1.5rem" }}>
          ✨ Add Schedule
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <div className="form-group">
            <label htmlFor="employeeId">Employee *</label>
            <select
              id="employeeId"
              name="employeeId"
              value={newSchedule.employeeId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          <MultiSelect
            options={dayOptions}
            selectedValues={newSchedule.days}
            onChange={handleDaysChange}
            placeholder="Select days of the week"
          />

          <TimeInput
            label="Start Time"
            value={newSchedule.startTime}
            onChange={(value) => handleTimeChange("startTime", value)}
            defaultTime="7:00 PM"
            required
          />

          <TimeInput
            label="End Time"
            value={newSchedule.endTime}
            onChange={(value) => handleTimeChange("endTime", value)}
            defaultTime="3:00 AM"
            required
          />
        </div>

        <button
          type="submit"
          className="btn"
          style={{
            gridColumn: "1 / -1",
            marginTop: "20px",
            padding: "16px 32px",
            fontSize: "18px",
            fontWeight: "700",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
          }}
        >
          🚀 Add to Schedule
        </button>
      </form>

      <div className="schedule-grid">
        {daysOfWeek.map((day, index) => {
          const daySchedules = schedules[currentWeekKey]?.[day.key] || [];
          const date = weekDates[index];

          return (
            <div key={day.key} className="day-column">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <h4 style={{ margin: 0 }}>
                  {day.short}
                  <br />
                  <small style={{ fontSize: "12px", fontWeight: "normal" }}>
                    {format(date, "dd/MM", { locale: ptBR })}
                  </small>
                </h4>
                {daySchedules.length > 0 && (
                  <div className="tooltip">
                    <button
                      className="action-btn day-edit"
                      onClick={() => handleEditDay(day.key)}
                    >
                      ✏️
                    </button>
                    <span className="tooltiptext">Editar horário do dia</span>
                  </div>
                )}
              </div>

              {editingDay === day.key ? (
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    padding: "15px",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <h5 style={{ margin: "0 0 10px 0", color: "#333" }}>
                    Edit all day times
                  </h5>
                  <TimeInput
                    label="New start time"
                    value={editForm.startTime}
                    onChange={(value) =>
                      setEditForm((prev) => ({ ...prev, startTime: value }))
                    }
                    defaultTime="7:00 PM"
                  />
                  <TimeInput
                    label="New end time"
                    value={editForm.endTime}
                    onChange={(value) =>
                      setEditForm((prev) => ({ ...prev, endTime: value }))
                    }
                    defaultTime="3:00 AM"
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "15px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <button
                      className="btn"
                      onClick={() => handleSaveDayEdit(day.key)}
                      style={{
                        background:
                          "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                      }}
                    >
                      ✅ Apply to all
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setEditingDay(null);
                        setEditForm({ startTime: "", endTime: "" });
                      }}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : null}

              {daySchedules.length === 0 ? (
                <p
                  style={{
                    color: "#999",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  No schedule
                </p>
              ) : (
                daySchedules.map((schedule) => {
                  const scheduleStartTime =
                    schedule.start_time || schedule.startTime;
                  const scheduleEndTime = schedule.end_time || schedule.endTime;
                  const scheduleEmployeeId =
                    schedule.employee_id || schedule.employeeId;
                  const hours = calculateHours(
                    scheduleStartTime,
                    scheduleEndTime
                  );
                  return (
                    <div key={schedule.id} className="schedule-item">
                      <strong>{getEmployeeName(scheduleEmployeeId)}</strong>
                      <br />
                      {editingSchedule === schedule.id ? (
                        <div style={{ margin: "10px 0" }}>
                          <TimeInput
                            label=""
                            value={editForm.startTime}
                            onChange={(value) =>
                              setEditForm((prev) => ({
                                ...prev,
                                startTime: value,
                              }))
                            }
                            defaultTime="7:00 PM"
                          />
                          <TimeInput
                            label=""
                            value={editForm.endTime}
                            onChange={(value) =>
                              setEditForm((prev) => ({
                                ...prev,
                                endTime: value,
                              }))
                            }
                            defaultTime="3:00 AM"
                          />
                          <div
                            style={{
                              display: "flex",
                              gap: "5px",
                              marginTop: "10px",
                            }}
                          >
                            <button
                              className="btn"
                              onClick={() =>
                                handleSaveEdit(schedule.id, day.key)
                              }
                              style={{
                                fontSize: "12px",
                                padding: "6px 12px",
                                background:
                                  "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                              }}
                            >
                              ✅ Save
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={handleCancelEdit}
                              style={{
                                fontSize: "12px",
                                padding: "6px 12px",
                              }}
                            >
                              ❌ Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span>
                            {schedule.startTimeDisplay ||
                              formatTime12Hour(scheduleStartTime)}{" "}
                            -{" "}
                            {schedule.endTimeDisplay ||
                              formatTime12Hour(scheduleEndTime)}
                          </span>
                          <br />
                          <span style={{ fontSize: "12px", color: "#666" }}>
                            {hours.toFixed(1)}h
                          </span>
                          {schedule.notes && (
                            <>
                              <br />
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "#888",
                                  fontStyle: "italic",
                                }}
                              >
                                {schedule.notes}
                              </span>
                            </>
                          )}
                          <div
                            style={{
                              display: "flex",
                              gap: "5px",
                              marginTop: "8px",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <div className="tooltip">
                              <button
                                className="action-btn edit"
                                onClick={() => handleEditSchedule(schedule)}
                              >
                                ✏️
                              </button>
                              <span className="tooltiptext">
                                Editar horário
                              </span>
                            </div>
                            <div className="tooltip">
                              <button
                                className="action-btn delete"
                                onClick={() =>
                                  handleDeleteSchedule(day.key, schedule.id)
                                }
                              >
                                🗑️
                              </button>
                              <span className="tooltiptext">
                                Remover escala
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>

      {/* Hours Ranking Table */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h3 style={{ marginBottom: "20px", color: "#333" }}>
          📊 Weekly Hours Ranking
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <th
                  style={{ padding: "15px", color: "white", textAlign: "left" }}
                >
                  Rank
                </th>
                <th
                  style={{ padding: "15px", color: "white", textAlign: "left" }}
                >
                  Employee
                </th>
                <th
                  style={{ padding: "15px", color: "white", textAlign: "left" }}
                >
                  Position
                </th>
                <th
                  style={{ padding: "15px", color: "white", textAlign: "left" }}
                >
                  Document Type
                </th>
                <th
                  style={{
                    padding: "15px",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Total Hours
                </th>
                <th
                  style={{
                    padding: "15px",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {getWeeklyHoursRanking().map((employee, index) => (
                <tr
                  key={employee.id}
                  style={{
                    backgroundColor: employee.exceedsLimit
                      ? "#fff3cd"
                      : index % 2 === 0
                      ? "#f8f9fa"
                      : "white",
                    borderBottom: "1px solid #e9ecef",
                  }}
                >
                  <td style={{ padding: "12px 15px", fontWeight: "bold" }}>
                    #{index + 1}
                  </td>
                  <td style={{ padding: "12px 15px" }}>{employee.name}</td>
                  <td style={{ padding: "12px 15px" }}>{employee.position}</td>
                  <td style={{ padding: "12px 15px" }}>
                    {employee.documentType || "Not specified"}
                  </td>
                  <td
                    style={{
                      padding: "12px 15px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {employee.totalHours.toFixed(1)}h
                  </td>
                  <td style={{ padding: "12px 15px", textAlign: "center" }}>
                    {employee.exceedsLimit ? (
                      <div
                        className="tooltip"
                        style={{ display: "inline-block" }}
                      >
                        <span style={{ color: "#dc3545", fontSize: "18px" }}>
                          ⚠️
                        </span>
                        <span className="tooltiptext">
                          Employee exceeded 20h weekly limit (Stamp2)
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: "#28a745", fontSize: "16px" }}>
                        ✅
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Limit Exceed Modal */}
      {showLimitModal && limitModalData && (
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
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>
              {limitModalData.visaExpired ? "🛂" : "⚠️"}
            </div>
            <h3 style={{ color: "#dc3545", marginBottom: "20px" }}>
              {limitModalData.visaExpired
                ? "Visa Expired Warning"
                : "Weekly Hours Limit Exceeded"}
            </h3>
            <p style={{ marginBottom: "15px", fontSize: "16px" }}>
              <strong>{limitModalData.employee.name}</strong>
              {limitModalData.visaExpired
                ? ` (${limitModalData.employee.documentType}) has an expired visa.`
                : " (Stamp2) will exceed the 20-hour weekly limit."}
            </p>
            <div
              style={{
                background: "#f8f9fa",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              {limitModalData.visaExpired ? (
                <>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Visa Expiry Date:</strong>{" "}
                    {limitModalData.visaExpiryDate.toLocaleDateString("en-US")}
                  </p>
                  <p
                    style={{
                      margin: "5px 0",
                      color: "#dc3545",
                      fontWeight: "bold",
                    }}
                  >
                    <strong>Status:</strong> EXPIRED
                  </p>
                </>
              ) : (
                <>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Current hours:</strong>{" "}
                    {limitModalData.currentHours.toFixed(1)}h
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    <strong>New hours:</strong>{" "}
                    {limitModalData.newHours.toFixed(1)}h
                  </p>
                  <p
                    style={{
                      margin: "5px 0",
                      color: "#dc3545",
                      fontWeight: "bold",
                    }}
                  >
                    <strong>Total hours:</strong>{" "}
                    {limitModalData.totalHours.toFixed(1)}h
                  </p>
                </>
              )}
            </div>
            <p style={{ color: "#666", marginBottom: "25px" }}>
              {limitModalData.visaExpired
                ? "Do you want to proceed anyway? Please ensure the employee's visa is renewed before scheduling."
                : "Do you want to proceed anyway? The employee will be highlighted in yellow in the ranking table."}
            </p>
            <div
              style={{ display: "flex", gap: "15px", justifyContent: "center" }}
            >
              <button
                className="btn btn-danger"
                onClick={handleCancelLimitExceed}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                }}
              >
                ❌ Cancel
              </button>
              <button
                className="btn"
                onClick={handleConfirmLimitExceed}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  background:
                    "linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)",
                  color: "white",
                }}
              >
                ⚠️ Proceed Anyway
              </button>
            </div>
          </div>
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

export default ScheduleCreator;
