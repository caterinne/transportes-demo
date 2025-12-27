import { useState } from "react";
import { formatoFechaHora } from "../utils/fechas";

// ===============================
// MOCK PROFILE Y USUARIOS
// ===============================
const profile = {
  id: "u1",
  nombre: "Usuario Demo",
  email: "demo@transportes.cl",
  role: "admin",
};

const usuariosMock = [
  {
    id: "u1",
    nombre: "Usuario Demo",
    email: "demo@transportes.cl",
    role: "admin",
    lastLogin: new Date("2025-11-18T09:30"),
    createdAt: new Date("2025-01-10T12:00"),
  },
  {
    id: "u2",
    nombre: "María González",
    email: "maria@transportes.cl",
    role: "accountant",
    lastLogin: new Date("2025-11-15T08:20"),
    createdAt: new Date("2025-02-05T10:15"),
  },
];

// ===============================
// ROLE LABELS
// ===============================
const roleLabels = {
  admin: "Administrador",
  developer: "Desarrollador",
  accountant: "Contador",
  user: "Usuario",
};

export default function Profile() {
  const [usuarios] = useState(usuariosMock);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  // Modal contraseña (DEMO)
  const [showPassModal, setShowPassModal] = useState(false);

  // Historial DEMO
  const historialMock = [
    {
      id: "r1",
      salidaAt: new Date("2025-11-02T08:00"),
      destino: "Valparaíso",
      patenteTracto: "ABCD12",
      costoTotal: 109000,
    },
  ];

  const verHistorial = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarHistorial(true);
  };

  const cambiarPassword = () => {
    alert("Modo DEMO: no se puede cambiar la contraseña");
    setShowPassModal(false);
  };

  return (
    <div className="profile-container">
      {/* PERFIL */}
      <div className="profile-card">
        <p>{profile.email}</p>

        <p className="profile-sub">
          <strong>{roleLabels[profile.role]}</strong>
        </p>

        <div className="password-section">
          <h3>Seguridad</h3>

          <div className="profile-buttons">
            <button
              className="password-btn"
              onClick={() => setShowPassModal(true)}
            >
              Cambiar contraseña
            </button>

            <button
            className="btn-crear"
            disabled
            style={{
                opacity: 0.6,
                cursor: "not-allowed"
            }}
            onClick={() => alert("Modo DEMO: creación de usuarios deshabilitada")}
            >
            Crear nuevo usuario
            </button>

          </div>
        </div>
      </div>

      {/* TABLA USUARIOS */}
      {["admin", "developer"].includes(profile.role) && (
        <div className="profile-table-container">
          <h2>Usuarios del sistema</h2>

          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Último Acceso</th>
                <th>Creado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge-role role-${u.role}`}>
                      {roleLabels[u.role]}
                    </span>
                  </td>
                  <td>
                    {u.lastLogin
                      ? formatoFechaHora(u.lastLogin)
                      : "Nunca ha ingresado"}
                  </td>
                  <td>
                    {u.createdAt
                      ? formatoFechaHora(u.createdAt)
                      : "-"}
                  </td>
                  <td className="user-actions">
                    <button
                      className="history-btn"
                      onClick={() => verHistorial(u)}
                    >
                      Ver historial
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL CAMBIAR PASSWORD */}
      {showPassModal && (
        <div className="modal-overlay" onClick={() => setShowPassModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Cambiar contraseña</h2>

            <p style={{ marginBottom: 20 }}>
              Modo DEMO: acción deshabilitada
            </p>

            <button
              className="password-btn"
              onClick={cambiarPassword}
              style={{ width: "100%" }}
            >
              Guardar nueva contraseña
            </button>

            <button
              className="close-btn"
              onClick={() => setShowPassModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* MODAL HISTORIAL */}
      {mostrarHistorial && usuarioSeleccionado && (
        <div className="modal-overlay" onClick={() => setMostrarHistorial(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Historial de {usuarioSeleccionado.nombre}</h2>

            {historialMock.length === 0 ? (
              <p>No tiene rendiciones registradas.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Destino</th>
                    <th>Patente</th>
                    <th>Costo Total</th>
                  </tr>
                </thead>
                <tbody>
                  {historialMock.map((h) => (
                    <tr key={h.id}>
                      <td>{formatoFechaHora(h.salidaAt)}</td>
                      <td>{h.destino}</td>
                      <td>{h.patenteTracto}</td>
                      <td>{h.costoTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button
              className="close-btn"
              onClick={() => setMostrarHistorial(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
