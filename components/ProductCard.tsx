import Link from "next/link";
import Image from "next/image";
import { Producto, TIPO_PRODUCTO_LABELS } from "@/types/catalogo";

export default function ProductCard({ producto }: { producto: Producto }) {
  return (
    <Link
      href={`/catalogo/${producto.slug}`}
      className="group block rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow bg-white"
    >
      <div className="relative w-full aspect-square bg-neutral-100">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-400 text-sm">
            Sin imagen
          </div>
        )}
      </div>

      <div className="p-4 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          {producto.categorias?.nombre && (
            <span className="text-xs uppercase tracking-wide text-emerald-600 font-medium">
              {producto.categorias.nombre}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-wide text-neutral-400 border border-neutral-200 rounded px-1.5 py-0.5">
            {TIPO_PRODUCTO_LABELS[producto.tipo_producto]}
          </span>
        </div>
        <h3 className="font-semibold text-neutral-900">{producto.nombre}</h3>
        {producto.descripcion_corta && (
          <p className="text-sm text-neutral-500 line-clamp-2">
            {producto.descripcion_corta}
          </p>
        )}

        {producto.patologias && producto.patologias.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {producto.patologias.slice(0, 3).map((pat) => (
              <span
                key={pat.id}
                className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
              >
                {pat.nombre}
              </span>
            ))}
          </div>
        )}

        {producto.precio != null && (
          <p className="pt-2 font-semibold text-neutral-900">
            ${producto.precio.toLocaleString("es-AR")}
          </p>
        )}
      </div>
    </Link>
  );
}
