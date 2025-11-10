import { useState, useEffect, useRef } from "react";

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoad = useRef(true);

  // Carregar funcionários do localStorage
  useEffect(() => {
    const loadEmployees = () => {
      try {
        const savedEmployees = localStorage.getItem("warehouse-employees");
        if (savedEmployees) {
          const parsedEmployees = JSON.parse(savedEmployees);
          setEmployees(parsedEmployees);
        }
      } catch (error) {
        console.error("Erro ao carregar funcionários:", error);
        setEmployees([]);
      } finally {
        setIsLoading(false);
        isInitialLoad.current = false;
      }
    };

    loadEmployees();
  }, []);

  // Salvar funcionários no localStorage
  useEffect(() => {
    if (!isInitialLoad.current && !isLoading) {
      try {
        localStorage.setItem("warehouse-employees", JSON.stringify(employees));
      } catch (error) {
        console.error("Erro ao salvar funcionários:", error);
      }
    }
  }, [employees, isLoading]);

  const addEmployee = (employee) => {
    const newEmployee = {
      ...employee,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setEmployees((prev) => [...prev, newEmployee]);
    return newEmployee;
  };

  const deleteEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const updateEmployee = (id, updatedData) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === parseInt(id)
          ? { ...emp, ...updatedData, updatedAt: new Date().toISOString() }
          : emp
      )
    );
  };

  const getEmployeeById = (id) => {
    return employees.find((emp) => emp.id === parseInt(id));
  };

  return {
    employees,
    isLoading,
    addEmployee,
    deleteEmployee,
    updateEmployee,
    getEmployeeById,
    setEmployees,
  };
};
