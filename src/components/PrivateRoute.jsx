import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DEMO_MODE } from "../demoConfig";

export default function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();

  // 🚀 DEMO: saltar auth completamente
  if (DEMO_MODE) {
    return children;
  }

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}
