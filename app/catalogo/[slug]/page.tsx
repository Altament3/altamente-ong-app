import { notFound } from "next/navigation";
import Image from "next/image";
import { obtenerProductoPorSlug } from "@/lib/productos";
import { obtenerAtributosDisplay } from "@/lib/atributos-display";
import { TIPO_PRODUCTO_LABELS } from "@/types/catalogo";
import AddToCartButton from "@/components/AddToCartButton";

export const revalidate = 60;

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const producto = await obtenerProductoPorSlug(slug);

  if (!producto) {
    notFound();
  }

  const atributos = obtenerAtributosDisplay(producto);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div className="relative w-full aspect-square rounded-2xl bg-neutral-100 overflow-hidden">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-400">
            Sin imagen
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 flex-wrap">
          {producto.categorias?.nombre && (
            <span className="text-xs uppercase tracking-wide text-emerald-600 font-medium">
              {producto.categorias.nombre}
            </span>
          )}
          <span className="text-[11px] uppercase tracking-wide text-neutral-500 border border-neutral-200 rounded px-1.5 py-0.5">
            {TIPO_PRODUCTO_LABELS[producto.tipo_producto]}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mt-1">
          {producto.nombre}
        </h1>

        {producto.descripcion_larga && (
          <p className="text-neutral-600 mt-4 leading-relaxed">
            {producto.descripcion_larga}
          </p>
        )}

        {atributos.length > 0 && (
          <dl className="grid grid-cols-2 gap-y-2 gap-x-4 mt-6 text-sm">
            {atributos.map((at) => (
              <div key={at.label} className="contents">
                <dt className="text-neutral-400">{at.label}</dt>
                <dd className="text-neutral-800">{at.valor}</dd>
              </div>
            ))}
          </dl>
        )}

        {producto.advertencias && (
          <p className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            ⚠️ {producto.advertencias}
          </p>
        )}

        {producto.patologias && producto.patologias.length > 0 && (
          <div className="mt-6">
            <p className="text-sm text-neutral-400 mb-2">
              Recomendado en casos de:
            </p>
            <div className="flex flex-wrap gap-2">
              {producto.patologias.map((pat) => (
                <span
                  key={pat.id}
                  className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                >
                  {pat.nombre}
                </span>
              ))}
            </div>
          </div>
        )}

        {producto.precio != null && (
          <p className="text-2xl font-bold text-neutral-900 mt-8">
            ${producto.precio.toLocaleString("es-AR")}
          </p>
        )}

        {/* El carrito recalcula el precio unitario según la cantidad elegida */}
        <AddToCartButton producto={producto} />
      </div>
    </main>
  );
}
