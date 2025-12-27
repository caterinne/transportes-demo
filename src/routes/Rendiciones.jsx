import { useState, useEffect } from "react";
import { formatoCLP, formatoNumero } from "../utils/formatos";
import {
  Truck, Fuel, Receipt, User, Calendar, BanknoteArrowDown
} from "lucide-react";
import {
  TextField,
  FormControl,
  Checkbox,
  FormControlLabel,
  Autocomplete
} from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

// 🔹 MOCKS
import { demoTrips } from "../demo/trips";
import { demoDrivers } from "../demo/drivers";
import { demoVehicles } from "../demo/vehicles";

export default function Rendiciones() {
  const [tractos, setTractos] = useState([]);
  const [ramplas, setRamplas] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [locations, setLocations] = useState([
    "SANTIAGO",
    "VALPARAÍSO",
    "RANCAGUA",
    "CONCEPCIÓN"
  ]);

  const [alerta, setAlerta] = useState({
    open: false,
    tipo: "info",
    mensaje: ""
  });

  const mostrarAlerta = (tipo, mensaje) => {
    setAlerta({ open: true, tipo, mensaje });
    setTimeout(() => setAlerta(a => ({ ...a, open: false })), 2500);
  };

  // 🔹 FORM
  const [form, setForm] = useState({
    conductor: "",
    patenteTracto: "",
    patenteRampla: "",
    origen: "",
    destino: "",
    salidaAt: "",
    llegadaAt: "",
    viaje: "",
    guiaHojaRuta: "",
    odometroInicial: "",
    odometroFinal: "",
    litrosPetroleo: "",
    precioLitro: "",
    gastoCombustible: "",
    gastos: "",
    numPeajes: "",
    totalPeajes: "",
    estaciona: false,
    viatico1: "",
    viatico2: "",
    viatico3: "",
    devolucion: "",
  });

  // 🔹 CARGA MOCK
  useEffect(() => {
    setConductores(Object.values(demoDrivers));

    setTractos(demoVehicles.tractos.map(t => t.patente));
    setRamplas(demoVehicles.ramplas.map(r => r.patente));
  }, []);

  // 🔹 HANDLE CHANGE (con cálculos)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => {
      const u = { ...prev };

      if (type === "checkbox") {
        u[name] = checked;
      } else {
        const numeric = [
          "odometroInicial","odometroFinal","litrosPetroleo","precioLitro",
          "gastoCombustible","numPeajes","totalPeajes",
          "viatico1","viatico2","viatico3","devolucion","viaje"
        ];
        u[name] = numeric.includes(name)
          ? value === "" ? "" : Number(value)
          : value;
      }

      const litros = Number(u.litrosPetroleo) || 0;
      const precio = Number(u.precioLitro) || 0;
      const gasto = Number(u.gastoCombustible) || 0;

      if (litros && precio) u.gastoCombustible = litros * precio;
      if (precio && gasto && !litros) u.litrosPetroleo = gasto / precio;

      const gastos =
        (Number(u.totalPeajes) || 0) +
        (Number(u.viatico1) || 0) +
        (Number(u.viatico2) || 0) +
        (Number(u.viatico3) || 0);

      u.gastos = gastos;

      const costoTotal = (Number(u.gastoCombustible) || 0) + gastos;
      u.devolucion = (Number(u.viaje) || 0) - costoTotal;

      return u;
    });
  };

  // 🚫 GUARDAR DESHABILITADO (DEMO)
  const handleSubmit = (e) => {
    e.preventDefault();
    mostrarAlerta("info", "Modo DEMO: no se guardan rendiciones");
  };

// ===============================
// HANDLERS Y HELPERS DEMO
// ===============================

// Evita submit con Enter accidental
const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
};

// Limpia texto y deja solo números
const limpiarNumero = (valor) => {
  if (!valor) return "";
  return valor.toString().replace(/\D/g, "");
};

// Guarda ubicación solo en memoria (DEMO)
const guardarLocationSiNoExiste = (valor) => {
  if (!valor) return;

  setLocations((prev) => {
    if (prev.includes(valor.toUpperCase())) return prev;
    return [...prev, valor.toUpperCase()];
  });
};

  // 🔹 Render
  return (
    <div className="rendiciones-container">
      <form className="rendicion-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        {/* 🧍 Datos del Viaje */}
        <div className="form-section">
          <h3><User size={18}/> Datos del Viaje</h3>
          <div className="viaje-grid">
            <FormControl size="small" fullWidth>
              <Autocomplete
                options={conductores}
                getOptionLabel={(c) => `${c.nombre} — ${c.rut}`}
                value={conductores.find(c => c.id === form.conductor) || null}
                onChange={(_, newValue) =>
                  handleChange({ target: { name: "conductor", value: newValue?.id || "" } })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Conductor" size="small" />
                )}
                fullWidth
              />
            </FormControl>
            {/* PATENTE TRACTO */}
            <FormControl size="small" fullWidth>
            <Autocomplete
              options={tractos}
              value={form.patenteTracto}
              onChange={(_, newValue) =>
                handleChange({ target: { name: "patenteTracto", value: newValue || "" } })
              }
              renderInput={(params) => (
                <TextField {...params} label="Patente Tracto" size="small" />
              )}
              fullWidth
            />
            </FormControl>
            {/* PATENTE RAMPLA */}
            <FormControl size="small" fullWidth>
            <Autocomplete
              options={ramplas}
              value={form.patenteRampla}
              onChange={(_, newValue) =>
                handleChange({ target: { name: "patenteRampla", value: newValue || "" } })
              }
              renderInput={(params) => (
                <TextField {...params} label="Patente Rampla" size="small" />
              )}
              fullWidth
            />
            </FormControl>

            <Autocomplete
              freeSolo
              options={locations}
              inputValue={form.origen}
              onInputChange={(_, newValue) =>
                handleChange({ target: { name: "origen", value: newValue } })
              }
              onBlur={() => guardarLocationSiNoExiste(form.origen)}
              renderInput={(params) => (
                <TextField {...params} label="Origen" size="small" />
              )}
              fullWidth
            />

            <Autocomplete
              freeSolo
              options={locations}
              inputValue={form.destino}
              onInputChange={(_, newValue) =>
                handleChange({ target: { name: "destino", value: newValue } })
              }
              onBlur={() => guardarLocationSiNoExiste(form.destino)}
              renderInput={(params) => (
                <TextField {...params} label="Destino" size="small" />
              )}
              fullWidth
            />

            <TextField
              name="guiaHojaRuta"
              label="Guía / Hoja Ruta"
              value={form.guiaHojaRuta}
              onChange={handleChange}
              size="small"
              fullWidth
            />

            <TextField
              type="datetime-local"
              name="salidaAt"
              label="Salida"
              InputLabelProps={{ shrink: true }}
              value={form.salidaAt}
              onChange={handleChange}
              size="small"
              fullWidth
            />

            <TextField
              type="datetime-local"
              name="llegadaAt"
              label="Llegada"
              InputLabelProps={{ shrink: true }}
              value={form.llegadaAt}
              onChange={handleChange}
              size="small"
              fullWidth
            />

          </div>
        </div>

        {/* 🚛 Datos del Vehículo */}
        <div className="form-section">
          <h3><Truck size={18}/> Datos del Vehículo</h3>

          <div className="viaje-grid">
            <TextField
              type="text"
              name="odometroInicial"
              label="Odómetro Inicial"
              value={form.odometroInicial === "" ? "" : formatoNumero(form.odometroInicial)}
              onChange={(e) => {
                const limpio = limpiarNumero(e.target.value);
                handleChange({ target: { name: "odometroInicial", value: limpio } });
              }}
              size="small"
              fullWidth
            />
            <TextField
              type="text"
              name="odometroFinal"
              label="Odómetro Final"
              value={form.odometroFinal === "" ? "" : formatoNumero(form.odometroFinal)}
              onChange={(e) => {
                const limpio = limpiarNumero(e.target.value);
                handleChange({ target: { name: "odometroFinal", value: limpio } });
              }}
              size="small"
              fullWidth
            />
          </div>
        </div>

        {/* ⛽ Combustible */}
        <div className="form-section">
          <h3><Fuel size={18}/> Combustible</h3>

          <div className="viaje-grid">
            <TextField
              type="number"
              name="litrosPetroleo"
              label="Litros"
              value={form.litrosPetroleo}
              onChange={handleChange}
              size="small"
              fullWidth
            />
            <TextField
              type="text"
              name="precioLitro"
              label="Precio por litro (CLP)"
              value={form.precioLitro === "" ? "" : formatoCLP(form.precioLitro)}
              onChange={(e) => {
                const limpio = limpiarNumero(e.target.value);
                handleChange({ target: { name: "precioLitro", value: limpio } });
              }}
              size="small"
              fullWidth
            />
            <TextField
              type="text"
              name="gastoCombustible"
              label="Gasto Combustible"
              value={form.gastoCombustible === "" ? "" : formatoCLP(form.gastoCombustible)}
              onChange={(e) => {
                const limpio = limpiarNumero(e.target.value);
                handleChange({ target: { name: "gastoCombustible", value: limpio } });
              }}
              size="small"
              fullWidth
            />

          </div>
        </div>

        {/* 🧾 Gastos */}
        <div className="form-section">
          <h3><Receipt size={18}/> Gastos</h3>

          <div className="viaje-grid">

            <TextField
              type="number"
              name="numPeajes"
              label="N° Peajes"
              value={form.numPeajes}
              onChange={handleChange}
              size="small"
              fullWidth
            />
            <TextField
              name="totalPeajes"
              label="$ Peajes"
              value={form.totalPeajes === "" ? "" : formatoCLP(form.totalPeajes)}
              onChange={(e) => {
                const limpio = limpiarNumero(e.target.value);
                handleChange({
                  target: { name: "totalPeajes", value: limpio }
                });
              }}
              size="small"
              fullWidth
            />
            <TextField
              type="text"
              name="viatico1"
              label="Viático 1"
              value={form.viatico1 === "" ? "" : formatoCLP(form.viatico1)}
              onChange={(e) => {
                const limpio = limpiarNumero(e.target.value);
                handleChange({ target: { name: "viatico1", value: limpio } });
              }}
              size="small"
              fullWidth
            />

            <TextField
              type="text"
              name="viatico2"
              label="Viático 2"
              value={form.viatico2 === "" ? "" : formatoCLP(form.viatico2)}
              onChange={(e) => {
                const limpio = limpiarNumero(e.target.value);
                handleChange({ target: { name: "viatico2", value: limpio } });
              }}
              size="small"
              fullWidth
            />

            <TextField
              type="text"
              name="viatico3"
              label="Viático 3"
              value={form.viatico3 === "" ? "" : formatoCLP(form.viatico3)}
              onChange={(e) => {
                const limpio = limpiarNumero(e.target.value);
                handleChange({ target: { name: "viatico3", value: limpio } });
              }}
              size="small"
              fullWidth
            />
          </div>
          <div className="resumen-gastos">
            <p><BanknoteArrowDown size={18}/> <strong>Gastos Totales:</strong> {formatoCLP(form.gastos)}</p>
          </div>
        </div>

        {/* 🔙 Devolución */}
        <div className="form-section">
          <h3><Calendar size={18}/> Cierre</h3>

          <div className="viaje-grid">
            <TextField
              type="text"
              name="viaje"
              label="Viaje $"
              value={form.viaje === "" ? "" : formatoCLP(form.viaje)}
              onChange={(e) => {
                const limpio = limpiarNumero(e.target.value);
                handleChange({ target: { name: "viaje", value: limpio } });
              }}
              size="small"
              fullWidth
            />

            <TextField
              type="text"
              name="devolucion"
              label="Devolución $"
              value={form.devolucion === "" ? "" : formatoCLP(form.devolucion)}
              InputProps={{ readOnly: true }}
              size="small"
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="estaciona"
                  checked={form.estaciona}
                  onChange={handleChange}
                />
              }
              label="Estaciona"
            />

          </div>
        </div>
        {alerta.open && (
          <Alert severity={alerta.tipo} sx={{ mb: 2 }}>
            <AlertTitle>
              {alerta.tipo === "success" && "Éxito"}
              {alerta.tipo === "error" && "Error"}
              {alerta.tipo === "warning" && "Advertencia"}
              {alerta.tipo === "info" && "Información"}
            </AlertTitle>
            {alerta.mensaje}
          </Alert>
        )}

        <button className="guardar-btn" type="submit">
          Guardar Rendición
        </button>
      </form>
    </div>
  );
}
