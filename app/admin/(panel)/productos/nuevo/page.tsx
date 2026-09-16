import { createSupabaseServerClient } from "@/lib/supabase-server";
import { crearProducto } from "../actions";

export default async function NuevoProductoPage() {
  const supabase = await createSupabaseServerClient();
  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nombre")
    .order("nombre");

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">
        Nuevo producto
      </h1>
      <form action={crearProducto} className="space-y-4">
        <div>
          <label className="text-sm text-neutral-600">Nombre *</label>
          <input
            name="nombre"
            required
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-600">Slug (URL) *</label>
          <input
            name="slug"
            required
            placeholder="ej: aceite-cbd-10"
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          />
          <p className="text-xs text-neutral-400 mt-1">
            Sin espacios ni mayúsculas, separado por guiones.
          </p>
        </div>
        <div>
          <label className="text-sm text-neutral-600">Categoría</label>
          <select
            name="categoria_id"
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          >
            <option value="">Sin categoría</option>
            {categorias?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-neutral-600">Tipo de producto *</label>
          <select
            name="tipo_producto"
            required
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          >
            <option value="extracto_aceite">Extracto / Aceite</option>
            <option value="materia_vegetal">Materia vegetal</option>
            <option value="crema_topico">Crema / Tópico</option>
            <option value="comestible">Comestible</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-neutral-600">Descripción corta</label>
          <input
            name="descripcion_corta"
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
              required
              className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-neutral-600">Stock *</label>
            <input
              name="stock"
              type="number"
              required
              className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700"
        >
          Crear producto
        </button>
      </form>

      <p className="text-xs text-neutral-400 mt-4">
        Nota: atributos técnicos específicos (concentración, THC/CBD,
        gramaje, etc.) por ahora se cargan directo en Supabase → tabla
        productos → columna "atributos". Se puede sumar acá en una vuelta
        futura si hace falta.
      </p>
    </div>
  );
}
