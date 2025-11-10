// Configuração da API
const API_URL = import.meta.env.VITE_API_URL || "http://213.199.59.34:5000/api";

// Helper para obter token do localStorage
const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

// Helper para fazer requisições
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const token = getAuthToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // Se não autenticado, redirecionar para login
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Erro desconhecido" }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// API de Funcionários
export const employeesAPI = {
  // Listar todos os funcionários
  getAll: async () => {
    return fetchAPI("/employees");
  },

  // Buscar funcionário por ID
  getById: async (id) => {
    return fetchAPI(`/employees/${id}`);
  },

  // Criar novo funcionário
  create: async (employeeData) => {
    return fetchAPI("/employees", {
      method: "POST",
      body: JSON.stringify(employeeData),
    });
  },

  // Atualizar funcionário
  update: async (id, employeeData) => {
    return fetchAPI(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(employeeData),
    });
  },

  // Deletar funcionário
  delete: async (id) => {
    return fetchAPI(`/employees/${id}`, {
      method: "DELETE",
    });
  },
};

// API de Escalas
export const schedulesAPI = {
  // Listar todas as escalas (com filtros opcionais)
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.week_key) params.append("week_key", filters.week_key);
    if (filters.day_key) params.append("day_key", filters.day_key);
    if (filters.employee_id) params.append("employee_id", filters.employee_id);

    const queryString = params.toString();
    return fetchAPI(`/schedules${queryString ? `?${queryString}` : ""}`);
  },

  // Buscar escalas de uma semana específica
  getByWeek: async (weekKey) => {
    return fetchAPI(`/schedules/week/${weekKey}`);
  },

  // Buscar escala por ID
  getById: async (id) => {
    return fetchAPI(`/schedules/${id}`);
  },

  // Criar nova escala
  create: async (scheduleData) => {
    return fetchAPI("/schedules", {
      method: "POST",
      body: JSON.stringify(scheduleData),
    });
  },

  // Atualizar escala
  update: async (id, scheduleData) => {
    return fetchAPI(`/schedules/${id}`, {
      method: "PUT",
      body: JSON.stringify(scheduleData),
    });
  },

  // Deletar escala
  delete: async (id) => {
    return fetchAPI(`/schedules/${id}`, {
      method: "DELETE",
    });
  },
};

// Health check da API
export const checkAPIHealth = async () => {
  try {
    const response = await fetch(`${API_URL.replace("/api", "")}/health`);
    return await response.json();
  } catch (error) {
    console.error("Health check failed:", error);
    return { status: "error", error: error.message };
  }
};
