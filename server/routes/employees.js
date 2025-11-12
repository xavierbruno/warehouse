import express from "express";
import { body, param, validationResult } from "express-validator";
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

// GET /api/employees - Listar todos os funcionários
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM employees WHERE status = $1 ORDER BY name ASC",
      ["active"]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
    res.status(500).json({ error: "Erro ao buscar funcionários" });
  }
});

// GET /api/employees/:id - Buscar funcionário por ID
router.get(
  "/:id",
  param("id").isInt(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("SELECT * FROM employees WHERE id = $1", [
        id,
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Funcionário não encontrado" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Erro ao buscar funcionário:", error);
      res.status(500).json({ error: "Erro ao buscar funcionário" });
    }
  }
);

// POST /api/employees - Criar novo funcionário
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Nome é obrigatório"),
    body("department").optional().trim(),
    body("position").optional().trim(),
    body("hire_date").optional().isISO8601().toDate(),
    body("hourly_rate").optional().isFloat({ min: 0 }),
    body("email").optional().isEmail(),
    body("phone").optional().trim(),
    body("document_type").optional().trim(),
    body("visa_expiry").optional().isISO8601().toDate(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        name,
        department,
        position,
        hire_date,
        hourly_rate,
        email,
        phone,
        document_type,
        visa_expiry,
      } = req.body;

      console.log("📝 Criando funcionário:", {
        name,
        document_type,
        visa_expiry,
        allData: req.body,
      });

      const result = await pool.query(
        `INSERT INTO employees (name, department, position, hire_date, hourly_rate, email, phone, document_type, visa_expiry)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          name,
          department,
          position,
          hire_date,
          hourly_rate,
          email,
          phone,
          document_type,
          visa_expiry,
        ]
      );

      console.log("✅ Funcionário criado:", result.rows[0]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
      res.status(500).json({ error: "Erro ao criar funcionário" });
    }
  }
);

// PUT /api/employees/:id - Atualizar funcionário
router.put(
  "/:id",
  [
    param("id").isInt(),
    body("name").optional().trim().notEmpty(),
    body("department").optional().trim(),
    body("position").optional().trim(),
    body("hire_date").optional().isISO8601().toDate(),
    body("hourly_rate").optional().isFloat({ min: 0 }),
    body("email").optional().isEmail(),
    body("phone").optional().trim(),
    body("document_type").optional().trim(),
    body("visa_expiry").optional().isISO8601().toDate(),
    body("status").optional().isIn(["active", "inactive"]),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Construir query dinâmica
      const fields = Object.keys(updates);
      const values = Object.values(updates);

      if (fields.length === 0) {
        return res.status(400).json({ error: "Nenhum campo para atualizar" });
      }

      const setClause = fields
        .map((field, idx) => `${field} = $${idx + 2}`)
        .join(", ");

      const result = await pool.query(
        `UPDATE employees SET ${setClause} WHERE id = $1 RETURNING *`,
        [id, ...values]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Funcionário não encontrado" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
      res.status(500).json({ error: "Erro ao atualizar funcionário" });
    }
  }
);

// DELETE /api/employees/:id - Deletar funcionário (soft delete)
router.delete(
  "/:id",
  param("id").isInt(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Soft delete - apenas marca como inativo
      const result = await pool.query(
        `UPDATE employees SET status = 'inactive' WHERE id = $1 RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Funcionário não encontrado" });
      }

      res.json({
        message: "Funcionário removido com sucesso",
        employee: result.rows[0],
      });
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
      res.status(500).json({ error: "Erro ao deletar funcionário" });
    }
  }
);

export default router;
