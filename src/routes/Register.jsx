import { useState } from "react";
import { registerUser } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [role, setRole] = useState("user"); // 👈 Nuevo estado
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(email, password, "transportesOliva", nombre, role);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Error al crear usuario. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-container" onSubmit={onSubmit}>
      <h1>Crear Cuenta</h1>

      {error && <div className="login-error">{error}</div>}

      <input
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="login-input"
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-input"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login-input"
      />

      {/* SELECT DE ROL */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="login-input"
      >
        <option value="admin">Administrador</option>
        <option value="accountant">Contador</option>
        <option value="developer">Desarrollador</option>
      </select>

      <button type="submit" className="login-button" disabled={loading}>
        {loading ? <span className="spinner"></span> : "Registrarse"}
      </button>
    </form>
  );
}
