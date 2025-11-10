// Middleware de logging avançado

export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Log da requisição
  console.log("\n" + "─".repeat(80));
  console.log(`📥 [REQUEST] ${req.method} ${req.path}`);
  console.log(`   Time: ${timestamp}`);
  console.log(`   IP: ${req.ip || req.connection.remoteAddress}`);
  console.log(`   User-Agent: ${req.get("user-agent") || "N/A"}`);

  if (req.headers.authorization) {
    console.log(`   Auth: Bearer token presente`);
  }

  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`   Query:`, req.query);
  }

  if (req.body && Object.keys(req.body).length > 0) {
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = "***";
    if (safeBody.currentPassword) safeBody.currentPassword = "***";
    if (safeBody.newPassword) safeBody.newPassword = "***";
    console.log(`   Body:`, safeBody);
  }

  // Interceptar resposta
  const originalSend = res.send;
  const originalJson = res.json;

  res.send = function (data) {
    const duration = Date.now() - startTime;
    console.log(`📤 [RESPONSE] ${req.method} ${req.path}`);
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Duration: ${duration}ms`);
    console.log("─".repeat(80) + "\n");
    return originalSend.call(this, data);
  };

  res.json = function (data) {
    const duration = Date.now() - startTime;
    console.log(`📤 [RESPONSE] ${req.method} ${req.path}`);
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Duration: ${duration}ms`);

    // Log de erro se status >= 400
    if (res.statusCode >= 400 && data) {
      console.log(`   Error:`, data);
    }
    console.log("─".repeat(80) + "\n");
    return originalJson.call(this, data);
  };

  next();
};

export const errorLogger = (err, req, res, next) => {
  console.error("\n" + "🔥".repeat(40));
  console.error(`❌ [ERROR] ${req.method} ${req.path}`);
  console.error(`   Tipo: ${err.name}`);
  console.error(`   Mensagem: ${err.message}`);
  console.error(`   Status: ${err.status || 500}`);

  if (err.code) {
    console.error(`   Código: ${err.code}`);
  }

  if (err.stack) {
    console.error(`   Stack:`);
    console.error(err.stack.split("\n").slice(0, 5).join("\n"));
  }
  console.error("🔥".repeat(40) + "\n");

  next(err);
};
