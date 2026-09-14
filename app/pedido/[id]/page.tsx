import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function ConfirmacionPedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: pedido } = await supabaseAdmin
    .from("pedidos")
    .select("*, pedido_items(*)")
    .eq("id", id)
    .single();

  if (!pedido) {
    notFound();
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-emerald-600 text-4xl mb-4">✓</div>
      <h1 className="text-2xl font-bold text-neutral-900">
        ¡Pedido confirmado!
      </h1>
      <p className="text-neutral-500 mt-1">
        Gracias {pedido.nombre_cliente.split(" ")[0]}, en breve nos
        contactamos para coordinar la entrega.
      </p>

      <div className="mt-8 text-left border border-neutral-200 rounded-2xl p-5 space-y-3">
        <p className="text-sm text-neutral-400">
          Pedido #{pedido.id.slice(0, 8)}
        </p>

        <div className="divide-y divide-neutral-100">
          {pedido.pedido_items.map((item: any) => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span>
                {item.nombre_producto} × {item.cantidad}
              </span>
              <span className="font-medium">
                ${Number(item.subtotal).toLocaleString("es-AR")}
              </span>
            </div>
          ))}
          <div className="flex justify-between py-2 text-sm text-neutral-500">
            <span>
              Envío (
              {pedido.zona_envio === "retiro_en_persona"
                ? "Retiro en persona"
                : pedido.zona_envio}
              )
            </span>
            <span>
              {Number(pedido.envio_costo) === 0
                ? "Gratis 🎊"
                : `$${Number(pedido.envio_costo).toLocaleString("es-AR")}`}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
          <span className="font-semibold text-neutral-900">Total</span>
          <span className="text-xl font-bold text-neutral-900">
            ${Number(pedido.total).toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      <div className="mt-6 text-left text-sm text-neutral-500 space-y-1">
        <p>
          <strong>Nombre:</strong> {pedido.nombre_cliente}
        </p>
        <p>
          <strong>Teléfono:</strong> {pedido.telefono}
        </p>
        {pedido.email && (
          <p>
            <strong>Email:</strong> {pedido.email}
          </p>
        )}
        {pedido.direccion && (
          <p>
            <strong>Dirección:</strong> {pedido.direccion}
          </p>
        )}
      </div>
    </main>
  );
}
