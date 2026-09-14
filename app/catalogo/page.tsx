import { obtenerProductos } from "@/lib/productos";
import ProductCard from "@/components/ProductCard";
import { TIPO_PRODUCTO_LABELS, TipoProducto } from "@/types/catalogo";

export const revalidate = 60; // ISR: re-genera cada 60s

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{
    categoria?: string;
    patologia?: string;
    tipo?: TipoProducto;
  }>;
}) {
  const params = await searchParams;

  const productos = await obtenerProductos({
    categoriaSlug: params.categoria,
    patologiaId: params.patologia,
    tipoProducto: params.tipo,
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Catálogo</h1>
        <p className="text-neutral-500 mt-1">
          Extractos y aceites naturales para acompañar distintos tratamientos.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 mb-8">
        
          <a href="/catalogo"
          className={`text-xs px-3 py-1.5 rounded-full border ${
            !params.tipo
              ? "bg-emerald-600 text-white border-emerald-600"
              : "border-neutral-200 text-neutral-600"
          }`}
        >
          Todos
        </a>
        {Object.entries(TIPO_PRODUCTO_LABELS).map(([valor, label]) => (
          
            <a key={valor}
            href={`/catalogo?tipo=${valor}`}
            className={`text-xs px-3 py-1.5 rounded-full border ${
              params.tipo === valor
                ? "bg-emerald-600 text-white border-emerald-600"
                : "border-neutral-200 text-neutral-600"
            }`}
          >
            {label}
          </a>
        ))}
      </nav>

      {productos.length === 0 ? (
        <p className="text-neutral-500">
          No hay productos disponibles con estos filtros por el momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </main>
  );
}
