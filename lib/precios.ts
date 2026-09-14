import { PrecioCantidad } from "@/types/catalogo";

/**
 * Calcula el precio unitario correspondiente según la cantidad pedida
 * y los escalones definidos para el producto. Si no hay escalones
 * o ninguno aplica, devuelve el precio base.
 *
 * Ej: tiers = [{cantidad_minima: 5, precio_unitario: 900}, {cantidad_minima: 10, precio_unitario: 800}]
 *     cantidad = 7  -> devuelve 900
 *     cantidad = 12 -> devuelve 800
 *     cantidad = 2  -> devuelve precioBase
 */
export function calcularPrecioUnitario(
  precioBase: number,
  cantidad: number,
  tiers: PrecioCantidad[] = []
): number {
  if (!tiers || tiers.length === 0) return precioBase;

  const aplicable = [...tiers]
    .sort((a, b) => b.cantidad_minima - a.cantidad_minima)
    .find((t) => cantidad >= t.cantidad_minima);

  return aplicable ? Number(aplicable.precio_unitario) : precioBase;
}
