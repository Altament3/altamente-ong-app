import { createSupabaseServerClient } from "@/lib/supabase-server";
import CambiarEstadoSelect from "./CambiarEstadoSelect";

export default async function AdminPedidosPage() {
  const supabase = await createSupabaseServerClient();
  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("*, pedido_items ( * )")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Pedidos</h1>

      <div className="space-y-4">
        {pedidos?.map((p: any) => (
          <div
            key={p.id}
            className="border border-neutral-200 rounded-xl p-4"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="font-medium text-neutral-900">
                  {p.nombre_cliente} · {p.telefono}
                </p>
                {p.email && (
                  <p className="text-sm text-neutral-500">{p.email}</p>
                )}
                <p className="text-sm text-neutral-500">
                  {new Date(p.created_at).toLocaleString("es-AR")}
                </p>
                {p.direccion && (
                  <p className="text-sm text-neutral-500">
                    {p.direccion} (
                    {p.zona_envio === "retiro_en_persona"
                      ? "Retiro en persona"
                      : p.zona_envio}
                    )
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-neutral-900">
                  ${Number(p.total).toLocaleString("es-AR")}
                </p>
                <div className="mt-1">
                  <CambiarEstadoSelect pedidoId={p.id} estadoActual={p.estado} />
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-neutral-600 divide-y divide-neutral-100 border-t border-neutral-100 pt-2">
              {p.pedido_items.map((item: any) => (
                <div key={item.id} className="flex justify-between py-1">
                  <span>
                    {item.nombre_producto} × {item.cantidad}
                  </span>
                  <span>${Number(item.subtotal).toLocaleString("es-AR")}</span>
                </div>
              ))}
            </div>

            {p.notas && (
              <p className="text-sm text-neutral-500 mt-2 italic">
                Notas: {p.notas}
              </p>
            )}
          </div>
        ))}

        {(!pedidos || pedidos.length === 0) && (
          <p className="text-neutral-500">Todavía no hay pedidos.</p>
        )}
      </div>
    </div>
  );
}