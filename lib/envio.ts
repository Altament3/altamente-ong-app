export type ZonaEnvio = "CABA" | "GBA" | "retiro_en_persona";

export interface ItemParaEnvio {
  /** Gramos totales de este ítem (cantidad × gramos por unidad) */
  gramos: number;
  /** slug de la categoría del producto (ej: 'premium', 'premium-vip', 'semipremium', 'low-cost') */
  categoriaSlug?: string | null;
  /** false para todo lo que no sea flor promocionable (ej: hongos adaptógenos) */
  cuenta_para_envio_flores: boolean;
}

const PRECIO_BASE: Record<ZonaEnvio, number> = {
  CABA: 8000,
  GBA: 13000,
  retiro_en_persona: 0,
};

// Umbral de gramos por categoría de flor para acceder al envío gratis / máximo descuento
const UMBRAL_TIER_2: Record<string, number> = {
  premium: 10,
  "premium-vip": 10,
  semipremium: 15,
  "low-cost": 20,
};

const UMBRAL_TIER_1_GRAMOS = 5;
const DESCUENTO_TIER_1_GBA = 2000;
const DESCUENTO_TIER_2_GBA = 8000;

/**
 * Calcula el costo de envío según la zona y la cantidad/calidad de flor
 * en el pedido. Reglas (ver conversación con Nachi):
 *
 * - Base: $8.000 CABA / $13.000 GBA / $0 retiro en persona
 * - 5g+ de flor (cualquier categoría, sumado) -> CABA $6.000 / GBA -$2.000
 * - Umbral por categoría (10g premium/premium-vip, 15g semipremium, 20g low-cost)
 *   alcanzado en una sola categoría -> CABA gratis / GBA -$8.000
 * - Solo cuentan los ítems marcados con cuenta_para_envio_flores = true
 *   (excluye hongos adaptógenos, extractos, cremas, comestibles, etc.)
 */
export function calcularCostoEnvio(
  items: ItemParaEnvio[],
  zona: ZonaEnvio
): number {
  const base = PRECIO_BASE[zona];

  if (zona === "retiro_en_persona") return 0;

  const flores = items.filter((i) => i.cuenta_para_envio_flores && i.gramos > 0);
  if (flores.length === 0) return base;

  // Gramos totales, sin importar categoría (para el umbral de tier 1)
  const totalGramos = flores.reduce((acc, f) => acc + f.gramos, 0);

  // Gramos agrupados por categoría (para el umbral de tier 2, que es por grupo)
  const gramosPorCategoria: Record<string, number> = {};
  for (const f of flores) {
    const key = f.categoriaSlug ?? "sin_categoria";
    gramosPorCategoria[key] = (gramosPorCategoria[key] ?? 0) + f.gramos;
  }

  const alcanzaTier2 = Object.entries(gramosPorCategoria).some(
    ([categoria, gramos]) =>
      UMBRAL_TIER_2[categoria] !== undefined && gramos >= UMBRAL_TIER_2[categoria]
  );

  if (alcanzaTier2) {
    return zona === "CABA" ? 0 : base - DESCUENTO_TIER_2_GBA;
  }

  if (totalGramos >= UMBRAL_TIER_1_GRAMOS) {
    return zona === "CABA" ? 6000 : base - DESCUENTO_TIER_1_GBA;
  }

  return base;
}
