import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login({ onClose, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setError("Email o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0, color: "#fff" }}>Iniciar Sesión</h2>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {error && <p style={{ color: "#ff4d4d", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          <button type="submit" disabled={loading} style={btnPrimaryStyle}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p style={{ color: "#888", fontSize: "0.85rem", marginTop: "1.5rem", textAlign: "center" }}>
          ¿No tenés cuenta?{" "}
          <span onClick={switchToRegister} style={{ color: "#00f2fe", cursor: "pointer", textDecoration: "underline" }}>
            Registrate acá
          </span>
        </p>
      </div>
    </div>
  );
}

// Estilos rápidos en objeto para no necesitar CSS extra
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modalStyle = {
  backgroundColor: "#121212",
  border: "1px solid #333",
  borderRadius: "12px",
  padding: "2rem",
  width: "100%",
  maxWidth: "400px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
};

const labelStyle = { display: "block", color: "#ccc", fontSize: "0.85rem", marginBottom: "0.3rem" };
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "6px",
  border: "1px solid #333",
  backgroundColor: "#1a1a1a",
  color: "#fff",
  boxSizing: "border-box"
};
const btnPrimaryStyle = {
  backgroundColor: "#00f2fe",
  color: "#000",
  fontWeight: "bold",
  padding: "0.75rem",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "0.5rem"
};
const closeBtnStyle = { background: "none", border: "none", color: "#888", fontSize: "1.2rem", cursor: "pointer" };
