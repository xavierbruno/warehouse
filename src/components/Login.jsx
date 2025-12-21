import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import GLSLogo from "./GLSLogo";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate("/employees");
    } else {
      setError(result.error || "Credenciais inválidas");
    }

    setIsLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <GLSLogo size="large" />
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#333",
              marginTop: "20px",
              marginBottom: "8px",
            }}
          >
            Warehouse Schedule System
          </h1>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Faça login para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                background: "#fee",
                color: "#c33",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "20px",
                fontSize: "14px",
                border: "1px solid #fcc",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="username"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#333",
                fontSize: "14px",
              }}
            >
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
              placeholder="Digite seu usuário"
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#333",
                fontSize: "14px",
              }}
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              background: isLoading
                ? "#ccc"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s",
            }}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f8f9fa",
            borderRadius: "6px",
            fontSize: "12px",
            color: "#666",
          }}
        >
          <strong>Credenciais padrão:</strong>
          <br />
          Usuário: <code style={{ color: "#667eea" }}>admin</code>
          <br />
          Senha: <code style={{ color: "#667eea" }}>GLS2025</code>
        </div>
      </div>
    </div>
  );
};

export default Login;
