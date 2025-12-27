import { useStatus } from "../hooks/useStatus";

export default function StatusPill({ status }) {
  const { getStatusConfig } = useStatus();
  const c = getStatusConfig(status);
  const Icon = c.icon;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,

        /* 👇 CLAVE VISUAL */
        height: 23,
        padding: "0 10px",

        borderRadius: 999,
        fontSize: "0.7rem",
        fontWeight: 600,

        color: c.color,
        background: c.bg,

        /* 👇 Borde mucho más sutil */
        border: `1px solid ${c.color}33`, // 20% opacity

        whiteSpace: "nowrap",
        minWidth: 90,
        justifyContent: "center",

        /* 👇 Para que no “salte” en hover */
        boxSizing: "border-box",
      }}
    >
      {Icon && <Icon size={14} />}
      {c.label}
    </span>
  );
}
