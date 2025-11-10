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
    const startTime = Date.now();
    console.log("\n" + "🔐".repeat(40));
    console.log(`[${new Date().toISOString()}] INÍCIO DO PROCESSO DE LOGIN`);
    console.log("🔐".repeat(40));

    try {
      const { username, password } = req.body;
      console.log(`1️⃣  [LOGIN] Username recebido: "${username}"`);
      console.log(
        `2️⃣  [LOGIN] Password recebido: ${
          password ? "*** (" + password.length + " caracteres)" : "VAZIO"
        }`
      );
      console.log(`3️⃣  [LOGIN] Password esperado para admin: 8 caracteres`);

      // Buscar usuário
      console.log(`\n4️⃣  [LOGIN] Executando query no banco de dados...`);
      console.log(
        `   Query: SELECT * FROM users WHERE username = '${username}' AND is_active = true`
      );

      const result = await pool.query(
        "SELECT * FROM users WHERE username = $1 AND is_active = true",
        [username]
      );

      console.log(
        `5️⃣  [LOGIN] Resultado: ${result.rows.length} usuário(s) encontrado(s)`
      );

      if (result.rows.length === 0) {
        console.log(`\n❌ [LOGIN FALHOU] Motivo: Usuário não encontrado`);
        console.log(`   Username buscado: "${username}"`);
        console.log(`   Sugestão: Verifique se o usuário existe no banco`);
        console.log("🔐".repeat(40) + "\n");
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const user = result.rows[0];
      console.log(`\n6️⃣  [LOGIN] Usuário encontrado no banco:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Is Active: ${user.is_active}`);
      console.log(
        `   Password Hash Length: ${user.password_hash.length} caracteres`
      );

      // Verificar senha
      console.log(`\n7️⃣  [LOGIN] Iniciando verificação de senha com bcrypt...`);
      console.log(`   Password length: ${password.length} caracteres`);
      console.log(`   Algoritmo: bcrypt`);

      let isValidPassword;
      try {
        isValidPassword = await bcrypt.compare(password, user.password_hash);
        console.log(`8️⃣  [LOGIN] Bcrypt compare resultado: ${isValidPassword}`);
      } catch (bcryptError) {
        console.error(`❌ [LOGIN] Erro no bcrypt.compare:`);
        console.error(`   Tipo: ${bcryptError.name}`);
        console.error(`   Mensagem: ${bcryptError.message}`);
        throw bcryptError;
      }

      if (!isValidPassword) {
        console.log(`\n❌ [LOGIN FALHOU] Motivo: Senha inválida`);
        console.log(`   Username: ${username}`);
        console.log(
          `   Sugestão: Verifique se a senha está correta ou recrie o usuário`
        );
        console.log("🔐".repeat(40) + "\n");
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      console.log(`✅ [LOGIN] Senha validada com sucesso!`);

      // Atualizar last_login
      console.log(`\n9️⃣  [LOGIN] Atualizando last_login no banco...`);
      try {
        await pool.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
          user.id,
        ]);
        console.log(`✅ [LOGIN] Last_login atualizado`);
      } catch (updateError) {
        console.error(
          `⚠️  [LOGIN] Erro ao atualizar last_login (não crítico):`,
          updateError.message
        );
      }

      // Gerar token JWT
      console.log(`\n🔟 [LOGIN] Gerando token JWT...`);
      console.log(`   JWT_SECRET configurado: ${JWT_SECRET ? "Sim" : "NÃO!"}`);
      console.log(`   JWT_EXPIRES_IN: ${JWT_EXPIRES_IN}`);
      console.log(
        `   Payload: { id: ${user.id}, username: ${user.username}, role: ${user.role} }`
      );

      let token;
      try {
        token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );
        console.log(`✅ [LOGIN] Token JWT gerado com sucesso`);
        console.log(
          `   Token (primeiros 50 chars): ${token.substring(0, 50)}...`
        );
      } catch (jwtError) {
        console.error(`❌ [LOGIN] Erro ao gerar JWT:`);
        console.error(`   Tipo: ${jwtError.name}`);
        console.error(`   Mensagem: ${jwtError.message}`);
        throw jwtError;
      }

      const duration = Date.now() - startTime;
      console.log(`\n✅✅✅ [LOGIN SUCESSO] ✅✅✅`);
      console.log(`   Usuário: ${username}`);
      console.log(`   Tempo total: ${duration}ms`);
      console.log(`   Token gerado: Sim`);
      console.log("🔐".repeat(40) + "\n");

      // Retornar token e dados do usuário (sem senha)
      const response = {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          last_login: user.last_login,
        },
      };

      console.log(`📤 [LOGIN] Enviando resposta de sucesso:`, {
        token: token.substring(0, 20) + "...",
        user: response.user,
      });

      res.json(response);
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error("\n" + "❌".repeat(40));
      console.error(`[${new Date().toISOString()}] ERRO NO LOGIN`);
      console.error("❌".repeat(40));
      console.error(`⏱️  Tempo até o erro: ${duration}ms`);
      console.error(`🏷️  Tipo do erro: ${error.name}`);
      console.error(`💬 Mensagem: ${error.message}`);

      if (error.code) {
        console.error(`🔢 Código do erro: ${error.code}`);

        // Mensagens específicas por código
        switch (error.code) {
          case "42P01":
            console.error(`📋 Significado: Tabela não existe`);
            console.error(
              `🔧 Solução: Execute "npm run setup" no console do backend`
            );
            break;
          case "28P01":
            console.error(`📋 Significado: Autenticação com PostgreSQL falhou`);
            console.error(`🔧 Solução: Verifique DB_USER e DB_PASSWORD`);
            break;
          case "ECONNREFUSED":
            console.error(`📋 Significado: PostgreSQL não está acessível`);
            console.error(
              `🔧 Solução: Verifique se container postgres está rodando`
            );
            break;
          default:
            console.error(`📋 Código desconhecido: ${error.code}`);
        }
      }

      console.error(`\n📚 Stack trace completo:`);
      console.error(error.stack);
      console.error("❌".repeat(40) + "\n");

      res.status(500).json({
        error: "Erro ao fazer login",
        ...(process.env.NODE_ENV === "development" && {
          details: error.message,
          code: error.code,
        }),
      });
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
