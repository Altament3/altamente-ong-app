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