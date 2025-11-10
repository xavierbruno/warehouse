import React, { useState, useRef, useEffect } from "react";

function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = "Selecione...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (option) => {
    const newSelected = selectedValues.includes(option.value)
      ? selectedValues.filter((val) => val !== option.value)
      : [...selectedValues, option.value];
    onChange(newSelected);
  };

  const removeSelected = (value) => {
    const newSelected = selectedValues.filter((val) => val !== value);
    onChange(newSelected);
  };

  const getSelectedLabels = () => {
    return selectedValues.map((value) => {
      const option = options.find((opt) => opt.value === value);
      return option ? option.label : value;
    });
  };

  return (
    <div className="multiselect-container" ref={dropdownRef}>
      <div className="form-group" style={{ marginBottom: "20px" }}>
        <label>Days of the Week *</label>
        <div
          onClick={handleToggle}
          style={{
            width: "100%",
            padding: "14px 16px",
            border: "2px solid #e1e5e9",
            borderRadius: "12px",
            fontSize: "16px",
            cursor: "pointer",
            background: "rgba(255, 255, 255, 0.9)",
            transition: "all 0.3s ease",
            minHeight: "50px",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "#667eea";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "#e1e5e9";
            e.target.style.transform = "translateY(0)";
          }}
        >
          {selectedValues.length === 0 ? (
            <span style={{ color: "#999" }}>{placeholder}</span>
          ) : (
            <div className="multiselect-selected">
              {getSelectedLabels().map((label, index) => (
                <div key={index} className="multiselect-tag">
                  {label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelected(selectedValues[index]);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <span
            style={{
              marginLeft: "auto",
              fontSize: "12px",
              color: "#667eea",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            ▼
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="multiselect-dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              className="multiselect-option"
              onClick={() => handleOptionChange(option)}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => handleOptionChange(option)}
              />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
