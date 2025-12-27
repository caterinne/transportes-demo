import { useEffect, useState } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Pagination,
  Stack
} from "@mui/material";


import { Search, X, Truck, Wrench, CheckCircle, AlertTriangle, Clock, Calendar, BookAlert } from "lucide-react";

import { demoVehicles } from "../demo/vehicles.js";

export default function Patentes() {
  const [patentes, setPatentes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [nuevaPatente, setNuevaPatente] = useState("");
  const [tipo, setTipo] = useState("tracto");
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);

  const companyId = "transportesOliva";
  const profile = {
    role: "admin", // o "developer"
  };


  const [openPana, setOpenPana] = useState(false);
  const [fechaPana, setFechaPana] = useState("");
  const [motivoPana, setMotivoPana] = useState("");


  const [openReactivar, setOpenReactivar] = useState(false);
  const [fechaReactivacion, setFechaReactivacion] = useState("");
  const [truckSeleccionado, setTruckSeleccionado] = useState(null);

  const [openHistorial, setOpenHistorial] = useState(false);
  const [historial, setHistorial] = useState([]);
  

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  const totalPages = Math.ceil(historial.length / ITEMS_PER_PAGE);

  const historialPaginado = historial.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const [openVender, setOpenVender] = useState(false);
  const [fechaVenta, setFechaVenta] = useState("");


const cargarPatentes = () => {
  setCargando(true);

const tractos = (demoVehicles.tractos || []).map((t, i) => ({
  id: `tracto-${i}`,
  patente: t.patente,
  tipo: "tracto",
  activo: true,
  vendido: false,
  fechaVenta: null,

  // 🔧 HISTORIAL DE PANAS (MOCK)
  historialPanas: [
    {
      inicio: "2025-02-10T08:30",
      fin: "2025-02-11T14:45",
      motivo: "Falla en sistema de frenos"
    },
    {
      inicio: "2025-05-03T06:00",
      fin: "2025-05-05T18:20",
      motivo: "Problema eléctrico en tablero"
    }
  ]
}));


  const ramplas = (demoVehicles.ramplas || []).map((r, i) => ({
    id: `rampla-${i}`,
    patente: r.patente,
    tipo: "rampla",
    activo: r.activo ?? true,
    vendido: false,
    historialPanas: [],
    fechaVenta: null
  }));

  setPatentes([...tractos, ...ramplas]);
  setCargando(false);
};



  useEffect(() => {
    cargarPatentes();
  }, []);

const agregarPatente = (e) => {
  e.preventDefault();
  alert("Modo DEMO: no se pueden agregar patentes");
};

const filtradas = patentes
  .filter((p) =>
    (p.patente || "")
      .toString()
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )


  const EstadoCamionPill = ({ activo, tipo, vendido }) => {
    // 🚚 RAMPA → siempre operativa
    if (tipo === "rampla") {
      return (
        <span
          className="estado-pill"
          style={{
            color: "#16a34a",
            background: "#dcfce7",
            border: "1px solid #16a34a33",
            cursor: "default",
          }}
        >
          <Truck size={14} />
          Operativo
        </span>
      );
    }
    if (vendido) {
      return (
        <span
          className="estado-pill"
          style={{
            color: "#475569",
            background: "#e5e7eb",
            border: "1px solid #94a3b8",
            cursor: "default",
          }}
        >
          VENDIDO
        </span>
      );
    }
    // 🚛 TRACTO
    const enPana = !activo;

    return (
      <span
        className="estado-pill"
        style={{
          color: enPana ? "#dc2626" : "#16a34a",
          background: enPana ? "#fee2e2" : "#dcfce7",
          border: `1px solid ${
            enPana ? "#dc2626" : "#16a34a"
          }33`,
          cursor: "pointer",
        }}
      >
        {enPana ? <Wrench size={14} /> : <Truck size={14} />}
        {enPana ? "En pana" : "Operativo"}
      </span>
    );
  };

  const venderCamion = (truck) => {
    setTruckSeleccionado(truck);
    setOpenVender(true);
  };

const activarPanaAsync = () => {
  alert("Modo DEMO: acción deshabilitada");
};

const reactivarAsync = () => {
  alert("Modo DEMO: acción deshabilitada");
};

const venderCamionAsync = () => {
  alert("Modo DEMO: acción deshabilitada");
};
const cargarHistorial = (truck) => {
  const raw = Array.isArray(truck.historialPanas)
    ? truck.historialPanas
    : [];

  const data = raw.map((h) => {
    const inicio = new Date(h.inicio);
    const fin = h.fin ? new Date(h.fin) : null;

    const diffMs = (fin ?? new Date()) - inicio;
    const horas = Math.floor(diffMs / 36e5);
    const dias = Math.floor(horas / 24);

    return {
      inicio,
      fin,
      dias,
      horas: horas % 24,
      motivo: h.motivo,
      enCurso: !fin,
    };
  });

  setHistorial(data);
  setPage(1);
  setOpenHistorial(true);
};


  return (
    <div className="patentes-container">
      {/* FORMULARIO */}
    {["admin", "developer"].includes(profile?.role) && (
      <form onSubmit={agregarPatente} className="patentes-form">
        <div className="form-item">
          <TextField
            fullWidth
            size="small"
            label="Nueva patente"
            placeholder="Ej: AB-CD-12"
            value={nuevaPatente}
            onChange={(e) => setNuevaPatente(e.target.value)}
          />
        </div>
        <div className="form-item">
          <FormControl fullWidth size="small">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={tipo}
              label="Tipo"
              onChange={(e) => setTipo(e.target.value)}
            >
              <MenuItem value="tracto">Tracto / Camión</MenuItem>
              <MenuItem value="rampla">Rampla / Carro</MenuItem>
            </Select>
          </FormControl>
        </div>
        <button type="submit" className="patente-button" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Añadir"}
        </button>
      </form>
    )}
      <h1 className="dashboard-title">Patentes</h1>
      <div className="toolbar">
        <div className="toolbar-left">
          {/* SELECT */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Filtrar</InputLabel>
            <Select
              value={filtroTipo}
              label="Filtrar"
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="tracto">Tracto / Camión</MenuItem>
              <MenuItem value="rampla">Rampla / Carro</MenuItem>
              <MenuItem value="vendidos">Vendidos</MenuItem>
            </Select>
          </FormControl>

          {/* Cuando está cerrado → botón va aquí */}
          {!mostrarBusqueda && (
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => setMostrarBusqueda(true)}
            >
              <Search size={18} />
            </button>
          )}

          {/* Buscador (animado scaleX) */}
          <div className={`search-wrapper ${mostrarBusqueda ? "open" : ""}`}>
            <TextField
              label="Buscar patente"
              size="small"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              autoFocus={mostrarBusqueda}
              onBlur={() => setTimeout(() => setMostrarBusqueda(false), 150)}
            />
          </div>
        </div>

        {/* Cuando está abierto → botón X va a la derecha */}
        {mostrarBusqueda && (
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => setMostrarBusqueda(false)}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* TABLA */}
      <div className="table-container">
        {cargando ? (
          <p className="empty">Cargando patentes...</p>
        ) : filtradas.length === 0 ? (
          <p className="empty">No se encontraron patentes</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Patente</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>¿Vendido?</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => {
                    if (p.tipo === "rampla") return;
                    cargarHistorial(p);
                  }}
                  style={{
                    cursor: p.tipo === "rampla" ? "default" : "pointer",
                  }}
                >
                  <td>{p.patente}</td>
                  <td>{p.tipo === "tracto" ? "Tracto / Camión" : "Rampla / Carro"}</td>
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!["admin", "developer"].includes(profile?.role)) return;
                      if (p.vendido) return;
                      if (!p.activo) {
                        setTruckSeleccionado(p);
                        setOpenReactivar(true);
                      } else {
                        solicitarPana(p);
                      }
                    }}
                  >
                    <EstadoCamionPill activo={p.activo} tipo={p.tipo} vendido={p.vendido} />
                  </td>
                  <td>
                    {!p.vendido && ["admin", "developer"].includes(profile?.role) && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        sx={{
                          color: "error.main",
                          borderColor: "error.main",
                          "&:hover": {
                            color: "white",
                            borderColor: "error.main",
                            backgroundColor: "error.main",
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          venderCamion(p);
                        }}
                      >
                        Vender
                      </Button>
                    )}
                    {p.fechaVenta ? new Date(p.fechaVenta).toLocaleString() : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Dialog open={openReactivar} onClose={() => setOpenReactivar(false)}>
          <DialogTitle>Reactivar camión</DialogTitle>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await reactivarAsync(truckSeleccionado, fechaReactivacion);
              setOpenReactivar(false);
              setFechaReactivacion("");
            }}
          >
            <DialogContent>
              <TextField
                type="datetime-local"
                label="Fecha y hora de reactivación"
                fullWidth
                value={fechaReactivacion}
                onChange={(e) => setFechaReactivacion(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root legend': {
                    width: 'auto',
                  },
                  '& .MuiOutlinedInput-root fieldset': {
                    paddingTop: '8px',
                  },
                }}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenReactivar(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!fechaReactivacion}
              >
                Reactivar
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <Dialog
          open={openHistorial}
          onClose={() => setOpenHistorial(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Wrench size={20} />
            Historial de Panas
          </DialogTitle>
            <DialogContent dividers>
              {historialPaginado.length === 0 ? (
                <p style={{ textAlign: "center", color: "#64748b" }}>
                  No hay historial de panas
                </p>
              ) : (
                historialPaginado.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 12,
                      backgroundColor: h.enCurso ? "#fff7ed" : "#f8fafc",
                    }}
                  >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {h.enCurso ? (
                        <AlertTriangle size={18} color="#ea580c" />
                      ) : (
                        <CheckCircle size={18} color="#16a34a" />
                      )}

                      <strong>
                        {h.enCurso ? "En curso" : "Finalizada"}
                      </strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        color: "#475569",
                      }}
                    >
                      <Clock size={14} />
                      {h.dias} días {h.horas} hrs
                    </div>
                  </div>

                  {/* Fechas */}
                  <div
                    style={{
                      fontSize: 14,
                      color: "#334155",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Calendar size={14} />
                      <strong>Inicio:</strong> {h.inicio.toLocaleString()}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Calendar size={14} />
                      <strong>Fin:</strong>{" "}
                      {h.fin ? h.fin.toLocaleString() : "—"}
                    </div>
                    {h.motivo && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color:"black", fontStyle: "italic",}}>
                        <BookAlert size={14} /> <strong>Motivo:</strong> {h.motivo}
                      </div>
                    )}
                  </div>
                </div>
                ))
              )}
              {/* PAGINACIÓN */}
              {totalPages > 1 && (
                <Stack alignItems="center" sx={{ mt: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                  />
                </Stack>
              )}
            </DialogContent>
          </Dialog>

        <Dialog open={openPana} onClose={() => setOpenPana(false)}>
          <DialogTitle>Ingresar pana</DialogTitle>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await activarPanaAsync(truckSeleccionado, fechaPana, motivoPana);
                setOpenPana(false);
                setFechaPana("");
                setMotivoPana("");
              }}
            >
            <DialogContent>
              <TextField
                type="datetime-local"
                label="Fecha y hora de la pana"
                fullWidth
                value={fechaPana}
                onChange={(e) => setFechaPana(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root legend': {
                    width: 'auto',
                  },
                  '& .MuiOutlinedInput-root fieldset': {
                    paddingTop: '8px',
                  },
                }}
              />
              <TextField
                label="Motivo de la pana"
                fullWidth
                multiline
                minRows={2}
                value={motivoPana}
                onChange={(e) => setMotivoPana(e.target.value)}
                placeholder="Ej: Falla en frenos, problema eléctrico..."
                sx={{ mt: 2 }}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenPana(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!fechaPana}
              >
                Confirmar
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog open={openVender} onClose={() => setOpenVender(false)}>
          <DialogTitle>Vender camión</DialogTitle>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await venderCamionAsync(truckSeleccionado, fechaVenta);
            }}
          >
            <DialogContent>
              <TextField
                type="datetime-local"
                label="Fecha y hora de venta"
                fullWidth
                value={fechaVenta}
                onChange={(e) => setFechaVenta(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenVender(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="error"
                disabled={!fechaVenta}
              >
                Confirmar venta
              </Button>
            </DialogActions>
          </form>
        </Dialog>

      </div>
    </div>
  );
}

