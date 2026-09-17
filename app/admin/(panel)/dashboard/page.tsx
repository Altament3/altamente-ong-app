import { createSupabaseServerClient } from "@/lib/supabase-server";
import {
  calcularVentasPorDia,
  calcularProductosMasVendidos,
  calcularVentasPorDiaSemana,
  calcularResumen,
  PedidoConItems,
} from "@/lib/estadisticas";
import DashboardCharts from "@/components/admin/DashboardCharts";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const treintaDiasAtras = new Date();
  treintaDiasAtras.setDate(treintaDiasAtras.getDate() - 30);

  const { data: pedidos } = await supabase
    .from("pedidos")
    .select(
      "id, created_at, total, estado, pedido_items ( nombre_producto, cantidad, subtotal )"
    )
    .neq("estado", "cancelado")
    .gte("created_at", treintaDiasAtras.toISOString())
    .order("created_at", { ascending: true });

  const pedidosData = (pedidos ?? []) as unknown as PedidoConItems[];

  const resumen = calcularResumen(pedidosData);
  const ventasPorDia = calcularVentasPorDia(pedidosData);
  const productosMasVendidos = calcularProductosMasVendidos(pedidosData);
  const ventasPorDiaSemana = calcularVentasPorDiaSemana(pedidosData);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Dashboard</h1>
      <p className="text-sm text-neutral-400 mb-6">
        Últimos 30 días · no incluye pedidos cancelados
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="border border-neutral-200 rounded-xl p-4">
          <p className="text-sm text-neutral-500">Ventas totales</p>
          <p className="text-2xl font-bold text-neutral-900">
            ${resumen.totalVentas.toLocaleString("es-AR")}
          </p>
        </div>
        <div className="border border-neutral-200 rounded-xl p-4">
          <p className="text-sm text-neutral-500">Pedidos</p>
          <p className="text-2xl font-bold text-neutral-900">
            {resumen.cantidadPedidos}
          </p>
        </div>
        <div className="border border-neutral-200 rounded-xl p-4">
          <p className="text-sm text-neutral-500">Ticket promedio</p>
          <p className="text-2xl font-bold text-neutral-900">
            ${Math.round(resumen.ticketPromedio).toLocaleString("es-AR")}
          </p>
        </div>
      </div>

      {pedidosData.length === 0 ? (
        <p className="text-neutral-500">
          Todavía no hay suficientes pedidos en los últimos 30 días para
          mostrar gráficos.
        </p>
      ) : (
        <DashboardCharts
          ventasPorDia={ventasPorDia}
          productosMasVendidos={productosMasVendidos}
          ventasPorDiaSemana={ventasPorDiaSemana}
        />
      )}
    </div>
  );
}