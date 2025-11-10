import { useState, useEffect } from "react";
import { employeesAPI } from "../utils/api";

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar funcionários da API
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await employeesAPI.getAll();
      setEmployees(data);
    } catch (err) {
      console.error("Erro ao carregar funcionários:", err);
      setError(err.message);
      // Fallback para localStorage em caso de erro
      try {
        const savedEmployees = localStorage.getItem("warehouse-employees");
        if (savedEmployees) {
          setEmployees(JSON.parse(savedEmployees));
        }
      } catch (localErr) {
        console.error("Erro ao carregar do localStorage:", localErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addEmployee = async (employee) => {
    try {
      const newEmployee = await employeesAPI.create(employee);
      setEmployees((prev) => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      console.error("Erro ao adicionar funcionário:", err);
      throw err;
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await employeesAPI.delete(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      console.error("Erro ao deletar funcionário:", err);
      throw err;
    }
  };

  const updateEmployee = async (id, updatedData) => {
    try {
      const updated = await employeesAPI.update(id, updatedData);
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === parseInt(id) ? updated : emp))
      );
      return updated;
    } catch (err) {
      console.error("Erro ao atualizar funcionário:", err);
      throw err;
    }
  };

  const getEmployeeById = (id) => {
    return employees.find((emp) => emp.id === parseInt(id));
  };

  return {
    employees,
    isLoading,
    error,
    addEmployee,
    deleteEmployee,
    updateEmployee,
    getEmployeeById,
    setEmployees,
    refreshEmployees: loadEmployees,
  };
};
