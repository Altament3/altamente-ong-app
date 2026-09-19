import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import AvisoAcciones from "./AvisoAcciones";

export default async function AvisosPage() {
  const supabase = await createSupabaseServerClient();
  const { data: avisos } = await supabase
    .from("avisos")
    .select("*")
    .order("orden", { ascending: true });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">
          Avisos y promociones
        </h1>
        <Link
          href="/admin/avisos/nuevo"
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
        >
          + Nuevo aviso
        </Link>
      </div>

      <p className="text-sm text-neutral-400 mb-6">
        Los avisos activos (y dentro de su rango de fechas, si tienen)
        aparecen como banner arriba de todo en el catálogo público.
      </p>

      <div className="space-y-3">
        {avisos?.map((a) => (
          <div
            key={a.id}
            className="border border-neutral-200 rounded-xl p-4 flex justify-between items-center gap-4"
          >
            <div className="flex-1">
              <div
                className="text-xs px-2 py-1 rounded-lg inline-block mb-2"
                style={{ backgroundColor: a.color_fondo, color: a.color_texto }}
              >
                {a.titulo && <strong className="mr-1">{a.titulo}:</strong>}
                {a.mensaje}
              </div>
              <p className="text-xs text-neutral-400">
                {a.activo ? (
                  <span className="text-emerald-600 font-medium">Activo</span>
                ) : (
                  <span className="text-neutral-400">Inactivo</span>
                )}
                {a.fecha_inicio &&
                  ` · desde ${new Date(a.fecha_inicio).toLocaleDateString("es-AR")}`}
                {a.fecha_fin &&
                  ` · hasta ${new Date(a.fecha_fin).toLocaleDateString("es-AR")}`}
              </p>
            </div>

            <AvisoAcciones id={a.id} activo={a.activo} />
          </div>
        ))}

        {(!avisos || avisos.length === 0) && (
          <p className="text-neutral-500">Todavía no creaste ningún aviso.</p>
        )}
      </div>
    </div>
  );
}