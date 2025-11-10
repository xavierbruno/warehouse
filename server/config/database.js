import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "warehouse_db",
  user: process.env.DB_USER || "warehouse_user",
  password: process.env.DB_PASSWORD || "warehouse_pass_2024",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Testar conexão
pool.on("connect", () => {
  console.log("✅ Conectado ao PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Erro inesperado no PostgreSQL:", err);
  process.exit(-1);
});

export default pool;
