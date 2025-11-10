import pool from "../config/database.js";
import bcrypt from "bcryptjs";

async function setup() {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 Warehouse System - Setup Automático");
  console.log("=".repeat(60) + "\n");

  try {
    // Passo 1: Verificar conexão
    console.log("1️⃣  Verificando conexão com PostgreSQL...");
    await pool.query("SELECT 1");
    console.log("   ✅ Conexão OK\n");

    // Passo 2: Verificar/Criar tabela users
    console.log("2️⃣  Verificando tabela 'users'...");
    try {
      const checkTable = await pool.query("SELECT COUNT(*) FROM users");
      console.log(
        `   ✅ Tabela 'users' existe - ${checkTable.rows[0].count} usuário(s)\n`
      );
    } catch (err) {
      if (err.code === "42P01") {
        console.log("   ⚠️  Tabela 'users' não existe. Criando...");

        await pool.query(`
          CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'user',
            is_active BOOLEAN DEFAULT true,
            last_login TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        console.log("   ✅ Tabela 'users' criada\n");
      } else {
        throw err;
      }
    }

    // Passo 3: Verificar/Criar usuário admin
    console.log("3️⃣  Verificando usuário admin...");
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      ["admin"]
    );

    if (existingUser.rows.length > 0) {
      console.log("   ✅ Usuário admin já existe");
      console.log(`      ID: ${existingUser.rows[0].id}`);
      console.log(`      Email: ${existingUser.rows[0].email}`);
      console.log(`      Role: ${existingUser.rows[0].role}\n`);
    } else {
      console.log("   ⚠️  Usuário admin não existe. Criando...");

      const password = "admin123";
      const passwordHash = await bcrypt.hash(password, 10);

      await pool.query(
        `INSERT INTO users (username, email, password_hash, role) 
         VALUES ($1, $2, $3, $4)`,
        ["admin", "admin@warehouse.com", passwordHash, "admin"]
      );

      console.log("   ✅ Usuário admin criado:");
      console.log(`      Username: admin`);
      console.log(`      Password: admin123`);
      console.log(`      Email: admin@warehouse.com\n`);
    }

    // Passo 4: Verificar outras tabelas
    console.log("4️⃣  Verificando outras tabelas...");
    const tables = await pool.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);

    const requiredTables = ["employees", "schedules", "payments", "users"];
    const existingTables = tables.rows.map((r) => r.tablename);
    const missingTables = requiredTables.filter(
      (t) => !existingTables.includes(t)
    );

    if (missingTables.length > 0) {
      console.log(`   ⚠️  Tabelas faltando: ${missingTables.join(", ")}`);
      console.log("   Execute o init.sql completo\n");
    } else {
      console.log("   ✅ Todas as tabelas necessárias existem\n");
    }

    // Passo 5: Resumo
    console.log("=".repeat(60));
    console.log("✅ Setup Completo!");
    console.log("=".repeat(60));
    console.log("\n🎯 Sistema pronto para uso:");
    console.log("   Login: admin");
    console.log("   Senha: admin123");
    console.log("\n⚠️  IMPORTANTE: Altere a senha em produção!\n");

    process.exit(0);
  } catch (error) {
    console.error("\n" + "❌".repeat(30));
    console.error("❌ ERRO NO SETUP:");
    console.error(`   Tipo: ${error.name}`);
    console.error(`   Mensagem: ${error.message}`);
    if (error.code) {
      console.error(`   Código: ${error.code}`);
    }
    console.error("\nStack trace:");
    console.error(error.stack);
    console.error("❌".repeat(30) + "\n");
    process.exit(1);
  }
}

setup();
