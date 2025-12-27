import { demoTrips } from "./trips";

export const demoReports = {
  totalViajes: demoTrips.length,

  totalCombustible: demoTrips.reduce(
    (s, v) => s + v.gastoCombustible,
    0
  ),

  totalPeajes: demoTrips.reduce(
    (s, v) => s + v.totalPeajes,
    0
  ),

  costoTotal: demoTrips.reduce(
    (s, v) => s + v.costoTotal,
    0
  ),

  viajeMasCaro: demoTrips.reduce((max, v) =>
    v.costoTotal > max.costoTotal ? v : max
  )
};
