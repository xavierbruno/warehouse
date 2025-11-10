import express from "express";
import { body, param, query, validationResult } from "express-validator";
import pool from "../config/database.js";

const router = express.Router();

// Middleware de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/schedules - Listar todas as escalas (com filtros opcionais)
router.get(
  "/",
  [
    query("week_key").optional().trim(),
    query("day_key").optional().trim(),
    query("employee_id").optional().isInt(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { week_key, day_key, employee_id } = req.query;

      let queryText = `
        SELECT s.*, e.name as employee_name, e.department, e.position
        FROM schedules s
        JOIN employees e ON s.employee_id = e.id
        WHERE 1=1
      `;
      const queryParams = [];
      let paramCount = 1;

      if (week_key) {
        queryText += ` AND s.week_key = $${paramCount}`;
        queryParams.push(week_key);
        paramCount++;
      }

      if (day_key) {
        queryText += ` AND s.day_key = $${paramCount}`;
        queryParams.push(day_key);
        paramCount++;
      }

      if (employee_id) {
        queryText += ` AND s.employee_id = $${paramCount}`;
        queryParams.push(employee_id);
        paramCount++;
      }

      queryText += " ORDER BY s.week_key, s.day_key, s.start_time";

      const result = await pool.query(queryText, queryParams);
      res.json(result.rows);
    } catch (error) {
      console.error("Erro ao buscar escalas:", error);
      res.status(500).json({ error: "Erro ao buscar escalas" });
    }
  }
);

// GET /api/schedules/week/:week_key - Buscar escalas de uma semana específica
router.get("/week/:week_key", async (req, res) => {
  try {
    const { week_key } = req.params;

    const result = await pool.query(
      `SELECT s.*, e.name as employee_name, e.department, e.position, e.hourly_rate
       FROM schedules s
       JOIN employees e ON s.employee_id = e.id
       WHERE s.week_key = $1
       ORDER BY s.day_key, s.start_time`,
      [week_key]
    );

    // Agrupar por dia
    const schedulesByDay = result.rows.reduce((acc, schedule) => {
      if (!acc[schedule.day_key]) {
        acc[schedule.day_key] = [];
      }
      acc[schedule.day_key].push(schedule);
      return acc;
    }, {});

    res.json(schedulesByDay);
  } catch (error) {
    console.error("Erro ao buscar escalas da semana:", error);
    res.status(500).json({ error: "Erro ao buscar escalas da semana" });
  }
});

// GET /api/schedules/:id - Buscar escala por ID
router.get(
  "/:id",
  param("id").isInt(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `SELECT s.*, e.name as employee_name, e.department, e.position
         FROM schedules s
         JOIN employees e ON s.employee_id = e.id
         WHERE s.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Escala não encontrada" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Erro ao buscar escala:", error);
      res.status(500).json({ error: "Erro ao buscar escala" });
    }
  }
);

// POST /api/schedules - Criar nova escala
router.post(
  "/",
  [
    body("employee_id").isInt().withMessage("ID do funcionário é obrigatório"),
    body("week_key")
      .trim()
      .notEmpty()
      .withMessage("Chave da semana é obrigatória"),
    body("day_key").trim().notEmpty().withMessage("Chave do dia é obrigatória"),
    body("start_time")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Horário inicial inválido"),
    body("end_time")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Horário final inválido"),
    body("break_minutes").optional().isInt({ min: 0 }),
    body("notes").optional().trim(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        employee_id,
        week_key,
        day_key,
        start_time,
        end_time,
        break_minutes,
        notes,
      } = req.body;

      // Verificar se o funcionário existe
      const employeeCheck = await pool.query(
        "SELECT id FROM employees WHERE id = $1 AND status = $2",
        [employee_id, "active"]
      );

      if (employeeCheck.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Funcionário não encontrado ou inativo" });
      }

      const result = await pool.query(
        `INSERT INTO schedules (employee_id, week_key, day_key, start_time, end_time, break_minutes, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          employee_id,
          week_key,
          day_key,
          start_time,
          end_time,
          break_minutes || 0,
          notes,
        ]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Erro ao criar escala:", error);
      res.status(500).json({ error: "Erro ao criar escala" });
    }
  }
);

// PUT /api/schedules/:id - Atualizar escala
router.put(
  "/:id",
  [
    param("id").isInt(),
    body("employee_id").optional().isInt(),
    body("week_key").optional().trim().notEmpty(),
    body("day_key").optional().trim().notEmpty(),
    body("start_time")
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body("end_time")
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body("break_minutes").optional().isInt({ min: 0 }),
    body("notes").optional().trim(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const fields = Object.keys(updates);
      const values = Object.values(updates);

      if (fields.length === 0) {
        return res.status(400).json({ error: "Nenhum campo para atualizar" });
      }

      const setClause = fields
        .map((field, idx) => `${field} = $${idx + 2}`)
        .join(", ");

      const result = await pool.query(
        `UPDATE schedules SET ${setClause} WHERE id = $1 RETURNING *`,
        [id, ...values]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Escala não encontrada" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Erro ao atualizar escala:", error);
      res.status(500).json({ error: "Erro ao atualizar escala" });
    }
  }
);

// DELETE /api/schedules/:id - Deletar escala
router.delete(
  "/:id",
  param("id").isInt(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        "DELETE FROM schedules WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Escala não encontrada" });
      }

      res.json({
        message: "Escala removida com sucesso",
        schedule: result.rows[0],
      });
    } catch (error) {
      console.error("Erro ao deletar escala:", error);
      res.status(500).json({ error: "Erro ao deletar escala" });
    }
  }
);

export default router;
