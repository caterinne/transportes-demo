import { formatoCLP, formatoNumero } from "../utils/formatos.js";
import { etiquetaMes, formatoFechaHora } from "../utils/fechas";
import { useEffect, useState } from "react";
import { CalendarDays, Truck, Fuel, Wallet, ChevronLeft, ChevronRight } from "lucide-react";

import { DEMO_MODE } from "../demoConfig";
import { demoTrips } from "../demo/trips";
import { demoDrivers } from "../demo/drivers";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalViajes: 0,
    totalCombustible: 0,
    totalPeajes: 0,
  });

  const [ultimosViajes, setUltimosViajes] = useState([]);

  // Modal rendición
  const [rendicionSeleccionada, setRendicionSeleccionada] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  // Modal conductor
  const [modalConductor, setModalConductor] = useState(false);
  const [infoConductor, setInfoConductor] = useState(null);
  const [viajesConductor, setViajesConductor] = useState([]);

  const companyId = "transportesOliva";

  const [indiceRendicion, setIndiceRendicion] = useState(0);


  // -----------------------------
  // Cargar datos del Dashboard
  // -----------------------------
  useEffect(() => {
    if (!DEMO_MODE) return;

    const data = demoTrips;

    const totalViajes = data.length;
    const totalCombustible = data.reduce(
      (sum, v) => sum + (Number(v.gastoCombustible) || 0),
      0
    );
    const totalPeajes = data.reduce(
      (sum, v) => sum + (Number(v.totalPeajes) || 0),
      0
    );

    setStats({ totalViajes, totalCombustible, totalPeajes });
    setUltimosViajes(data);
  }, []);


  useEffect(() => {
    if (!mostrarDetalle) return;

    const handler = (e) => {
      if (e.key === "ArrowLeft") irAnterior();
      if (e.key === "ArrowRight") irSiguiente();
      if (e.key === "Escape") cerrarDetalle();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mostrarDetalle, indiceRendicion]);


  const abrirDetalle = (rendicion, index) => {
    setRendicionSeleccionada(rendicion);
    setIndiceRendicion(index);
    setMostrarDetalle(true);
  };

  const cerrarDetalle = () => {
    setMostrarDetalle(false);
    setRendicionSeleccionada(null);
  };

  // -----------------------------
  // Abrir modal con info del conductor
  // -----------------------------
  const abrirModalConductor = (conductorId) => {
    const conductor = demoDrivers[conductorId];
    if (!conductor) return;

    setInfoConductor(conductor);

    const viajes = demoTrips.filter(
      (v) => v.conductorId === conductorId
    );

    setViajesConductor(viajes);
    setModalConductor(true);
  };


  const irAnterior = () => {
    if (indiceRendicion > 0) {
      const nuevoIndice = indiceRendicion - 1;
      setIndiceRendicion(nuevoIndice);
      setRendicionSeleccionada(ultimosViajes[nuevoIndice]);
    }
  };

  const irSiguiente = () => {
    if (indiceRendicion < ultimosViajes.length - 1) {
      const nuevoIndice = indiceRendicion + 1;
      setIndiceRendicion(nuevoIndice);
      setRendicionSeleccionada(ultimosViajes[nuevoIndice]);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">{etiquetaMes()}</h1>

      {/* Tarjetas con KPIs */}
      <div className="dashboard-cards">
        <div className="card">
          <h2>Rendiciones</h2>
          <p>{stats.totalViajes}</p>
        </div>
        <div className="card">
          <h2>Combustible</h2>
          <p>{formatoCLP(stats.totalCombustible)}</p>
        </div>
        <div className="card">
          <h2>Peajes</h2>
          <p>{formatoCLP(stats.totalPeajes)}</p>
        </div>
      </div>

      {/* Tabla últimos viajes */}
      <h2 className="dashboard-subtitle">Últimas rendiciones del mes</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Salida</th>
              <th>Llegada</th>
              <th>Conductor</th>
              <th>Patente</th>
              <th>Destino</th>
              <th>Costo Total</th>
            </tr>
          </thead>
          <tbody>
            {ultimosViajes.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty">
                  No hay rendiciones registradas este mes
                </td>
              </tr>
            ) : (
              ultimosViajes.map((v, index) => (
                <tr
                  key={v.id}
                  onClick={() => abrirDetalle(v, index)}
                  className="clickable-row"
                >
                  <td>{formatoFechaHora(v.salidaAt)}</td>
                  <td>{formatoFechaHora(v.llegadaAt)}</td>
                  <td>{v.conductor || "-"}</td>
                  <td>{v.patenteTracto || "-"}</td>
                  <td>{v.destino.toUpperCase() || "-"}</td>
                  <td>{formatoCLP(v.costoTotal)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --------------------------- */}
      {/* Modal de Detalle de Rendición */}
      {/* --------------------------- */}
      {mostrarDetalle && rendicionSeleccionada && (
        <div className="modal-overlay" onClick={cerrarDetalle}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-nav">
              <button
                onClick={irAnterior}
                disabled={indiceRendicion === 0}
                className="nav-btn"
                aria-label="Rendición anterior"
              >
                <ChevronLeft size={20} />
              </button>

              <span className="nav-indicator">
                {indiceRendicion + 1} / {ultimosViajes.length}
              </span>

              <button
                onClick={irSiguiente}
                disabled={indiceRendicion === ultimosViajes.length - 1}
                className="nav-btn"
                aria-label="Rendición siguiente"
              >
                <ChevronRight size={20} />
              </button>
            </div>

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
                <p>
                  <strong>Conductor:</strong>
                  <span
                    style={{ color: "var(--primary)", cursor: "pointer", marginLeft: "4px" }}
                    onClick={() => abrirModalConductor(rendicionSeleccionada.conductorId)}
                  >
                    {rendicionSeleccionada.conductor}
                  </span>
                </p>

                <p><strong>Tracto:</strong> {rendicionSeleccionada.patenteTracto}</p>
                <p><strong>Rampla:</strong> {rendicionSeleccionada.patenteRampla}</p>
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

            <button className="close-btn" onClick={cerrarDetalle}>Cerrar</button>
          </div>
        </div>
      )}

      {/* --------------------------- */}
      {/* Modal del Conductor */}
      {/* --------------------------- */}
      {modalConductor && infoConductor && (
        <div className="modal-overlay" onClick={() => setModalConductor(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{infoConductor.nombre}</h2>

            <div className="modal-section">
              <p><strong>RUT:</strong> {infoConductor.rut}</p>
              <p><strong>Teléfono:</strong> {infoConductor.telefono || "—"}</p>
              <p><strong>Estado:</strong> {infoConductor.activo ? "Activo" : "Inactivo"}</p>
            </div>

            <h3 style={{ marginTop: "20px" }}>Viajes Realizados</h3>

            {viajesConductor.length === 0 ? (
              <p>No tiene rendiciones registradas.</p>
            ) : (
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Destino</th>
                    <th>Tracto</th>
                    <th>Gastos (S/ Comb.)</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viajesConductor.map((v) => (
                    <tr key={v.id}>
                      <td>{formatoFechaHora(v.salidaAt)}</td>
                      <td>{v.destino.toUpperCase()}</td>
                      <td>{v.patenteTracto}</td>
                      <td>{formatoCLP(v.gastos)}</td>
                      <td>{formatoCLP(v.costoTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button className="close-btn" onClick={() => setModalConductor(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
