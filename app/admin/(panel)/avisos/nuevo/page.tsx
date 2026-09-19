import { crearAviso } from "../actions";

export default function NuevoAvisoPage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">
        Nuevo aviso
      </h1>
      <form action={crearAviso} className="space-y-4">
        <div>
          <label className="text-sm text-neutral-600">
            Título (opcional)
          </label>
          <input
            name="titulo"
            placeholder="ej: ¡Promo!"
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-600">Mensaje *</label>
          <textarea
            name="mensaje"
            required
            rows={2}
            placeholder="ej: Envío gratis a CABA en compras desde $30.000"
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-neutral-600">Color de fondo</label>
            <input
              name="color_fondo"
              type="color"
              defaultValue="#059669"
              className="w-full mt-1 h-10 border border-neutral-200 rounded-lg px-1"
            />
          </div>
          <div>
            <label className="text-sm text-neutral-600">Color de texto</label>
            <input
              name="color_texto"
              type="color"
              defaultValue="#ffffff"
              className="w-full mt-1 h-10 border border-neutral-200 rounded-lg px-1"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-neutral-600">
              Fecha inicio (opcional)
            </label>
            <input
              name="fecha_inicio"
              type="date"
              className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-neutral-600">
              Fecha fin (opcional)
            </label>
            <input
              name="fecha_fin"
              type="date"
              className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-neutral-600">
            Orden (si hay varios avisos, menor número aparece primero)
          </label>
          <input
            name="orden"
            type="number"
            defaultValue={0}
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          />
        </div>

        <p className="text-xs text-neutral-400">
          Sin fechas cargadas, el aviso queda activo indefinidamente (hasta
          que lo desactives a mano).
        </p>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700"
        >
          Crear aviso
        </button>
      </form>
    </div>
  );
}