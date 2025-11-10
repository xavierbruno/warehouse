import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import employeesRouter from "./routes/employees.js";
import schedulesRouter from "./routes/schedules.js";
import authRouter from "./routes/auth.js";
import debugRouter from "./routes/debug.js";
import pool from "./config/database.js";
import { authenticateToken, optionalAuth } from "./middleware/auth.js";

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging detalhado
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`📥 [${timestamp}] ${method} ${path} - IP: ${ip}`);

  // Log do body (exceto senhas)
  if (req.body && Object.keys(req.body).length > 0) {
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = "***";
    if (safeBody.currentPassword) safeBody.currentPassword = "***";
    if (safeBody.newPassword) safeBody.newPassword = "***";
    console.log(`   Body:`, safeBody);
  }

  // Log da resposta
  const originalSend = res.send;
  res.send = function (data) {
    console.log(
      `📤 [${timestamp}] ${method} ${path} - Status: ${res.statusCode}`
    );
    originalSend.call(this, data);
  };

  next();
});

// Health check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error.message,
    });
  }
});

// Rotas da API
app.use("/api/auth", authRouter); // Rotas de autenticação (públicas)
app.use("/api/debug", debugRouter); // Rotas de debug (públicas - remover em produção!)
app.use("/api/employees", authenticateToken, employeesRouter); // Protegidas
app.use("/api/schedules", authenticateToken, schedulesRouter); // Protegidas

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    message: "Warehouse Schedule System API",
    version: "1.0.0",
    endpoints: {
      employees: "/api/employees",
      schedules: "/api/schedules",
      health: "/health",
    },
  });
});

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error("Erro:", err);
  res.status(err.status || 500).json({
    error: err.message || "Erro interno do servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log("\n" + "=".repeat(60));
  console.log(`🚀 Warehouse Schedule System - Backend API`);
  console.log("=".repeat(60));
  console.log(`📡 Servidor: http://0.0.0.0:${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🗄️  Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`
  );
  console.log(
    `🔐 JWT Secret: ${
      process.env.JWT_SECRET ? "Configurado" : "⚠️  Usando padrão (inseguro!)"
    }`
  );
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || "*"}`);
  console.log("=".repeat(60) + "\n");

  // Verificar se tabela users existe
  pool.query("SELECT COUNT(*) FROM users", (err, res) => {
    if (err) {
      if (err.code === "42P01") {
        console.log("⚠️  [SETUP] Tabela 'users' não existe!");
        console.log(
          "   Execute: docker exec -it warehouse-backend npm run seed"
        );
      } else {
        console.error(
          "❌ [SETUP] Erro ao verificar tabela users:",
          err.message
        );
      }
    } else {
      console.log(
        `✅ [SETUP] Tabela 'users' encontrada - ${res.rows[0].count} usuário(s)`
      );
      if (res.rows[0].count === "0") {
        console.log("⚠️  [SETUP] Nenhum usuário encontrado!");
        console.log(
          "   Execute: docker exec -it warehouse-backend npm run seed"
        );
      }
    }
  });
});

// Tratamento de sinais de encerramento
process.on("SIGTERM", async () => {
  console.log("SIGTERM recebido, encerrando gracefully...");
  await pool.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT recebido, encerrando gracefully...");
  await pool.end();
  process.exit(0);
});
