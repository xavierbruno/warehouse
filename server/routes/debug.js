import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// GET /api/debug/check-user - Verificar se usuário existe
router.get("/check-user/:username", async (req, res) => {
  try {
    const { username } = req.params;

    console.log(`\n🔍 [DEBUG] Verificando usuário: ${username}`);

    const result = await pool.query(
      "SELECT id, username, email, role, is_active, password, created_at FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      console.log(`❌ [DEBUG] Usuário não encontrado`);
      return res.json({
        found: false,
        message: "Usuário não encontrado",
      });
    }

    const user = result.rows[0];
    console.log(`✅ [DEBUG] Usuário encontrado:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Is Active: ${user.is_active}`);
    console.log(`   Password: ${user.password ? "***" : "NULL"}`);

    res.json({
      found: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        has_password: !!user.password,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error(`❌ [DEBUG] Erro:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/debug/test-password - Testar senha
router.post("/test-password", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(`\n🧪 [DEBUG] Testando senha para: ${username}`);
    console.log(`   Password fornecido: "${password}"`);
    console.log(`   Password length: ${password.length}`);

    const result = await pool.query(
      "SELECT password FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      console.log(`❌ [DEBUG] Usuário não encontrado`);
      return res.json({ match: false, reason: "Usuário não encontrado" });
    }

    const userPassword = result.rows[0].password;
    console.log(`   Password no banco: ${userPassword ? "***" : "NULL"}`);

    const match = password === userPassword;
    console.log(`   Comparação resultado: ${match}`);

    res.json({
      match,
      passwordLength: password.length,
      passwordInDB: !!userPassword,
    });
  } catch (error) {
    console.error(`❌ [DEBUG] Erro:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/debug/database - Informações do banco
router.get("/database", async (req, res) => {
  try {
    console.log(`\n🗄️  [DEBUG] Verificando database...`);

    // Versão do PostgreSQL
    const version = await pool.query("SELECT version()");
    console.log(`   PostgreSQL: ${version.rows[0].version.split(",")[0]}`);

    // Listar tabelas
    const tables = await pool.query(`
      SELECT tablename, 
             (SELECT COUNT(*) FROM pg_catalog.pg_tables WHERE tablename = t.tablename) as exists
      FROM pg_tables t
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    console.log(`   Tabelas: ${tables.rows.length}`);
    tables.rows.forEach((t) => console.log(`      - ${t.tablename}`));

    // Contar usuários
    let userCount = 0;
    try {
      const users = await pool.query("SELECT COUNT(*) FROM users");
      userCount = users.rows[0].count;
      console.log(`   Usuários na tabela 'users': ${userCount}`);
    } catch (err) {
      console.log(`   Tabela 'users': NÃO EXISTE (código: ${err.code})`);
    }

    res.json({
      version: version.rows[0].version.split(",")[0],
      tables: tables.rows.map((t) => t.tablename),
      userCount,
    });
  } catch (error) {
    console.error(`❌ [DEBUG] Erro:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/debug/all-users - Listar todos os usuários (sem senha)
router.get("/all-users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, role, is_active, last_login, created_at FROM users ORDER BY id"
    );

    console.log(`\n👥 [DEBUG] Total de usuários: ${result.rows.length}`);
    result.rows.forEach((u) => {
      console.log(
        `   - ID: ${u.id}, User: ${u.username}, Role: ${u.role}, Active: ${u.is_active}`
      );
    });

    res.json(result.rows);
  } catch (error) {
    console.error(`❌ [DEBUG] Erro:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
