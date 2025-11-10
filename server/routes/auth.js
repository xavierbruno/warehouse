import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import pool from "../config/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

// Middleware de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/auth/login - Login de usuário
router.post(
  "/login",
  [
    body("username").trim().notEmpty().withMessage("Username é obrigatório"),
    body("password").notEmpty().withMessage("Senha é obrigatória"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { username, password } = req.body;

      // Buscar usuário
      const result = await pool.query(
        "SELECT * FROM users WHERE username = $1 AND is_active = true",
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const user = result.rows[0];

      // Verificar senha
      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isValidPassword) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Atualizar last_login
      await pool.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
        user.id,
      ]);

      // Gerar token JWT
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Retornar token e dados do usuário (sem senha)
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          last_login: user.last_login,
        },
      });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ error: "Erro ao fazer login" });
    }
  }
);

// GET /api/auth/me - Obter dados do usuário atual
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, role, last_login, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

// POST /api/auth/change-password - Alterar senha
router.post(
  "/change-password",
  authenticateToken,
  [
    body("currentPassword").notEmpty().withMessage("Senha atual é obrigatória"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Nova senha deve ter no mínimo 6 caracteres"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Buscar usuário
      const result = await pool.query(
        "SELECT password_hash FROM users WHERE id = $1",
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const user = result.rows[0];

      // Verificar senha atual
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password_hash
      );

      if (!isValidPassword) {
        return res.status(401).json({ error: "Senha atual incorreta" });
      }

      // Hash da nova senha
      const saltRounds = 10;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Atualizar senha
      await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
        newPasswordHash,
        req.user.id,
      ]);

      res.json({ message: "Senha alterada com sucesso" });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      res.status(500).json({ error: "Erro ao alterar senha" });
    }
  }
);

// POST /api/auth/logout - Logout (lado do servidor - opcional)
router.post("/logout", authenticateToken, (req, res) => {
  // No modelo JWT stateless, o logout é feito no cliente removendo o token
  // Aqui podemos registrar o logout se necessário
  res.json({ message: "Logout realizado com sucesso" });
});

export default router;
