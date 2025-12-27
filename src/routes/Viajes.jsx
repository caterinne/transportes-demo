import { useEffect, useState } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Pagination, 
    Stack
} from "@mui/material";

import { formatoCLP, formatoNumero } from "../utils/formatos.js";
import { CalendarDays, Truck, Fuel, Wallet, Trash2 } from "lucide-react";
import { formatoFechaHora } from "../utils/fechas";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { demoTrips } from "../demo/trips.js";

export default function HistorialRendiciones() {
    const companyId = "transportesOliva";

    const [rendiciones, setRendiciones] = useState([]);
    const [cargando, setCargando] = useState(false);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [rendicionSeleccionada, setRendicionSeleccionada] = useState(null);

    // -------------------------
    // ESTADOS DE FILTROS
    // -------------------------
    const [mes, setMes] = useState("Todos");
    const [anio, setAnio] = useState("Todos");
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");
    const [busqueda, setBusqueda] = useState("");

    const [aniosDisponibles, setAniosDisponibles] = useState([]);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success", // success | error | warning | info
    });

    const mostrarSnackbar = (message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    // -------------------------
    // PAGINACIÓN
    // -------------------------
    const [pagina, setPagina] = useState(1);
    const filasPorPagina = 10;

    // -------------------------
    // CARGAR RENDICIONES
    // -------------------------
const cargarRendiciones = () => {
  setCargando(true);

  const data = [...demoTrips].sort(
    (a, b) => new Date(b.salidaAt) - new Date(a.salidaAt)
  );

  setRendiciones(data);

  // años disponibles
  const anios = Array.from(
    new Set(
      data.map((r) => new Date(r.salidaAt).getFullYear())
    )
  ).sort((a, b) => b - a);

  setAniosDisponibles(anios);
  setCargando(false);
};

    useEffect(() => {
        cargarRendiciones();
    }, []);

    useEffect(() => {
        setPagina(1);
    }, [mes, anio, desde, hasta, busqueda]);

    // -------------------------
    // APLICAR FILTROS
    // -------------------------
    const filtrarRendiciones = () => {
        let lista = [...rendiciones];

        // FILTRO MES
        if (mes !== "Todos") {
        lista = lista.filter((r) => {
            const fecha = new Date(r.salidaAt);
            return fecha.getMonth() + 1 === parseInt(mes);
        });
        }

        // FILTRO AÑO
        if (anio !== "Todos") {
        lista = lista.filter((r) => {
            const fecha = new Date(r.salidaAt);
            return fecha.getFullYear() === parseInt(anio);
        });
        }

        // RANGO DESDE
if (desde) {
  lista = lista.filter(
    (r) => new Date(r.salidaAt) >= new Date(desde)
  );
}

if (hasta) {
  lista = lista.filter(
    (r) => new Date(r.salidaAt) <= new Date(hasta + "T23:59")
  );
}


        // BUSQUEDA
        if (busqueda.trim() !== "") {
        const txt = busqueda.toLowerCase();
        lista = lista.filter(
            (r) =>
            r.conductor?.toLowerCase().includes(txt) ||
            r.patenteTracto?.toLowerCase().includes(txt) ||
            r.destino?.toLowerCase().includes(txt)
        );
        }

        return lista;
    };

    const filtradas = filtrarRendiciones();

    // -------------------------
    // PAGINACIÓN FINAL
    // -------------------------
    const totalPaginas = Math.ceil(filtradas.length / filasPorPagina);
    const inicio = (pagina - 1) * filasPorPagina;
    const paginaActual = filtradas.slice(inicio, inicio + filasPorPagina);

    // -------------------------
    // LIMPIAR FILTROS
    // -------------------------
    const limpiarFiltros = () => {
        setMes("Todos");
        setAnio("Todos");
        setDesde("");
        setHasta("");
        setBusqueda("");
        setPagina(1);
    };

    const abrirModal = (rendicion) => {
    setRendicionSeleccionada(rendicion);
    setModalAbierto(true);
    };

    const cerrarModal = () => {
    setRendicionSeleccionada(null);
    setModalAbierto(false);
    };

const eliminarRendicion = () => {
  mostrarSnackbar("Modo DEMO: no se eliminan rendiciones", "info");
  cerrarModal();
};


    return (
        <div className="viajes-container">
        {/* FILTROS */}
        <div className="filtros-container">

            {/* MES */}
            <FormControl size="small">
            <InputLabel>Mes</InputLabel>
            <Select
                value={mes}
                label="Mes"
                onChange={(e) => setMes(e.target.value)}
                style={{ width: 150, background: "var(--muted-surface)" }}
            >
                <MenuItem value="Todos">Todos</MenuItem>
                {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("es-CL", { month: "long" })}
                </MenuItem>
                ))}
            </Select>
            </FormControl>

            {/* AÑO */}
            <FormControl size="small">
            <InputLabel>Año</InputLabel>
            <Select
                value={anio}
                label="Año"
                onChange={(e) => setAnio(e.target.value)}
                style={{ width: 120, background: "var(--muted-surface)" }}
            >
                <MenuItem value="Todos">Todos</MenuItem>
                {aniosDisponibles.map((a) => (
                <MenuItem key={a} value={a}>
                    {a}
                </MenuItem>
                ))}
            </Select>
            </FormControl>

            {/* DESDE */}
            <TextField
            label="Desde"
            type="date"
            size="small"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ background: "var(--muted-surface)" }}
            />

            {/* HASTA */}
            <TextField
            label="Hasta"
            type="date"
            size="small"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ background: "var(--muted-surface)" }}
            />

            {/* Derecha: buscador + limpiar */}
            <div className="filtros-derecha">
            <TextField
                fullWidth
                size="small"
                placeholder="Buscar por conductor, patente o destino..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            <button className="limpiarFiltros" onClick={limpiarFiltros}>Limpiar Filtros</button>
            </div>
        </div>

        {/* TABLA */}
        <div className="table-container">
            {cargando ? (
            <p className="empty">Cargando rendiciones...</p>
            ) : paginaActual.length === 0 ? (
            <p className="empty">No hay resultados</p>
            ) : (
            <table>
                <thead>
                <tr>
                    <th>Salida</th>
                    <th>Conductor</th>
                    <th>Tracto</th>
                    <th>Rampla</th>
                    <th>Destino</th>
                    <th>KMs</th>
                    <th>Gastos (S/ Comb.)</th>
                    <th>Costo Total</th>
                </tr>
                </thead>

                <tbody>
                {paginaActual.map((r) => (
                    <tr key={r.id} className="clickable-row" onClick={() => abrirModal(r)}>
                    <td><strong>{formatoFechaHora(r.salidaAt)}</strong></td>
                    <td>{r.conductor}</td>
                    <td>{r.patenteTracto}</td>
                    <td>{r.patenteRampla || "-"}</td>
                    <td>{r.destino.toUpperCase()}</td>
                    <td>{formatoNumero(r.kmsRecorridos)}</td>
                    <td>{formatoCLP(r.gastos)}</td>
                    <td>{formatoCLP(r.costoTotal)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
        </div>

        {/* PAGINACIÓN */}
        {totalPaginas > 1 && (
        <Stack
            alignItems="center"
            sx={{ mt: 3 }}
        >
            <Pagination
            count={totalPaginas}
            page={pagina}
            onChange={(_, value) => setPagina(value)}
            color="primary"
            shape="rounded"
            />
        </Stack>
        )}

        {modalAbierto && rendicionSeleccionada && (
            <div className="modal-overlay" onClick={cerrarModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* ICONO ELIMINAR */}
                <button
                    className="delete-icon"
                    onClick={eliminarRendicion}
                    title="Eliminar rendición"
                >
                    <Trash2 size={20} />
                </button>

                <h2>Detalle de Rendición</h2>

                <div className="modal-grid">
                {/* Columna 1 */}
                <div className="modal-section">
                    <h3><CalendarDays size={18} /> Datos del Viaje</h3>
                    <p><strong>Origen:</strong> {rendicionSeleccionada.origen.toUpperCase() || "-"}</p>
                    <p><strong>Destino:</strong> {rendicionSeleccionada.destino.toUpperCase() || "-"}</p>
                    <p><strong>Salida:</strong> {formatoFechaHora(rendicionSeleccionada.salidaAt)}</p>
                    <p><strong>Llegada:</strong> {formatoFechaHora(rendicionSeleccionada.llegadaAt)}</p>
                    <p><strong>Guía:</strong> {rendicionSeleccionada.guiaHojaRuta || "-"}</p>

                    <h3><Truck size={18} /> Vehículos y Conductor</h3>

                    {/* CLICK EN EL NOMBRE DEL CONDUCTOR */}
                    <p><strong>Conductor:</strong>{rendicionSeleccionada.conductor}</p>
                    <p><strong>Tracto:</strong> {rendicionSeleccionada.patenteTracto}</p>
                    <p><strong>Rampla:</strong> {rendicionSeleccionada.patenteRampla || "-"}</p>
                    <p><strong>Odómetro Inicial:</strong> {formatoNumero(rendicionSeleccionada.odometroInicial)}</p>
                    <p><strong>Odómetro Final:</strong> {formatoNumero(rendicionSeleccionada.odometroFinal)}</p>
                    <p><strong>KMs:</strong> {formatoNumero(rendicionSeleccionada.kmsRecorridos)}</p>
                </div>

                {/* Columna 2 */}
                <div className="modal-section">
                    <h3><Fuel size={18} /> Combustible</h3>
                    <p><strong>Litros:</strong> {rendicionSeleccionada.litrosPetroleo}</p>
                    <p><strong>Precio/Litro:</strong> {formatoCLP(rendicionSeleccionada.precioLitro)}</p>
                    <p><strong>Gasto Combustible:</strong> {formatoCLP(rendicionSeleccionada.gastoCombustible)}</p>

                    <h3><Wallet size={18} /> Gastos</h3>
                    <p><strong>Peajes:</strong> {formatoCLP(rendicionSeleccionada.totalPeajes)}</p>
                    <p><strong>Viático 1:</strong> {formatoCLP(rendicionSeleccionada.viatico1)}</p>
                    <p><strong>Viático 2:</strong> {formatoCLP(rendicionSeleccionada.viatico2)}</p>
                    <p><strong>Viático 3:</strong> {formatoCLP(rendicionSeleccionada.viatico3)}</p>
                    <p><strong>Devolución:</strong> {formatoCLP(rendicionSeleccionada.devolucion)}</p>

                    <hr />
                    <p><strong>Costo Total:</strong> {formatoCLP(rendicionSeleccionada.costoTotal)}</p>
                </div>
                </div>
                <button className="close-btn" onClick={cerrarModal}>
                    Cerrar
                </button>
            </div>
            </div>
        )}
        <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
        <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
        >
            {snackbar.message}
        </Alert>
        </Snackbar>
        </div>
    );
}
