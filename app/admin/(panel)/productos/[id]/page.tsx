import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { actualizarProducto } from "../actions";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: producto } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (!producto) {
    notFound();
  }

  const actualizarConId = actualizarProducto.bind(null, id);

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">
        Editar producto
      </h1>
      <form action={actualizarConId} className="space-y-4">
        <div>
          <label className="text-sm text-neutral-600">Nombre *</label>
          <input
            name="nombre"
            defaultValue={producto.nombre}
            required
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-600">Descripción corta</label>
          <input
            name="descripcion_corta"
            defaultValue={producto.descripcion_corta ?? ""}
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-neutral-600">Precio *</label>
            <input
              name="precio"
              type="number"
              step="0.01"
              defaultValue={producto.precio ?? 0}
              required
              className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-neutral-600">Stock *</label>
            <input
              name="stock"
              type="number"
              defaultValue={producto.stock}
              required
              className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            name="disponible"
            defaultChecked={producto.disponible}
          />
          Disponible en el catálogo
        </label>
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
