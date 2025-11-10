import jsPDF from "jspdf";

/**
 * Exporta a agenda semanal para PDF
 * @param {Object} weekSchedules - Dados das escalas da semana
 * @param {Array} employees - Lista de funcionários
 * @param {Date} weekStart - Data de início da semana
 * @param {Function} formatTime12Hour - Função para formatar horário
 */
export const exportWeeklyScheduleToPDF = (
  weekSchedules,
  employees,
  weekStart,
  formatTime12Hour
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Cores GLS
  const glsBlue = "#0066cc";
  const glsYellow = "#ffcc00";

  // Configurações de fonte
  const titleFontSize = 20;
  const headerFontSize = 12;
  const bodyFontSize = 10;
  const smallFontSize = 8;

  let yPosition = 20;

  // Função para adicionar nova página se necessário
  const checkPageBreak = (requiredSpace = 20) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Função para adicionar texto com quebra de linha automática
  const addText = (
    text,
    x,
    y,
    maxWidth,
    fontSize = bodyFontSize,
    color = "#000000"
  ) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * (fontSize * 0.4);
  };

  // Cabeçalho com logo GLS
  doc.setFillColor(glsBlue);
  doc.rect(0, 0, pageWidth, 40, "F");

  // Logo GLS
  doc.setTextColor("#ffffff");
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("GLS", 20, 25);

  // Ponto amarelo
  doc.setFillColor(glsYellow);
  doc.circle(45, 20, 3, "F");

  // Título
  doc.setFontSize(titleFontSize);
  doc.setFont("helvetica", "bold");
  doc.text("Weekly Schedule Report", pageWidth - 20, 25, { align: "right" });

  // Data da semana
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  doc.setFontSize(headerFontSize);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#333333");
  const weekRange = `${weekStart.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })} - ${weekEnd.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;

  yPosition = addText(weekRange, 20, 50, pageWidth - 40, headerFontSize);
  yPosition += 10;

  // Dias da semana
  const daysOfWeek = [
    { key: "monday", name: "Monday" },
    { key: "tuesday", name: "Tuesday" },
    { key: "wednesday", name: "Wednesday" },
    { key: "thursday", name: "Thursday" },
    { key: "friday", name: "Friday" },
    { key: "saturday", name: "Saturday" },
    { key: "sunday", name: "Sunday" },
  ];

  // Verificar se há dados para exibir
  const hasData = Object.values(weekSchedules).some(
    (daySchedules) => Array.isArray(daySchedules) && daySchedules.length > 0
  );

  if (!hasData) {
    // Nenhuma escala encontrada
    checkPageBreak(30);
    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#666666");
    yPosition = addText(
      "No schedules found for this week",
      20,
      yPosition,
      pageWidth - 40
    );
    yPosition += 20;

    doc.setFontSize(bodyFontSize);
    doc.setFont("helvetica", "normal");
    yPosition = addText(
      'Please add employees to the schedule using the "Create Schedule" page.',
      20,
      yPosition,
      pageWidth - 40
    );
  } else {
    // Processar cada dia da semana
    daysOfWeek.forEach((day, dayIndex) => {
      const daySchedules = weekSchedules[day.key] || [];

      if (daySchedules.length > 0) {
        checkPageBreak(40);

        // Cabeçalho do dia
        doc.setFillColor("#f8f9fa");
        doc.rect(20, yPosition - 5, pageWidth - 40, 15, "F");

        doc.setFontSize(headerFontSize);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(glsBlue);
        yPosition = addText(day.name, 25, yPosition + 5, pageWidth - 50);

        // Linha separadora
        doc.setDrawColor(glsBlue);
        doc.setLineWidth(0.5);
        doc.line(25, yPosition + 2, pageWidth - 25, yPosition + 2);
        yPosition += 10;

        // Lista de funcionários do dia
        daySchedules.forEach((schedule, scheduleIndex) => {
          const employee = employees.find(
            (emp) => emp.id === parseInt(schedule.employeeId)
          );

          if (employee) {
            checkPageBreak(25);

            // Nome do funcionário
            doc.setFontSize(bodyFontSize);
            doc.setFont("helvetica", "bold");
            doc.setTextColor("#333333");
            yPosition = addText(
              `• ${employee.name}`,
              30,
              yPosition,
              pageWidth - 60
            );

            // Informações do funcionário
            const employeeInfo = [];
            if (employee.position)
              employeeInfo.push(`Position: ${employee.position}`);
            if (employee.documentType)
              employeeInfo.push(`Document: ${employee.documentType}`);

            if (employeeInfo.length > 0) {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(smallFontSize);
              doc.setTextColor("#666666");
              yPosition = addText(
                employeeInfo.join(" | "),
                35,
                yPosition,
                pageWidth - 70
              );
            }

            // Horário
            const startTime =
              schedule.startTimeDisplay || formatTime12Hour(schedule.startTime);
            const endTime =
              schedule.endTimeDisplay || formatTime12Hour(schedule.endTime);

            doc.setFontSize(bodyFontSize);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(glsBlue);
            yPosition = addText(
              `Time: ${startTime} - ${endTime}`,
              35,
              yPosition,
              pageWidth - 70
            );

            yPosition += 5;
          }
        });

        yPosition += 10;
      }
    });
  }

  // Rodapé
  const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
  const totalPages = doc.internal.getNumberOfPages();

  doc.setFontSize(smallFontSize);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#999999");
  doc.text(
    `Page ${currentPage} of ${totalPages}`,
    pageWidth - 30,
    pageHeight - 10,
    { align: "right" }
  );
  doc.text(
    `Generated on ${new Date().toLocaleString("en-US")}`,
    20,
    pageHeight - 10
  );

  // Salvar o PDF
  const fileName = `weekly-schedule-${
    weekStart.toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);
};

/**
 * Exporta um resumo da agenda semanal
 * @param {Object} weekSchedules - Dados das escalas da semana
 * @param {Array} employees - Lista de funcionários
 * @param {Date} weekStart - Data de início da semana
 */
export const exportWeeklySummaryToPDF = (
  weekSchedules,
  employees,
  weekStart
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Cores GLS
  const glsBlue = "#0066cc";
  const glsYellow = "#ffcc00";

  let yPosition = 20;

  // Cabeçalho
  doc.setFillColor(glsBlue);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor("#ffffff");
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Weekly Schedule Summary", 20, 25);

  // Calcular estatísticas
  const stats = {
    totalEmployees: new Set(),
    totalHours: 0,
    daysWithSchedules: 0,
  };

  Object.values(weekSchedules).forEach((daySchedules) => {
    if (Array.isArray(daySchedules) && daySchedules.length > 0) {
      stats.daysWithSchedules++;
      daySchedules.forEach((schedule) => {
        stats.totalEmployees.add(schedule.employeeId);
        // Calcular horas (assumindo 8h por turno como exemplo)
        stats.totalHours += 8;
      });
    }
  });

  yPosition = 60;

  // Estatísticas
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#333333");
  doc.text("Weekly Statistics:", 20, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(
    `• Total Employees Scheduled: ${stats.totalEmployees.size}`,
    30,
    yPosition
  );
  yPosition += 10;
  doc.text(
    `• Days with Schedules: ${stats.daysWithSchedules}/7`,
    30,
    yPosition
  );
  yPosition += 10;
  doc.text(`• Estimated Total Hours: ${stats.totalHours}h`, 30, yPosition);

  // Salvar
  const fileName = `weekly-summary-${
    weekStart.toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);
};




