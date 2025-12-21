import pg from "pg";
const { Pool } = pg;

// Se SUPABASE_DB_URL estiver definida, usar connection string (Supabase)
// Caso contrário, usar configuração individual (PostgreSQL local/Docker)
let dbConfig;

const supabaseUrl = process.env.SUPABASE_DB_URL
  ? process.env.SUPABASE_DB_URL.trim()
  : "";

if (supabaseUrl && supabaseUrl !== "") {
  // Limpar connection string (remover aspas se houver)
  let connectionString = supabaseUrl
    .replace(/^["']|["']$/g, "") // Remove aspas no início/fim
    .replace(/\s+/g, "") // Remove espaços
    .trim();

  // DEBUG: Log da connection string (sem senha) para diagnóstico
  console.log("\n" + "=".repeat(60));
  console.log("🗄️  [DATABASE] Configurando conexão Supabase");
  console.log("=".repeat(60));
  const debugString = connectionString.replace(/:[^:@]+@/, ":****@");
  console.log(`   Connection String: ${debugString}`);
  console.log(`   Host: ${connectionString.match(/@([^:]+):/)?.[1] || 'não encontrado'}`);
  console.log(`   Comprimento: ${connectionString.length} caracteres`);

  // Verificar se é uma URL válida
  if (
    !connectionString.startsWith("postgresql://") &&
    !connectionString.startsWith("postgres://")
  ) {
    console.error(
      "\n❌ [DATABASE] Erro: SUPABASE_DB_URL deve começar com 'postgresql://' ou 'postgres://'"
    );
    console.error(
      `   Valor recebido: ${connectionString.substring(0, 100)}${
        connectionString.length > 100 ? "..." : ""
      }`
    );
    console.error("\n💡 Solução: Verifique o arquivo .env na raiz do projeto");
    console.error(
      "   Exemplo: SUPABASE_DB_URL=postgresql://postgres:senha@db.xxxxx.supabase.co:5432/postgres"
    );
    process.exit(1);
  }

  // Validar formato básico da URL
  try {
    const testUrl = new URL(connectionString);
    if (!testUrl.hostname || !testUrl.port || !testUrl.pathname) {
      throw new Error("URL incompleta");
    }
  } catch (urlError) {
    console.error("\n❌ [DATABASE] Erro: Connection string inválida");
    console.error(`   Erro: ${urlError.message}`);
    console.error(`   Connection string: ${debugString}`);
    process.exit(1);
  }

  // Configuração para Supabase
  dbConfig = {
    connectionString: connectionString,
    ssl:
      process.env.SUPABASE_SSL !== "false"
        ? { rejectUnauthorized: false }
        : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // Supabase pode precisar de mais tempo
  };
  console.log(`   SSL: ${dbConfig.ssl ? "habilitado" : "desabilitado"}`);
  console.log(`   Max connections: ${dbConfig.max}`);
} else {
  // Configuração para PostgreSQL local/Docker
  // Se rodando localmente (não em Docker), usar localhost:5434
  // Se rodando em Docker, usar postgres:5432
  const isRunningInDocker = process.env.RUNNING_IN_DOCKER === 'true';
  const dbHost = process.env.DB_HOST || (isRunningInDocker ? "postgres" : "localhost");
  const dbPort = parseInt(process.env.DB_PORT) || (isRunningInDocker ? 5432 : 5434);
  
  // Forçar IPv4 se for localhost
  const finalHost = dbHost === 'localhost' ? '127.0.0.1' : dbHost;
  
  dbConfig = {
    host: finalHost,
    port: dbPort,
    database: process.env.DB_NAME || "warehouse_db",
    user: process.env.DB_USER || "warehouse_user",
    password: process.env.DB_PASSWORD || "warehouse_pass_2024",
    max: 10, // Reduzir conexões máximas
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    // Não usar SSL para PostgreSQL local
    ssl: false,
  };
  console.log("\n" + "=".repeat(60));
  console.log("🗄️  [DATABASE] Configurando conexão PostgreSQL");
  console.log("=".repeat(60));
  console.log(`   Host: ${dbConfig.host} (${dbHost === 'localhost' ? 'IPv4 forçado' : 'original'})`);
  console.log(`   Port: ${dbConfig.port}`);
  console.log(`   Database: ${dbConfig.database}`);
  console.log(`   User: ${dbConfig.user}`);
  console.log(`   Password: ${dbConfig.password ? "***" : "⚠️  NÃO DEFINIDA"}`);
  console.log(`   Max connections: ${dbConfig.max}`);
}
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
