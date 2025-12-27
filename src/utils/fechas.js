const ISO_MIN = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes())
    .toISOString()
    .slice(0, 16);

export function obtenerRangoMes(fecha = new Date()) {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1, 0, 0);
    const proximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1, 0, 0);
    return {
        inicio: ISO_MIN(inicioMes),
        fin: ISO_MIN(proximoMes),
    };
}


export function obtenerRangoMesActual() {
    return obtenerRangoMes(new Date());
}

export function etiquetaMes(fecha = new Date(), locale = "es-CL") {
    return new Date(fecha).toLocaleString(locale, { month: "long", year: "numeric" });
}

export const formatoFecha = (fecha) => {
    if (!fecha) return "";
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const anio = d.getFullYear();
    return `${dia}/${mes}/${anio}`;
};

export const formatoFechaHora = (fecha) => {
    if (!fecha) return "";
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const anio = d.getFullYear();

    let horas = d.getHours();
    const minutos = String(d.getMinutes()).padStart(2, "0");
    const ampm = horas >= 12 ? "PM" : "AM";
    horas = horas % 12 || 12;

    return `${dia}/${mes}/${anio} ${horas}:${minutos} ${ampm}`;
};