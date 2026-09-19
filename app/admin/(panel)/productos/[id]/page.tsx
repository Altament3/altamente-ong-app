import { notFound } from "next/navigation";
import Image from "next/image";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { actualizarProducto, subirImagenProducto } from "../actions";

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
  const subirImagenConId = subirImagenProducto.bind(null, id);

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">
        Editar producto
      </h1>

      <div className="mb-8 border border-neutral-200 rounded-xl p-4">
        <p className="text-sm text-neutral-600 mb-3">Foto del producto</p>

        {producto.imagen_url ? (
          <div className="relative w-40 h-40 rounded-lg overflow-hidden bg-neutral-100 mb-4">
            <Image
              src={producto.imagen_url}
              alt={producto.nombre}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-40 h-40 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm mb-4">
            Sin foto
          </div>
        )}

        <form action={subirImagenConId} className="space-y-3">
          <input
            type="file"
            name="imagen"
            accept="image/*"
            required
            className="w-full text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-neutral-800 text-white text-sm font-medium hover:bg-neutral-900"
          >
            Subir foto
          </button>
        </form>
      </div>

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