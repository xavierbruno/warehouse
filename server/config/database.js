import pg from "pg";
const { Pool } = pg;

const dbConfig = {
  host: process.env.DB_HOST || "postgres", // Nome do serviço Docker!
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "warehouse_db",
  user: process.env.DB_USER || "warehouse_user",
  password: process.env.DB_PASSWORD || "warehouse_pass_2024",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

console.log("\n" + "=".repeat(60));
console.log("🗄️  [DATABASE] Configurando conexão PostgreSQL");
console.log("=".repeat(60));
console.log(`   Host: ${dbConfig.host}`);
console.log(`   Port: ${dbConfig.port}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   User: ${dbConfig.user}`);
console.log(`   Password: ${dbConfig.password ? "***" : "⚠️  NÃO DEFINIDA"}`);
console.log(`   Max connections: ${dbConfig.max}`);
console.log("=".repeat(60) + "\n");

const pool = new Pool(dbConfig);

// Testar conexão inicial
let connectionAttempts = 0;
const testConnection = async () => {
  try {
    connectionAttempts++;
    console.log(`🔄 [DATABASE] Tentativa de conexão #${connectionAttempts}...`);

    const result = await pool.query(
      "SELECT NOW() as current_time, version() as pg_version"
    );

    console.log("✅ [DATABASE] Conexão estabelecida com sucesso!");
    console.log(
      `   PostgreSQL Version: ${result.rows[0].pg_version.split(",")[0]}`
    );
    console.log(`   Server Time: ${result.rows[0].current_time}`);

    // Verificar tabelas existentes
    const tables = await pool.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);

    console.log(`📊 [DATABASE] Tabelas encontradas: ${tables.rows.length}`);
    tables.rows.forEach((row) => {
      console.log(`   - ${row.tablename}`);
    });

    return true;
  } catch (err) {
    console.error(
      `❌ [DATABASE] Erro na conexão (tentativa ${connectionAttempts}):`
    );
    console.error(`   Tipo: ${err.name}`);
    console.error(`   Mensagem: ${err.message}`);
    console.error(`   Código: ${err.code}`);

    if (connectionAttempts < 5) {
      console.log(`⏳ [DATABASE] Tentando novamente em 3 segundos...`);
      setTimeout(testConnection, 3000);
    } else {
      console.error(
        `❌ [DATABASE] Falha após ${connectionAttempts} tentativas. Encerrando...`
      );
      process.exit(1);
    }
  }
};

// Iniciar teste de conexão
testConnection();

// Event handlers
pool.on("connect", (client) => {
  console.log("✅ [DATABASE] Novo cliente conectado ao pool");
});

pool.on("acquire", (client) => {
  console.log("🔄 [DATABASE] Cliente adquirido do pool");
});

pool.on("remove", (client) => {
  console.log("🔌 [DATABASE] Cliente removido do pool");
});

pool.on("error", (err, client) => {
  console.error("❌ [DATABASE] Erro inesperado no pool:");
  console.error(`   Tipo: ${err.name}`);
  console.error(`   Mensagem: ${err.message}`);
  console.error(`   Código: ${err.code}`);
  console.error("   Stack:", err.stack);
});

export default pool;
