import bcrypt from "bcryptjs";
import pool from "../config/database.js";

async function seedAdmin() {
  try {
    const username = "admin";
    const email = "admin@warehouse.com";
    const password = "admin123"; // Senha padrão - DEVE SER ALTERADA!

    // Hash da senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Verificar se usuário já existe
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      console.log("✅ Usuário admin já existe");
      return;
    }

    // Criar usuário admin
    await pool.query(
      `INSERT INTO users (username, email, password_hash, role) 
       VALUES ($1, $2, $3, $4)`,
      [username, email, passwordHash, "admin"]
    );

    console.log("✅ Usuário admin criado com sucesso!");
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log("\n⚠️  IMPORTANTE: Altere a senha padrão em produção!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao criar usuário admin:", error);
    process.exit(1);
  }
}

seedAdmin();
