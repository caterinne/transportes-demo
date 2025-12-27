// Formato en pesos chilenos ($##.###)
export const formatoCLP = (valor) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(valor || 0);

// Formato de número simple (sin símbolo $)
export const formatoNumero = (valor) =>
  new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 0,
  }).format(valor || 0);