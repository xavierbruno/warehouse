import bcrypt from "bcryptjs";

// Gerar hash para a senha admin123
const password = "admin123";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Erro ao gerar hash:", err);
    process.exit(1);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🔐 Hash Gerado para Senha");
  console.log("=".repeat(60));
  console.log(`Senha: ${password}`);
  console.log(`Hash: ${hash}`);
  console.log("=".repeat(60) + "\n");

  console.log("📋 SQL INSERT:");
  console.log("-".repeat(60));
  console.log(`
INSERT INTO users (username, email, password_hash, role, is_active) 
VALUES (
    'admin', 
    'admin@warehouse.com', 
    '${hash}', 
    'admin',
    true
)
ON CONFLICT (username) DO UPDATE 
SET password_hash = EXCLUDED.password_hash;
  `);
  console.log("-".repeat(60) + "\n");

  process.exit(0);
});
