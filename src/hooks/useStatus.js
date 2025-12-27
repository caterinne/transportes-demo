import {
  CheckCircle,
  Clock,
  Info,
  RefreshCcw,
} from "lucide-react";

export function useStatus() {
  const statusConfig = {
    VIGENTE: {
      label: "Vigente",
      icon: Clock,
      color: "#2563eb",
      bg: "#dbeafe",
    },
    FINALIZADA: {
      label: "Finalizada",
      icon: CheckCircle,
      color: "#6b7280",
      bg: "#e5e7eb",
    },
    OPEN: {
      label: "Abierto",
      icon: Info,
      color: "#2563eb",
      bg: "#dbeafe",
    },
    PARTIAL: {
      label: "Parcial",
      icon: RefreshCcw,
      color: "#f97316",
      bg: "#ffedd5",
    },
    FILLED: {
      label: "Completado",
      icon: CheckCircle,
      color: "#16a34a",
      bg: "#dcfce7",
    },
  };

  const getStatusConfig = (status) =>
    statusConfig[status] || {
      label: status,
      icon: null,
      color: "#374151",
      bg: "#e5e7eb",
    };

  return { getStatusConfig };
}
