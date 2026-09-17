import { createSupabaseServerClient } from "@/lib/supabase-server";
import { calcularTopClientes, PedidoParaCliente } from "@/lib/estadisticas";

export default async function ClientesPage() {
  const supabase = await createSupabaseServerClient();

  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("nombre_cliente, telefono, total, created_at, estado")
    .neq("estado", "cancelado")
    .order("created_at", { ascending: true });

  const pedidosData = (pedidos ?? []) as unknown as PedidoParaCliente[];
  const topClientes = calcularTopClientes(pedidosData, 30);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">
        Top 30 clientes
      </h1>
      <p className="text-sm text-neutral-400 mb-6">
        Histórico completo (todos los pedidos, sin contar cancelados) ·
        agrupado por teléfono
      </p>

      {topClientes.length === 0 ? (
        <p className="text-neutral-500">Todavía no hay pedidos suficientes.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-400 border-b border-neutral-200">
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Cliente</th>
                <th className="py-2 pr-4">Teléfono</th>
                <th className="py-2 pr-4">Pedidos</th>
                <th className="py-2 pr-4">Total gastado</th>
                <th className="py-2 pr-4">Ticket promedio</th>
                <th className="py-2 pr-4">Última compra</th>
              </tr>
            </thead>
            <tbody>
              {topClientes.map((c, i) => (
                <tr key={c.telefono} className="border-b border-neutral-100">
                  <td className="py-2 pr-4 text-neutral-400">{i + 1}</td>
                  <td className="py-2 pr-4 font-medium text-neutral-900">
                    {c.nombre}
                  </td>
                  <td className="py-2 pr-4 text-neutral-500">{c.telefono}</td>
                  <td className="py-2 pr-4">{c.cantidadPedidos}</td>
                  <td className="py-2 pr-4 font-medium">
                    ${c.totalGastado.toLocaleString("es-AR")}
                  </td>
                  <td className="py-2 pr-4 text-neutral-500">
                    ${Math.round(c.ticketPromedio).toLocaleString("es-AR")}
                  </td>
                  <td className="py-2 pr-4 text-neutral-500">
                    {new Date(c.ultimaCompra).toLocaleDateString("es-AR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}