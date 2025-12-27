import { useEffect, useMemo, useState } from "react";
import { formatoCLP, formatoNumero } from "../utils/formatos";
import { etiquetaMes } from "../utils/fechas";
import { demoTrips } from "../demo/trips";

import { TextField, MenuItem } from "@mui/material";
import { BarChart2, Fuel, Wallet, Truck, Users as UsersIcon } from "lucide-react";

// MUI X Charts
import { BarChart } from "@mui/x-charts/BarChart";

// Framer Motion para animaciones
import { motion } from "framer-motion";

const companyId = "transportesOliva";

const MESES = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" }
];

const TIPOS_REPORTE = [
    { value: "mes", label: "Mensual" },
    { value: "semestre", label: "Semestral" },
    { value: "anio", label: "Anual" }
];

// Helpers de rango
function buildMonthRangeISO(year, month) {
    const toIso = (d) => d.toISOString().slice(0, 16);
    return {
        inicio: toIso(new Date(year, month - 1, 1)),
        fin: toIso(new Date(year, month, 1))
    };
}

function buildSemesterRangeISO(year, semester) {
    const startMonth = semester === 1 ? 0 : 6;
    const endMonth = semester === 1 ? 6 : 12;
    const toIso = (d) => d.toISOString().slice(0, 16);
    return {
        inicio: toIso(new Date(year, startMonth, 1)),
        fin: toIso(new Date(year, endMonth, 1))
    };
}

function buildYearRangeISO(year) {
    const toIso = (d) => d.toISOString().slice(0, 16);
    return {
        inicio: toIso(new Date(year, 0, 1)),
        fin: toIso(new Date(year + 1, 0, 1))
    };
}

// Periodo anterior según tipo
function getPreviousPeriod(tipo, anio, mes, semestre) {
    if (tipo === "mes") {
        let prevMes = mes - 1;
        let prevAnio = anio;
        if (prevMes === 0) {
            prevMes = 12;
            prevAnio--;
        }
        return buildMonthRangeISO(prevAnio, prevMes);
    }

    if (tipo === "semestre") {
        const prevSem = semestre === 1 ? 2 : 1;
        const prevAnio = semestre === 1 ? anio - 1 : anio;
        return buildSemesterRangeISO(prevAnio, prevSem);
    }

    if (tipo === "anio") {
        return buildYearRangeISO(anio - 1);
    }

    return null;
}

// Card reusable tipo MUI Pro
const Card = ({ children, style }) => (
    <div
        style={{
            background: "#ffffff",
            padding: 20,
            borderRadius: 16,
            boxShadow: "0 4px 18px rgba(15,23,42,0.08)",
            border: "1px solid rgba(148,163,184,0.25)",
            ...style
        }}
    >
        {children}
    </div>
);

// Helper de variación porcentual
function diffLabel(actual, previo) {
    if (!previo || previo === 0) {
        return <span style={{ color: "#6b7280" }}>—</span>;
    }
    const diff = ((actual - previo) / previo) * 100;
    const abs = Math.abs(diff).toFixed(1);

    if (diff > 0.5) {
        return (
            <span style={{ color: "#16a34a", fontSize: 12 }}>
                ↑ {abs}% vs período anterior
            </span>
        );
    }
    if (diff < -0.5) {
        return (
            <span style={{ color: "#dc2626", fontSize: 12 }}>
                ↓ {abs}% vs período anterior
            </span>
        );
    }
    return (
        <span style={{ color: "#6b7280", fontSize: 12 }}>
            ≈ sin cambios
        </span>
    );
}

export default function Reportes() {
    const [viajes, setViajes] = useState([]);
    const [prevViajes, setPrevViajes] = useState([]);
    const [loading, setLoading] = useState(false);

    // NUEVOS FILTROS
    const [filtroConductor, setFiltroConductor] = useState("todos");
    const [filtroTracto, setFiltroTracto] = useState("todos");

    const hoy = new Date();
    const [anio, setAnio] = useState(hoy.getFullYear());
    const [mes, setMes] = useState(hoy.getMonth() + 1);
    const [tipo, setTipo] = useState("mes");
    const [semestre, setSemestre] = useState(1);

    const profile = { role: "admin" };


    // Cargar datos actual + anterior
useEffect(() => {
  setLoading(true);

  let rangoActual;
  if (tipo === "mes") rangoActual = buildMonthRangeISO(anio, mes);
  if (tipo === "semestre") rangoActual = buildSemesterRangeISO(anio, semestre);
  if (tipo === "anio") rangoActual = buildYearRangeISO(anio);

  const rangoPrev = getPreviousPeriod(tipo, anio, mes, semestre);

  const dentroDeRango = (v, r) =>
    new Date(v.salidaAt) >= new Date(r.inicio) &&
    new Date(v.salidaAt) < new Date(r.fin);

  const actuales = demoTrips.filter((v) =>
    dentroDeRango(v, rangoActual)
  );

  const previos = rangoPrev
    ? demoTrips.filter((v) => dentroDeRango(v, rangoPrev))
    : [];

  setViajes(actuales);
  setPrevViajes(previos);
  setLoading(false);
}, [anio, mes, semestre, tipo]);

const conductoresUnicos = useMemo(() => {
  return [
    ...new Set(
      demoTrips
        .map((v) => v.conductor)
        .filter(Boolean)
    ),
  ];
}, []);

const tractosUnicos = useMemo(() => {
  return [
    ...new Set(
      demoTrips
        .map((v) => v.patenteTracto)
        .filter(Boolean)
    ),
  ];
}, []);
const resumen = useMemo(() => {
  const totalViajes = viajes.length;

  const totalCombustible = viajes.reduce(
    (sum, v) => sum + (Number(v.gastoCombustible) || 0),
    0
  );

  const totalPeajes = viajes.reduce(
    (sum, v) => sum + (Number(v.totalPeajes) || 0),
    0
  );

  const totalViaticos = viajes.reduce(
    (sum, v) =>
      sum +
      (Number(v.viatico1) || 0) +
      (Number(v.viatico2) || 0) +
      (Number(v.viatico3) || 0),
    0
  );

  const costoTotal = viajes.reduce(
    (sum, v) => sum + (Number(v.costoTotal) || 0),
    0
  );

  return {
    totalViajes,
    totalCombustible,
    totalPeajes,
    totalViaticos,
    costoTotal,
  };
}, [viajes]);
// ===============================
// KPIs PERÍODO ANTERIOR
// ===============================
const resumenPrev = useMemo(() => {
  const totalViajes = prevViajes.length;

  const totalCombustible = prevViajes.reduce(
    (sum, v) => sum + (Number(v.gastoCombustible) || 0),
    0
  );

  const totalPeajes = prevViajes.reduce(
    (sum, v) => sum + (Number(v.totalPeajes) || 0),
    0
  );

  const totalViaticos = prevViajes.reduce(
    (sum, v) =>
      sum +
      (Number(v.viatico1) || 0) +
      (Number(v.viatico2) || 0) +
      (Number(v.viatico3) || 0),
    0
  );

  const costoTotal = prevViajes.reduce(
    (sum, v) => sum + (Number(v.costoTotal) || 0),
    0
  );

  const totalKms = prevViajes.reduce(
    (sum, v) => sum + (Number(v.kmsRecorridos) || 0),
    0
  );

  return {
    totalViajes,
    totalCombustible,
    totalPeajes,
    totalViaticos,
    costoTotal,
    totalKms
  };
}, [prevViajes]);

// ===============================
// COMPLETAR RESUMEN ACTUAL (KMS)
// ===============================
const resumenConKms = {
  ...resumen,
  totalKms: viajes.reduce(
    (sum, v) => sum + (Number(v.kmsRecorridos) || 0),
    0
  )
};

// ===============================
// GRÁFICO: COSTO POR CONDUCTOR
// ===============================
const resumenPorConductor = useMemo(() => {
  const mapa = {};

  viajes
    .filter(v => filtroConductor === "todos" || v.conductor === filtroConductor)
    .filter(v => filtroTracto === "todos" || v.patenteTracto === filtroTracto)
    .forEach((v) => {
      if (!mapa[v.conductor]) {
        mapa[v.conductor] = 0;
      }
      mapa[v.conductor] += Number(v.costoTotal) || 0;
    });

  return Object.entries(mapa).map(([conductor, costo]) => ({
    conductor,
    costo
  }));
}, [viajes, filtroConductor, filtroTracto]);

// ===============================
// GRÁFICO: LITROS POR TRACTO
// ===============================
const resumenPorTracto = useMemo(() => {
  const mapa = {};

  viajes
    .filter(v => filtroConductor === "todos" || v.conductor === filtroConductor)
    .filter(v => filtroTracto === "todos" || v.patenteTracto === filtroTracto)
    .forEach((v) => {
      if (!mapa[v.patenteTracto]) {
        mapa[v.patenteTracto] = 0;
      }
      mapa[v.patenteTracto] += Number(v.litrosPetroleo) || 0;
    });

  return Object.entries(mapa).map(([tracto, litros]) => ({
    tracto,
    litros
  }));
}, [viajes, filtroConductor, filtroTracto]);

    // Título
    let tituloPeriodo = "Reporte";
    if (tipo === "mes") tituloPeriodo = etiquetaMes(new Date(anio, mes - 1));
    if (tipo === "semestre") tituloPeriodo = `${semestre}° Semestre ${anio}`;
    if (tipo === "anio") tituloPeriodo = `Año ${anio}`;

    return (
        <div
            className="reportes-container"
            style={{ padding: 24, maxWidth: 1280, margin: "0 auto" }}
        >
            {/* Header + filtros */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 16,
                    marginBottom: 24
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: 28,
                            fontWeight: 600,
                            color: "#0f172a"
                        }}
                    >
                        {tituloPeriodo}
                    </h1>
                    <p style={{ margin: 0, marginTop: 4, color: "#6b7280", fontSize: 13 }}>
                        Comparado contra el período inmediatamente anterior.
                    </p>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <TextField
                        select
                        size="small"
                        label="Tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        sx={{ minWidth: 140 }}
                    >
                        {TIPOS_REPORTE.map((t) => (
                            <MenuItem key={t.value} value={t.value}>
                                {t.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    {tipo === "mes" && (
                        <TextField
                            select
                            size="small"
                            label="Mes"
                            value={mes}
                            onChange={(e) => setMes(Number(e.target.value))}
                            sx={{ minWidth: 140 }}
                        >
                            {MESES.map((m) => (
                                <MenuItem key={m.value} value={m.value}>
                                    {m.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    {tipo === "semestre" && (
                        <TextField
                            select
                            size="small"
                            label="Semestre"
                            value={semestre}
                            onChange={(e) => setSemestre(Number(e.target.value))}
                            sx={{ minWidth: 140 }}
                        >
                            <MenuItem value={1}>1° Semestre</MenuItem>
                            <MenuItem value={2}>2° Semestre</MenuItem>
                        </TextField>
                    )}

                    <TextField
                        select
                        size="small"
                        label="Año"
                        value={anio}
                        onChange={(e) => setAnio(Number(e.target.value))}
                        sx={{ minWidth: 110 }}
                    >
                        {[2023, 2024, 2025].map((y) => (
                            <MenuItem key={y} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* NUEVO FILTRO: CONDUCTOR */}
                    <TextField
                        select
                        size="small"
                        label="Conductor"
                        value={filtroConductor}
                        onChange={(e) => setFiltroConductor(e.target.value)}
                        sx={{ minWidth: 160 }}
                    >
                        <MenuItem value="todos">Todos</MenuItem>
                        {conductoresUnicos.map((c) => (
                            <MenuItem key={c} value={c}>
                                {c}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* NUEVO FILTRO: TRACTO */}
                    <TextField
                        select
                        size="small"
                        label="Tracto"
                        value={filtroTracto}
                        onChange={(e) => setFiltroTracto(e.target.value)}
                        sx={{ minWidth: 160 }}
                    >
                        <MenuItem value="todos">Todos</MenuItem>
                        {tractosUnicos.map((t) => (
                            <MenuItem key={t} value={t}>
                                {t}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
            </div>
            {loading ? (
                <p style={{ padding: 24 }}>Cargando reportes...</p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "320px 1fr",
                        gap: 24,
                        alignItems: "flex-start"
                    }}
                >
                    {/* Columna izquierda: KPIs */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* KPI — Rendiciones */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                        >
                            <Card>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    <div className="kpi-icon">
                                        <BarChart2 size={20} />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: 13 }}>Rendiciones</p>
                                        <p style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
                                            {resumen.totalViajes}
                                        </p>
                                        {diffLabel(resumen.totalViajes, resumenPrev.totalViajes)}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* KPI — KMs */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
                            <Card>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    <Truck size={20} />
                                    <div>
                                        <p style={{ margin: 0, fontSize: 13 }}>KMs recorridos</p>
                                        <p style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
                                            {formatoNumero(resumen.totalKms)}
                                        </p>
                                        {diffLabel(resumen.totalKms, resumenPrev.totalKms)}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* KPI — Combustible */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
                            <Card>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    <Fuel size={20} />
                                    <div>
                                        <p style={{ margin: 0, fontSize: 13 }}>Combustible</p>
                                        <p style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
                                            {formatoCLP(resumen.totalCombustible)}
                                        </p>
                                        {diffLabel(resumen.totalCombustible, resumenPrev.totalCombustible)}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* KPI — Peajes */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}>
                            <Card>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    <Wallet size={20} />
                                    <div>
                                        <p style={{ margin: 0, fontSize: 13 }}>Peajes</p>
                                        <p style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
                                            {formatoCLP(resumen.totalPeajes)}
                                        </p>
                                        {diffLabel(resumen.totalPeajes, resumenPrev.totalPeajes)}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* KPI — Viáticos */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
                            <Card>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    <UsersIcon size={20} />
                                    <div>
                                        <p style={{ margin: 0, fontSize: 13 }}>Viáticos</p>
                                        <p style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
                                            {formatoCLP(resumen.totalViaticos)}
                                        </p>
                                        {diffLabel(resumen.totalViaticos, resumenPrev.totalViaticos)}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* KPI — Costo total */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.25 }}>
                            <Card style={{ background: "#0f172a", color: "#fff" }}>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    <div className="kpi-icon" style={{ background: "#97aad2", color: "#0f172a" }}>
                                        <Wallet size={20} />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: 13, color: "#e5e5e5" }}>Costo total</p>
                                        <p style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
                                            {formatoCLP(resumen.costoTotal)}
                                        </p>
                                        {diffLabel(resumen.costoTotal, resumenPrev.costoTotal)}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                    </div>

                    {/* Columna derecha — GRÁFICOS */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                        {/* COSTO POR CONDUCTOR */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card>
                                <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 18, fontWeight: 600 }}>
                                    Costo total por conductor
                                </h2>
                                <p style={{ margin: 0, marginBottom: 12, fontSize: 12, color: "#6b7280" }}>
                                    Distribución del costo total en el período.
                                </p>

                                {resumenPorConductor.length === 0 ? (
                                    <p>No hay datos con los filtros seleccionados.</p>
                                ) : (
                                    <BarChart
                                        dataset={resumenPorConductor}
                                        xAxis={[{ dataKey: "conductor", scaleType: "band", label: "Conductor" }]}
                                        series={[{ dataKey: "costo", label: "Costo total", valueFormatter: (v) => formatoCLP(v) }]}
                                        height={320}
                                        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                                    />
                                )}
                            </Card>
                        </motion.div>

                        {/* LITROS POR TRACTO */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.05 }}
                        >
                            <Card>
                                <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 18, fontWeight: 600 }}>
                                    Litros de combustible por tracto
                                </h2>
                                <p style={{ margin: 0, marginBottom: 12, fontSize: 12, color: "#6b7280" }}>
                                    Consumo total de combustible por unidad.
                                </p>

                                {resumenPorTracto.length === 0 ? (
                                    <p>No hay datos con los filtros seleccionados.</p>
                                ) : (
                                    <BarChart
                                        dataset={resumenPorTracto}
                                        xAxis={[{ dataKey: "tracto", scaleType: "band", label: "Tracto" }]}
                                        series={[{ dataKey: "litros", label: "Litros", valueFormatter: (v) => `${formatoNumero(v)} L` }]}
                                        height={320}
                                        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                                    />
                                )}
                            </Card>
                        </motion.div>

                    </div>
                </div>
            )}
        </div>
    );
}
