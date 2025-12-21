import pool from "../config/database.js";

async function seedAdmin() {
  try {
    const username = "admin";
    const email = "admin@warehouse.com";
    const password = "GLS2025"; // Senha em texto puro

    // Verificar se usuário já existe
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      console.log("✅ Usuário admin já existe");
      console.log("   Atualizando senha para 'GLS2025'...");

      // Atualizar senha
      await pool.query("UPDATE users SET password = $1 WHERE username = $2", [
        password,
        username,
      ]);
      console.log("✅ Senha atualizada!");
      process.exit(0);
      return;
    }

    // Criar usuário admin
    await pool.query(
      `INSERT INTO users (username, email, password, role) 
       VALUES ($1, $2, $3, $4)`,
      [username, email, password, "admin"]
    );

    console.log("✅ Usuário admin criado com sucesso!");
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(
      "\n⚠️  ATENÇÃO: Senha em texto puro (não recomendado para produção)!"
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao criar usuário admin:", error);
    process.exit(1);
  }
}

seedAdmin();
