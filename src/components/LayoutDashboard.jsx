import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  BarChart3,
  Truck,
  FileText,
  CircleUser,
  Home,
  PlaneTakeoff,
  Users
} from "lucide-react";
import "./DashboardLayout.css";

// ===============================
// PROFILE MOCK (DEMO)
// ===============================
const profile = {
  nombre: "Usuario Demo",
  role: "admin",
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🚫 LOGOUT DESHABILITADO (DEMO)
  const handleLogout = () => {
    alert("Modo DEMO: cierre de sesión deshabilitado");
  };

  const getTitle = () => {
    const path = location.pathname;

    if (path === "/") return "Panel de Administración";
    if (path.startsWith("/patentes")) return "Gestión de Patentes";
    if (path.startsWith("/rendiciones")) return "Gestión de Rendiciones";
    if (path.startsWith("/conductores")) return "Gestión de Conductores";
    if (path.startsWith("/reportes")) return "Reportes";
    if (path.startsWith("/viajes")) return "Viajes";

    if (path.startsWith("/usuarios")) {
      return `Hola, ${profile.nombre}`;
    }

    return "Panel de Administración";
  };

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="sidebar-logo">Transportes Oliva</h2>

        <nav className="sidebar-nav">
          <Link to="/" className="nav-link">
            <Home size={18} /> Dashboard
          </Link>
          <Link to="/rendiciones" className="nav-link">
            <FileText size={18} /> Rendiciones
          </Link>
          <Link to="/viajes" className="nav-link">
            <PlaneTakeoff size={18} /> Viajes
          </Link>
          <Link to="/conductores" className="nav-link">
            <Users size={18} /> Conductores
          </Link>
          <Link to="/patentes" className="nav-link">
            <Truck size={18} /> Patentes
          </Link>
          <Link to="/reportes" className="nav-link">
            <BarChart3 size={18} /> Reportes
          </Link>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <header className="topbar">
          <h1 className="getTitle">{getTitle()}</h1>

          <div className="topbar-right">
            <span className="badge">DEMO</span>
            <Link to="/usuarios" className="profile-link">
              <CircleUser size={30} />
            </Link>
          </div>
        </header>

        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
