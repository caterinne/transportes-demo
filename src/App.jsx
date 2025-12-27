import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/LayoutDashboard";

import Dashboard from "./routes/Dashboard";
import Rendiciones from "./routes/Rendiciones";
import Viajes from "./routes/Viajes";
import Conductores from "./routes/Conductores";
import Patentes from "./routes/Patentes";
import Reportes from "./routes/Reportes";
import Usuarios from "./routes/Profile";

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rendiciones" element={<Rendiciones />} />
        <Route path="/viajes" element={<Viajes />} />
        <Route path="/conductores" element={<Conductores />} />
        <Route path="/patentes" element={<Patentes />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Route>
    </Routes>
  );
}
