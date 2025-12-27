import { useEffect, useState } from "react";

import { TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
    CircleCheckBig,
    Search,
    X,
    Stethoscope,
    Clock,
    Palmtree,
    Ban,
} from "lucide-react";

import { demoDrivers } from "../demo/drivers";
import { demoTrips } from "../demo/trips";
import { demoLicenses } from "../demo/licenses";


import { useAuth } from "../context/AuthContext";
import { formatoCLP, formatoNumero } from "../utils/formatos.js";
import StatusPill from "../components/StatusPill";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";


export default function Conductores() {
  const [conductores, setConductores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalLicenciaAbierto, setModalLicenciaAbierto] = useState(false);

  const [viajesConductor, setViajesConductor] = useState([]);
  const [conductorSeleccionado, setConductorSeleccionado] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    telefono: "",
  });

  const [licenciaForm, setLicenciaForm] = useState({
    desde: "",
    hasta: "",
    tipo: "LICENCIA MEDICA",
  });

  const [loading, setLoading] = useState(false);
  const [guardandoLicencia, setGuardandoLicencia] = useState(false);
  const [cargando, setCargando] = useState(false);

  const companyId = "transportesOliva";
  const { profile } = useAuth();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const mostrarSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  /* ===============================
      CARGAR CONDUCTORES + LICENCIAS
  =============================== */
const cargarConductores = () => {
  setCargando(true);

  const data = Object.values(demoDrivers).map((d) => {
    const licencias = demoLicenses[d.id] || [];

    const totalViaticosMes = demoTrips
      .filter((v) => v.conductorId === d.id)
      .reduce(
        (sum, v) =>
          sum +
          (Number(v.viatico1) || 0) +
          (Number(v.viatico2) || 0) +
          (Number(v.viatico3) || 0),
        0
      );

    return {
      ...d,
      licencias,
      totalViaticosMes,
    };
  });

  setConductores(data);
  setCargando(false);
};



  useEffect(() => {
    cargarConductores();
  }, []);

  /* ===============================
      FORMULARIO CONDUCTOR
  =============================== */
  const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = (e) => {
  e.preventDefault();
  mostrarSnackbar("Modo DEMO: acción deshabilitada", "info");
};


  /* ===============================
      LICENCIAS
  =============================== */
    const estadoConfig = {
    "LICENCIA MEDICA": {
        label: "Licencia médica",
        icon: Stethoscope,
        color: "#2563eb",
        bg: "#dbeafe",
    },
    PERMISO: {
        label: "Permiso",
        icon: Clock,
        color: "#f59e0b",
        bg: "#ffedd5",
    },
    VACACIONES: {
        label: "Vacaciones",
        icon: Palmtree,
        color: "#7616a3",
        bg: "#ede2fe",
    },
    SUSPENSION: {
        label: "Suspensión",
        icon: Ban,
        color: "#dc2626",
        bg: "#fee2e2",
    },
    };

const obtenerLicenciaVigente = (conductor) => {
  if (!conductor.licencias?.length) return null;

  const hoy = new Date();

  return conductor.licencias.find(
    (l) => hoy >= l.desde && hoy <= l.hasta
  );
};

const licenciaEstaVigente = (l) => {
  const hoy = new Date();
  return hoy >= l.desde && hoy <= l.hasta;
};


const guardarLicencia = () => {
  mostrarSnackbar("Modo DEMO: no se guardan cambios", "info");
  setModalLicenciaAbierto(false);
};

  const EstadoConductorPill = ({ licencia }) => {
    if (!licencia) {
        return (
        <span className="estado-pill activo">
            <CircleCheckBig size={14} /> Activo
        </span>
        );
    }

    const config = estadoConfig[licencia.tipo];
    const Icon = config.icon;
    return (
        <span
        className="estado-pill"
        style={{
            color: config.color,
            background: config.bg,
            border: `1px solid ${config.color}33`,
        }}
        >
        <Icon size={14} />
        {config.label}
        </span>
    );
    };

  /* ===============================
      FILTRO (BÚSQUEDA)
  =============================== */
  const filtrados = conductores.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.rut.toLowerCase().includes(busqueda.toLowerCase())
  );

  /* ===============================
      VIAJES
  =============================== */
const cargarViajesConductor = (conductorId) => {
  const viajes = demoTrips.filter(
    (v) => v.conductorId === conductorId
  );
  setViajesConductor(viajes);
};


  const abrirModalConductor = async (c) => {
    setConductorSeleccionado(c);
    await cargarViajesConductor(c.id);
    setModalAbierto(true);
  };

  /* ===============================
      DATAGRID DATA (PRE-FORMATEADO)
  =============================== */
const filasLicencias =
  conductorSeleccionado?.licencias?.map((l, i) => ({
    id: i,
    tipo: l.tipo,
    desde: new Date(l.desde).toLocaleDateString(),
    hasta: new Date(l.hasta).toLocaleDateString(),
    estado: licenciaEstaVigente(l) ? "VIGENTE" : "FINALIZADA",
  })) || [];


  const columnasLicencias = [
    { field: "tipo", headerName: "Tipo", flex: 1 },
    { field: "desde", headerName: "Desde", flex: 1 },
    { field: "hasta", headerName: "Hasta", flex: 1 },
    {
    field: "estado",
    headerName: "Estado",
    flex: 1,
    sortable: false,
    renderCell: (params) => (
        <StatusPill status={params.value} />
    ),
    }
  ];

  const filasViajes = viajesConductor.map((v) => ({
    id: v.id,
    salidaAt: new Date(v.salidaAt).toLocaleDateString(),
    destino: v.destino.toUpperCase(),
    kmsRecorridos: formatoNumero(v.kmsRecorridos),
    costoTotal: formatoCLP(v.costoTotal),
  }));

  const columnasViajes = [
    { field: "salidaAt", headerName: "Salida", flex: 1 },
    { field: "destino", headerName: "Destino", flex: 1 },
    { field: "kmsRecorridos", headerName: "KMs", flex: 1 },
    { field: "costoTotal", headerName: "Total", flex: 1 },
  ];

  /* ===============================
      RENDER
  =============================== */
  return (
    <div className="conductores-container">
      {/* FORMULARIO */}
    {["admin", "developer"].includes(profile?.role) && (
      <form onSubmit={handleSubmit} className="conductor-form">
        <div className="form-row">
          <TextField fullWidth label="Nombre y Apellido" name="nombre" size="small" value={form.nombre} onChange={handleChange} />
          <TextField fullWidth label="RUT" name="rut" size="small" value={form.rut} onChange={handleChange} />
          <TextField fullWidth label="Teléfono" name="telefono" size="small" value={form.telefono} onChange={handleChange} />
          <button type="submit" className="patente-button" disabled={loading}>
            {loading ? <span className="spinner"></span> : "Añadir"}
          </button>
        </div>
      </form>
    )}
      <h1 className="dashboard-title">Conductores</h1>

      {/* BUSCADOR */}
      <div className="toolbar">
        {!mostrarBusqueda && (
          <button className="toolbar-btn" onClick={() => setMostrarBusqueda(true)}>
            <Search size={18} />
          </button>
        )}
        <div className={`search-wrapper ${mostrarBusqueda ? "open" : ""}`}>
          <TextField
            label="Buscar conductor o RUT"
            size="small"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            autoFocus={mostrarBusqueda}
            onBlur={() => setTimeout(() => setMostrarBusqueda(false), 150)}
          />
        </div>
        {mostrarBusqueda && (
          <button className="toolbar-btn" onClick={() => setMostrarBusqueda(false)}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* TABLA CONDUCTORES */}
      <div className="table-container">
        {cargando ? (
          <p className="empty">Cargando conductores...</p>
        ) : filtrados.length === 0 ? (
          <p className="empty">No se encontraron conductores</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>RUT</th>
                <th>Teléfono</th>
                <th>Viatico mes actual ($)</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c) => (
                <tr key={c.id} onClick={() => abrirModalConductor(c)}>
                    <td>{c.nombre}</td>
                    <td>{c.rut}</td>
                    <td>{c.telefono}</td>
                    <td>{formatoCLP(c.totalViaticosMes)}</td>
                    <td>
                        <EstadoConductorPill licencia={obtenerLicenciaVigente(c)} />
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
    {modalAbierto && (
        <div className="modal-overlay-conduct">
            <div className="modal-content-conduct">
            <button className="modal-close-conduct" onClick={() => setModalAbierto(false)}>
                <X size={20} />
            </button>
            <h1 style={{ textAlign: "center" }}>
                {conductorSeleccionado?.nombre}
            </h1>

            <h2>Licencias</h2>
            <div style={{ height: 250, width: "100%", marginBottom: 20 }} className="datagrid-wrapper">
                <DataGrid
                    density="standard"
                    headerHeight={42}
                    rowHeight={50}
                    rows={filasLicencias}
                    columns={columnasLicencias}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5, page: 0 } },
                    }}
                    disableRowSelectionOnClick
                    localeText={{ noRowsLabel: "No tiene licencias registradas" }}
                    sx={{
                    border: "none",
                    fontSize: "0.9rem",
                    color: "#111827",

                    /* HEADER */
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#b7b9bcff",
                        color: "#000000ff",
                        fontWeight: 600,
                        borderBottom: "2px solid #afc4f0ff",
                    },

                    "& .MuiDataGrid-columnSeparator": {
                        display: "none",
                    },

                    /* CELDAS */
                    "& .MuiDataGrid-cell": {
                        borderBottom: "1px solid #f1f5f9",
                        padding: "14px 16px",

                        display: "flex",
                        alignItems: "center",
                    },

                    "& .MuiDataGrid-row:nth-of-type(even)": {
                        backgroundColor: "#f9fafb",
                    },

                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: "#f1f5f9",
                    },

                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "1px solid #e5e7eb",
                        backgroundColor: "white",
                        minHeight: 44,
                    },

                    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
                        outline: "none",
                    },
                    }}
                />
            </div>
            {["admin", "developer"].includes(profile?.role) && (
            <button
                className="patente-button danger"
                onClick={() => setModalLicenciaAbierto(true)}
                style={{ marginBottom: 10 }}
            >
                Agregar Licencia
            </button>
            )}

            <h2>Viajes</h2>
            <div style={{ height: 300, width: "100%" }} className="datagrid-wrapper">
              <DataGrid
                density="standard"
                headerHeight={48}
                rowHeight={56}
                rows={filasViajes}
                columns={columnasViajes}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5, page: 0 } },
                }}
                disableRowSelectionOnClick
                localeText={{ noRowsLabel: "No tiene rendiciones registradas" }}
                    sx={{
                    border: "none",
                    fontSize: "0.9rem",
                    color: "#111827",

                    /* HEADER */
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#b7b9bcff",
                        color: "#000000ff",
                        fontWeight: 600,
                        borderBottom: "2px solid #afc4f0ff",
                    },

                    "& .MuiDataGrid-columnSeparator": {
                        display: "none",
                    },

                    /* CELDAS */
                    "& .MuiDataGrid-cell": {
                        borderBottom: "1px solid #f1f5f9",
                        padding: "14px 16px",

                        display: "flex",
                        alignItems: "center",
                    },

                    "& .MuiDataGrid-row:nth-of-type(even)": {
                        backgroundColor: "#f9fafb",
                    },

                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: "#f1f5f9",
                    },

                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "1px solid #e5e7eb",
                        backgroundColor: "white",
                        minHeight: 44,
                    },

                    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
                        outline: "none",
                    },
                    }}
                />

            </div>
          </div>
        </div>
      )}

      {/* MODAL LICENCIA */}
      {modalLicenciaAbierto && (
        <div className="modal-overlay-conduct">
          <div className="modal-content-conduct">
            <button className="modal-close-conduct" onClick={() => setModalLicenciaAbierto(false)}>
              <X size={20} />
            </button>

            <h2>Registrar Licencia</h2>
            <p>{conductorSeleccionado?.nombre}</p>

            <TextField fullWidth type="date" label="Desde" InputLabelProps={{ shrink: true }}
              value={licenciaForm.desde}
              onChange={(e) => setLicenciaForm({ ...licenciaForm, desde: e.target.value })}
              style={{ marginTop: 10 }}
            />

            <TextField fullWidth type="date" label="Hasta" InputLabelProps={{ shrink: true }}
              value={licenciaForm.hasta}
              onChange={(e) => setLicenciaForm({ ...licenciaForm, hasta: e.target.value })}
              style={{ marginTop: 10 }}
            />

            <TextField fullWidth select label="Tipo" SelectProps={{ native: true }}
              value={licenciaForm.tipo}
              onChange={(e) => setLicenciaForm({ ...licenciaForm, tipo: e.target.value })}
              style={{ marginTop: 10 }}
            >
              <option value="LICENCIA MEDICA">Licencia médica</option>
              <option value="VACACIONES">Vacaciones</option>
              <option value="PERMISO">Permiso</option>
              <option value="SUSPENSION">Suspensión</option>
            </TextField>

            <button
              className="patente-button"
              onClick={guardarLicencia}
              disabled={guardandoLicencia}
              style={{ marginTop: 20 }}
            >
              {guardandoLicencia ? "Guardando..." : "Guardar Licencia"}
            </button>
          </div>
        </div>
      )}
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
    </div>
  );
}
