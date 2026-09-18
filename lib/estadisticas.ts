export interface PedidoConItems {
  id: string;
  created_at: string;
  total: number;
  estado: string;
  pedido_items: {
    nombre_producto: string;
    cantidad: number;
    subtotal: number;
  }[];
}

// =========================================================
// Ventas por día (para el gráfico de línea)
// =========================================================
export interface PuntoVentasPorDia {
  fecha: string; // YYYY-MM-DD
  total: number;
}

export function calcularVentasPorDia(
  pedidos: PedidoConItems[]
): PuntoVentasPorDia[] {
  const mapa = new Map<string, number>();

  for (const p of pedidos) {
    const fecha = p.created_at.slice(0, 10);
    mapa.set(fecha, (mapa.get(fecha) ?? 0) + Number(p.total));
  }

  return Array.from(mapa.entries())
    .map(([fecha, total]) => ({ fecha, total }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

// =========================================================
// Productos más vendidos (por cantidad, sumando todos los pedidos)
// =========================================================
export interface ProductoVendido {
  nombre: string;
  cantidad: number;
  ingresos: number;
}

export function calcularProductosMasVendidos(
  pedidos: PedidoConItems[],
  top: number = 5
): ProductoVendido[] {
  const mapa = new Map<string, { cantidad: number; ingresos: number }>();

  for (const p of pedidos) {
    for (const item of p.pedido_items) {
      const actual = mapa.get(item.nombre_producto) ?? {
        cantidad: 0,
        ingresos: 0,
      };
      actual.cantidad += item.cantidad;
      actual.ingresos += Number(item.subtotal);
      mapa.set(item.nombre_producto, actual);
    }
  }

  return Array.from(mapa.entries())
    .map(([nombre, datos]) => ({ nombre, ...datos }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, top);
}

// =========================================================
// Ventas por día de la semana (para encontrar el día más fuerte)
// =========================================================
const DIAS_SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export interface VentaPorDiaSemana {
  dia: string;
  total: number;
  cantidadPedidos: number;
}

export function calcularVentasPorDiaSemana(
  pedidos: PedidoConItems[]
): VentaPorDiaSemana[] {
  const acumulado = DIAS_SEMANA.map((dia) => ({
    dia,
    total: 0,
    cantidadPedidos: 0,
  }));

  for (const p of pedidos) {
    const diaIndex = new Date(p.created_at).getDay(); // 0 = domingo
    acumulado[diaIndex].total += Number(p.total);
    acumulado[diaIndex].cantidadPedidos += 1;
  }

  return [...acumulado.slice(1), acumulado[0]];
}

// =========================================================
// Top clientes (agrupando por teléfono)
// =========================================================
export interface PedidoParaCliente {
  nombre_cliente: string;
  telefono: string;
  total: number;
  created_at: string;
}

export interface ClienteTop {
  nombre: string;
  telefono: string;
  totalGastado: number;
  cantidadPedidos: number;
  ticketPromedio: number;
  ultimaCompra: string;
}

export function calcularTopClientes(
  pedidos: PedidoParaCliente[],
  top: number = 30
): ClienteTop[] {
 const mapa = new Map<string, { nombre: string; totalGastado: number; cantidadPedidos: number; ultimaCompra: string }>();

  for (const p of pedidos) {
    const clave = p.telefono.trim();
    const actual = mapa.get(clave) ?? {
      nombre: p.nombre_cliente,
      totalGastado: 0,
      cantidadPedidos: 0,
      ultimaCompra: p.created_at,
    };

    actual.totalGastado += Number(p.total);
    actual.cantidadPedidos += 1;
    if (p.created_at > actual.ultimaCompra) {
      actual.ultimaCompra = p.created_at;
      actual.nombre = p.nombre_cliente;
    }

    mapa.set(clave, actual);
  }

  return Array.from(mapa.entries())
    .map(([telefono, datos]) => ({
      telefono,
      nombre: datos.nombre,
      totalGastado: datos.totalGastado,
      cantidadPedidos: datos.cantidadPedidos,
      ticketPromedio: datos.totalGastado / datos.cantidadPedidos,
      ultimaCompra: datos.ultimaCompra,
    }))
    .sort((a, b) => b.totalGastado - a.totalGastado)
    .slice(0, top);
}

// =========================================================
// Resumen general
// =========================================================
export function calcularResumen(pedidos: PedidoConItems[]) {
  const totalVentas = pedidos.reduce((acc, p) => acc + Number(p.total), 0);
  const cantidadPedidos = pedidos.length;
  const ticketPromedio = cantidadPedidos > 0 ? totalVentas / cantidadPedidos : 0;

  return { totalVentas, cantidadPedidos, ticketPromedio };
}
// =========================================================
// Comparación por mes y por trimestre
// =========================================================
export interface PedidoCompleto extends PedidoConItems {
  zona_envio: string;
}

const NOMBRES_MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export interface ResumenMes {
  mes: string;
  mesLabel: string;
  totalVentas: number;
  cantidadPedidos: number;
  ticketPromedio: number;
  productoMasVendido: string;
  zonaLider: string;
  diaMasFuerte: string;
}

export function calcularResumenMensual(pedidos: PedidoCompleto[]): ResumenMes[] {
  const porMes = new Map<string, PedidoCompleto[]>();

  for (const p of pedidos) {
    const clave = p.created_at.slice(0, 7);
    const arr = porMes.get(clave) ?? [];
    arr.push(p);
    porMes.set(clave, arr);
  }

  const resultado: ResumenMes[] = [];

  for (const [mes, pedidosDelMes] of porMes.entries()) {
    const [anio, mesNum] = mes.split("-");
    const mesLabel = `${NOMBRES_MESES[parseInt(mesNum, 10) - 1]} ${anio}`;

    const totalVentas = pedidosDelMes.reduce((acc, p) => acc + Number(p.total), 0);
    const cantidadPedidos = pedidosDelMes.length;
    const ticketPromedio = cantidadPedidos > 0 ? totalVentas / cantidadPedidos : 0;

    const productos = calcularProductosMasVendidos(pedidosDelMes, 1);
    const productoMasVendido = productos[0]?.nombre ?? "-";

    const zonaMap = new Map<string, number>();
    for (const p of pedidosDelMes) {
      zonaMap.set(p.zona_envio, (zonaMap.get(p.zona_envio) ?? 0) + Number(p.total));
    }
    const zonaLider =
      Array.from(zonaMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

    const diaMap = new Map<number, number>();
    for (const p of pedidosDelMes) {
      const dia = new Date(p.created_at).getDay();
      diaMap.set(dia, (diaMap.get(dia) ?? 0) + Number(p.total));
    }
    const diaIndex = Array.from(diaMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
    const diaMasFuerte = diaIndex !== undefined ? DIAS_SEMANA[diaIndex] : "-";

    resultado.push({
      mes,
      mesLabel,
      totalVentas,
      cantidadPedidos,
      ticketPromedio,
      productoMasVendido,
      zonaLider,
      diaMasFuerte,
    });
  }

  return resultado.sort((a, b) => a.mes.localeCompare(b.mes));
}

export interface ResumenTrimestre {
  trimestre: string;
  trimestreLabel: string;
  totalVentas: number;
  cantidadPedidos: number;
  ticketPromedio: number;
}

const RANGO_TRIMESTRES: Record<number, string> = {
  1: "Ene-Mar",
  2: "Abr-Jun",
  3: "Jul-Sep",
  4: "Oct-Dic",
};

export function calcularResumenTrimestral(
  resumenMensual: ResumenMes[]
): ResumenTrimestre[] {
  const porTrimestre = new Map<string, ResumenMes[]>();

  for (const r of resumenMensual) {
    const [anio, mesNum] = r.mes.split("-");
    const trimestreNum = Math.ceil(parseInt(mesNum, 10) / 3);
    const clave = `${anio}-Q${trimestreNum}`;
    const arr = porTrimestre.get(clave) ?? [];
    arr.push(r);
    porTrimestre.set(clave, arr);
  }

  const resultado: ResumenTrimestre[] = [];

  for (const [trimestre, meses] of porTrimestre.entries()) {
    const [anio, q] = trimestre.split("-Q");
    const totalVentas = meses.reduce((acc, m) => acc + m.totalVentas, 0);
    const cantidadPedidos = meses.reduce((acc, m) => acc + m.cantidadPedidos, 0);
    const ticketPromedio = cantidadPedidos > 0 ? totalVentas / cantidadPedidos : 0;

    resultado.push({
      trimestre,
      trimestreLabel: `Q${q} ${anio} (${RANGO_TRIMESTRES[parseInt(q, 10)]})`,
      totalVentas,
      cantidadPedidos,
      ticketPromedio,
    });
  }

  return resultado.sort((a, b) => a.trimestre.localeCompare(b.trimestre));
}