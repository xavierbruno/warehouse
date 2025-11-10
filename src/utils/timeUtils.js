/**
 * Calculates the difference in hours between two times, considering shifts that cross midnight
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {number} - Number of hours worked
 */
export const calculateHours = (startTime, endTime) => {
  const start = new Date(`2000-01-01T${startTime}`);
  let end = new Date(`2000-01-01T${endTime}`);

  // If end time is less than start time, it means it crossed midnight
  if (end < start) {
    end = new Date(`2000-01-02T${endTime}`); // Add one day
  }

  const diffMs = end - start;
  return diffMs / (1000 * 60 * 60); // Convert to hours
};

/**
 * Converts 24h time to 12h format (AM/PM)
 * @param {string} time24 - Time in 24h format (HH:MM)
 * @returns {string} - Time in 12h format (H:MM AM/PM)
 */
export const formatTime12Hour = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Converts 12h time (AM/PM) to 24h format
 * @param {string} time12 - Time in 12h format (H:MM AM/PM)
 * @returns {string} - Time in 24h format (HH:MM)
 */
export const convertTo24Hour = (time12) => {
  if (!time12) return "";

  // Normalize input
  const normalized = time12.trim().toUpperCase();

  // Extract components
  const match = normalized.match(/^(\d{1,2}):?(\d{2})?\s*(AM|PM)?$/);
  if (!match) return "";

  let [, hours, minutes = "00", ampm = ""] = match;

  // If no AM/PM, assume 24h format if > 12
  if (!ampm) {
    const hour = parseInt(hours, 10);
    if (hour > 12) {
      return `${hours}:${minutes}`;
    }
    // If <= 12, assume AM
    ampm = "AM";
  }

  let hour24 = parseInt(hours, 10);

  if (ampm === "AM" && hour24 === 12) {
    hour24 = 0;
  } else if (ampm === "PM" && hour24 !== 12) {
    hour24 += 12;
  }

  return `${hour24.toString().padStart(2, "0")}:${minutes}`;
};

/**
 * Calculates hourly rate based on position and day of the week
 * @param {string} position - Employee position
 * @param {string} dayKey - Day of the week (monday, tuesday, ..., sunday)
 * @returns {number} - Hourly rate in euros
 */
export const getHourlyRate = (position, dayKey) => {
  const isSunday = dayKey === "sunday";

  // Define rates by position
  const rates = {
    Supervisor: {
      weekday: 15.0, // €15/hour on weekdays
      sunday: 25.0, // €25/hour on Sunday
    },
    Operator: {
      weekday: 13.5, // €13.50/hour on weekdays
      sunday: 23.0, // €23/hour on Sunday
    },
  };

  // Search position (case insensitive)
  const normalizedPosition = position?.toLowerCase() || "";
  const supervisorPosition = normalizedPosition.includes("supervisor");
  const operatorPosition =
    normalizedPosition.includes("operator") ||
    normalizedPosition.includes("operador");

  if (supervisorPosition) {
    return isSunday ? rates.Supervisor.sunday : rates.Supervisor.weekday;
  } else if (operatorPosition) {
    return isSunday ? rates.Operator.sunday : rates.Operator.weekday;
  } else {
    // Default position (Operator)
    return isSunday ? rates.Operator.sunday : rates.Operator.weekday;
  }
};
