export function kelvitToCelsius(tempKelvin: number): number {
  const tempCelsius = tempKelvin - 273.15
  return Math.floor(tempCelsius)
}
