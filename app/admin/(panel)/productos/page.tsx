import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import EliminarProductoButton from "./EliminarProductoButton";

export default async function AdminProductosPage() {
  const supabase = await createSupabaseServerClient();
  const { data: productos } = await supabase
    .from("productos")
    .select(
      "id, nombre, precio, stock, disponible, tipo_producto, categorias ( nombre )"
    )
    .order("nombre");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-400 border-b border-neutral-200">
              <th className="py-2 pr-4">Nombre</th>
              <th className="py-2 pr-4">Categoría</th>
              <th className="py-2 pr-4">Tipo</th>
              <th className="py-2 pr-4">Precio</th>
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 pr-4">Disponible</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {productos?.map((p: any) => (
              <tr key={p.id} className="border-b border-neutral-100">
                <td className="py-2 pr-4 font-medium text-neutral-900">
                  {p.nombre}
                </td>
                <td className="py-2 pr-4 text-neutral-500">
                  {p.categorias?.nombre ?? "-"}
                </td>
                <td className="py-2 pr-4 text-neutral-500">{p.tipo_producto}</td>
                <td className="py-2 pr-4">
                  ${Number(p.precio ?? 0).toLocaleString("es-AR")}
                </td>
                <td className="py-2 pr-4">{p.stock}</td>
                <td className="py-2 pr-4">
                  {p.disponible ? (
                    <span className="text-emerald-600">Sí</span>
                  ) : (
                    <span className="text-neutral-400">No</span>
                  )}
                </td>
                <td className="py-2 pr-4 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/productos/${p.id}`}
                    className="text-emerald-600 hover:underline mr-3"
                  >
                    Editar
                  </Link>
                  <EliminarProductoButton id={p.id} nombre={p.nombre} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!productos || productos.length === 0) && (
          <p className="text-neutral-500 mt-4">Todavía no cargaste productos.</p>
        )}
      </div>
    </div>
  );
}
