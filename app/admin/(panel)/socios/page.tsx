import { supabaseAdmin } from "@/lib/supabase-admin";
import { crearSocio } from "./actions";
import EliminarSocioButton from "./EliminarSocioButton";

export default async function SociosPage() {
  const { data } = await supabaseAdmin.auth.admin.listUsers();
  const socios = (data?.users ?? []).filter(
    (u) => u.app_metadata?.role !== "admin"
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Socios</h1>

      <form
        action={crearSocio}
        className="mb-8 border border-neutral-200 rounded-xl p-4 space-y-3 max-w-md"
      >
        <p className="font-medium text-neutral-900">Agregar socio nuevo</p>
        <div>
          <label className="text-sm text-neutral-600">
            Nombre (opcional)
          </label>
          <input
            name="nombre"
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-600">Email *</label>
          <input
            name="email"
            type="email"
            required
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-600">Contraseña *</label>
          <input
            name="password"
            type="text"
            required
            minLength={6}
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          />
          <p className="text-xs text-neutral-400 mt-1">
            Se la vas a tener que pasar vos al socio/a por otro medio
            (WhatsApp, email, etc).
          </p>
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
        >
          Crear cuenta
        </button>
      </form>

      <div className="space-y-2">
        {socios.map((s) => (
          <div
            key={s.id}
            className="flex justify-between items-center border-b border-neutral-100 py-2 text-sm"
          >
            <div>
              <p className="font-medium text-neutral-900">
                {s.user_metadata?.nombre || "(sin nombre)"}
              </p>
              <p className="text-neutral-500">{s.email}</p>
            </div>
            <EliminarSocioButton userId={s.id} />
          </div>
        ))}
        {socios.length === 0 && (
          <p className="text-neutral-500">
            Todavía no cargaste ningún socio.
          </p>
        )}
      </div>
    </div>
  );
}