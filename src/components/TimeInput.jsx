import React, { useState, useEffect, useRef } from "react";

function TimeInput({
  value,
  onChange,
  placeholder,
  label,
  required = false,
  defaultTime = null,
}) {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [ampm, setAmpm] = useState("AM");
  const isInitializing = useRef(true);

  // Parsear valor inicial apenas uma vez
  useEffect(() => {
    if (value) {
      const timeRegex = /^(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?$/;
      const match = value.match(timeRegex);
      if (match) {
        const [, h, m = "00", a = "AM"] = match;
        setHours(h);
        setMinutes(m);
        setAmpm(a.toUpperCase());
      }
    } else if (defaultTime) {
      // Valores padrão se não há valor inicial
      const match = defaultTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
      if (match) {
        const [, h, m, a] = match;
        setHours(h);
        setMinutes(m);
        setAmpm(a);
      }
    }
    isInitializing.current = false;
  }, []); // Executar apenas uma vez

  // Atualizar valor quando componentes mudam (evitar loop)
  useEffect(() => {
    if (!isInitializing.current && hours && minutes) {
      // Garantir que os minutos tenham 2 dígitos
      const formattedMinutes = minutes.padStart(2, "0");
      const timeString = `${hours}:${formattedMinutes} ${ampm}`;
      onChange(timeString);
    }
  }, [hours, minutes, ampm, onChange]);

  // Atualizar campos internos quando value externo muda
  useEffect(() => {
    if (value && value !== `${hours}:${minutes.padStart(2, "0")} ${ampm}`) {
      const timeRegex = /^(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?$/;
      const match = value.match(timeRegex);
      if (match) {
        const [, h, m = "00", a = "AM"] = match;
        setHours(h);
        setMinutes(m);
        setAmpm(a.toUpperCase());
      }
    }
  }, [value]);

  const handleHoursChange = (e) => {
    const val = e.target.value;
    // Permitir apenas números e limitar a 12
    if (val === "" || (parseInt(val) >= 1 && parseInt(val) <= 12)) {
      setHours(val);
    } else if (val.length > 2) {
      // Se digitou mais de 2 caracteres, pegar apenas os primeiros 2
      const limited = val.slice(0, 2);
      if (parseInt(limited) >= 1 && parseInt(limited) <= 12) {
        setHours(limited);
      }
    }
  };

  const handleMinutesChange = (e) => {
    const val = e.target.value;
    // Permitir apenas números e limitar a 59
    if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 59)) {
      setMinutes(val);
    } else if (val.length > 2) {
      // Se digitou mais de 2 caracteres, pegar apenas os primeiros 2
      const limited = val.slice(0, 2);
      if (parseInt(limited) >= 0 && parseInt(limited) <= 59) {
        setMinutes(limited);
      }
    }
  };

  const handleAmpmChange = (e) => {
    setAmpm(e.target.value);
  };

  return (
    <div className="form-group">
      <label htmlFor={label}>
        {label} {required && "*"}
      </label>
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Input para horas */}
        <input
          type="text"
          value={hours}
          onChange={handleHoursChange}
          placeholder="12"
          maxLength="2"
          style={{
            width: "60px",
            padding: "14px 8px",
            border: "2px solid #e1e5e9",
            borderRadius: "12px",
            fontSize: "16px",
            textAlign: "center",
            transition: "all 0.3s ease",
            background: "rgba(255, 255, 255, 0.9)",
          }}
          onFocus={(e) => {
            e.target.select();
            e.target.style.borderColor = "#667eea";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e1e5e9";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        />

        <span
          style={{ fontSize: "18px", fontWeight: "bold", color: "#667eea" }}
        >
          :
        </span>

        {/* Input para minutos */}
        <input
          type="text"
          value={minutes}
          onChange={handleMinutesChange}
          placeholder="00"
          maxLength="2"
          style={{
            width: "60px",
            padding: "14px 8px",
            border: "2px solid #e1e5e9",
            borderRadius: "12px",
            fontSize: "16px",
            textAlign: "center",
            transition: "all 0.3s ease",
            background: "rgba(255, 255, 255, 0.9)",
          }}
          onFocus={(e) => {
            e.target.select();
            e.target.style.borderColor = "#667eea";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e1e5e9";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        />

        {/* Select para AM/PM */}
        <select
          value={ampm}
          onChange={handleAmpmChange}
          style={{
            padding: "14px 12px",
            border: "2px solid #e1e5e9",
            borderRadius: "12px",
            fontSize: "16px",
            transition: "all 0.3s ease",
            background: "rgba(255, 255, 255, 0.9)",
            cursor: "pointer",
            minWidth: "80px",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#667eea";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e1e5e9";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>

      <small
        style={{
          color: "#666",
          fontSize: "12px",
          marginTop: "5px",
          display: "block",
        }}
      >
        💡 Hours: 1-12 | Minutes: 00-59
      </small>
    </div>
  );
}

export default TimeInput;
