import { useState, useEffect, useRef } from "react";

export const useSchedules = () => {
  const [schedules, setSchedules] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoad = useRef(true);

  // Carregar escalas do localStorage
  useEffect(() => {
    const loadSchedules = () => {
      try {
        const savedSchedules = localStorage.getItem("warehouse-schedules");
        if (savedSchedules) {
          const parsedSchedules = JSON.parse(savedSchedules);
          setSchedules(parsedSchedules);
        }
      } catch (error) {
        console.error("Erro ao carregar escalas:", error);
        setSchedules({});
      } finally {
        setIsLoading(false);
        isInitialLoad.current = false;
      }
    };

    loadSchedules();
  }, []);

  // Salvar escalas no localStorage (evitar loop no carregamento inicial)
  useEffect(() => {
    if (!isInitialLoad.current && !isLoading) {
      try {
        localStorage.setItem("warehouse-schedules", JSON.stringify(schedules));
      } catch (error) {
        console.error("Erro ao salvar escalas:", error);
      }
    }
  }, [schedules, isLoading]);

  const addSchedule = (weekKey, dayKey, schedule) => {
    setSchedules((prev) => ({
      ...prev,
      [weekKey]: {
        ...prev[weekKey],
        [dayKey]: [...(prev[weekKey]?.[dayKey] || []), schedule],
      },
    }));
  };

  const removeSchedule = (weekKey, dayKey, scheduleId) => {
    setSchedules((prev) => ({
      ...prev,
      [weekKey]: {
        ...prev[weekKey],
        [dayKey]: (prev[weekKey]?.[dayKey] || []).filter(
          (s) => s.id !== scheduleId
        ),
      },
    }));
  };

  const getWeekSchedules = (weekKey) => {
    return schedules[weekKey] || {};
  };

  const getDaySchedules = (weekKey, dayKey) => {
    return schedules[weekKey]?.[dayKey] || [];
  };

  return {
    schedules,
    isLoading,
    addSchedule,
    removeSchedule,
    getWeekSchedules,
    getDaySchedules,
    setSchedules,
  };
};

