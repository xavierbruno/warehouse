import { useState, useEffect } from "react";
import { schedulesAPI } from "../utils/api";

export const useSchedules = () => {
  const [schedules, setSchedules] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar todas as escalas da API ao iniciar
  useEffect(() => {
    loadAllSchedules();
  }, []);

  const loadAllSchedules = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await schedulesAPI.getAll();

      // Organizar por week_key e day_key
      const organized = data.reduce((acc, schedule) => {
        if (!acc[schedule.week_key]) {
          acc[schedule.week_key] = {};
        }
        if (!acc[schedule.week_key][schedule.day_key]) {
          acc[schedule.week_key][schedule.day_key] = [];
        }
        acc[schedule.week_key][schedule.day_key].push(schedule);
        return acc;
      }, {});

      setSchedules(organized);
    } catch (err) {
      console.error("Erro ao carregar escalas:", err);
      setError(err.message);
      // Fallback para localStorage em caso de erro
      try {
        const savedSchedules = localStorage.getItem("warehouse-schedules");
        if (savedSchedules) {
          setSchedules(JSON.parse(savedSchedules));
        }
      } catch (localErr) {
        console.error("Erro ao carregar do localStorage:", localErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addSchedule = async (weekKey, dayKey, schedule) => {
    try {
      const newSchedule = await schedulesAPI.create({
        ...schedule,
        week_key: weekKey,
        day_key: dayKey,
      });

      setSchedules((prev) => ({
        ...prev,
        [weekKey]: {
          ...prev[weekKey],
          [dayKey]: [...(prev[weekKey]?.[dayKey] || []), newSchedule],
        },
      }));

      return newSchedule;
    } catch (err) {
      console.error("Erro ao adicionar escala:", err);
      throw err;
    }
  };

  const removeSchedule = async (weekKey, dayKey, scheduleId) => {
    try {
      await schedulesAPI.delete(scheduleId);

      setSchedules((prev) => ({
        ...prev,
        [weekKey]: {
          ...prev[weekKey],
          [dayKey]: (prev[weekKey]?.[dayKey] || []).filter(
            (s) => s.id !== scheduleId
          ),
        },
      }));
    } catch (err) {
      console.error("Erro ao remover escala:", err);
      throw err;
    }
  };

  const getWeekSchedules = async (weekKey) => {
    try {
      const weekData = await schedulesAPI.getByWeek(weekKey);

      // Atualizar cache local
      setSchedules((prev) => ({
        ...prev,
        [weekKey]: weekData,
      }));

      return weekData;
    } catch (err) {
      console.error("Erro ao buscar escalas da semana:", err);
      // Retornar dados do cache em caso de erro
      return schedules[weekKey] || {};
    }
  };

  const getDaySchedules = (weekKey, dayKey) => {
    return schedules[weekKey]?.[dayKey] || [];
  };

  return {
    schedules,
    isLoading,
    error,
    addSchedule,
    removeSchedule,
    getWeekSchedules,
    getDaySchedules,
    setSchedules,
    refreshSchedules: loadAllSchedules,
  };
};
