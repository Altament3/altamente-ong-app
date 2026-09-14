"use client";

import { useState, useMemo, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { calcularPrecioUnitario } from "@/lib/precios";
import { calcularCostoEnvio, ZonaEnvio } from "@/lib/envio";

const ZONAS: { valor: ZonaEnvio; label: string }[] = [
  { valor: "CABA", label: "CABA" },
  { valor: "GBA", label: "GBA" },
  { valor: "retiro_en_persona", label: "Retiro en persona" },
];

export default function CheckoutPage() {
  const { items, vaciarCarrito } = useCart();
  const router = useRouter();

  const [zona, setZona] = useState<ZonaEnvio>("CABA");
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
    notas: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotalProductos = items.reduce((acc, item) => {
    const precioUnitario = calcularPrecioUnitario(
      item.precio_base,
      item.cantidad,
      item.precios_cantidad ?? []
    );
    return acc + precioUnitario * item.cantidad;
  }, 0);

  const costoEnvio = useMemo(() => {
    const itemsEnvio = items.map((i) => ({
      gramos: (i.presentacion_gramos ?? 0) * i.cantidad,
      categoriaSlug: i.categoria_slug,
      cuenta_para_envio_flores: i.cuenta_para_envio_flores,
    }));
    return calcularCostoEnvio(itemsEnvio, zona);
  }, [items, zona]);

  const total = subtotalProductos + costoEnvio;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (zona !== "retiro_en_persona" && !form.direccion.trim()) {
      setError("La dirección es obligatoria para envíos a domicilio");
      return;
    }

    setEnviando(true);

    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: form,
          zona_envio: zona,
          items: items.map((i) => ({
            producto_id: i.producto_id,
            cantidad: i.cantidad,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No pudimos generar tu pedido");
      }

      vaciarCarrito();
      router.push(`/pedido/${data.pedido_id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="max-w-md mx-auto px-4 py-16 text-center text-neutral-500">
        Tu carrito está vacío.
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">
        Datos de contacto
      </h1>

      <div className="mb-6">
        <p className="text-sm text-neutral-600 mb-2">Zona de envío</p>
        <div className="flex gap-2">
          {ZONAS.map((z) => (
            <button
              key={z.valor}
              type="button"
              onClick={() => setZona(z.valor)}
              className={`flex-1 text-sm py-2 rounded-lg border ${
                zona === z.valor
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "border-neutral-200 text-neutral-600"
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-neutral-600">Nombre completo *</label>
          <input
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-600">Teléfono *</label>
          <input
            required
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-600">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          />
        </div>
        {zona !== "retiro_en_persona" && (
          <div>
            <label className="text-sm text-neutral-600">
              Dirección de envío *
            </label>
            <input
              required
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
            />
            {zona === "GBA" && (
              <p className="text-xs text-neutral-400 mt-1">
                El costo de envío a GBA puede variar según la dirección
                exacta; te confirmamos el valor final por WhatsApp.
              </p>
            )}
          </div>
        )}
        <div>
          <label className="text-sm text-neutral-600">Notas (opcional)</label>
          <textarea
            value={form.notas}
            onChange={(e) => setForm({ ...form, notas: e.target.value })}
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
            rows={3}
          />
        </div>

        <div className="border-t border-neutral-200 pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-neutral-500">
            <span>Subtotal</span>
            <span>${subtotalProductos.toLocaleString("es-AR")}</span>
          </div>
          <div className="flex justify-between text-neutral-500">
            <span>Envío ({ZONAS.find((z) => z.valor === zona)?.label})</span>
            <span>
              {costoEnvio === 0
                ? "Gratis 🎊"
                : `$${costoEnvio.toLocaleString("es-AR")}`}
            </span>
          </div>
          <div className="flex justify-between font-semibold text-neutral-900 text-base pt-1">
            <span>Total</span>
            <span>${total.toLocaleString("es-AR")}</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium disabled:opacity-50"
        >
          {enviando ? "Confirmando..." : "Confirmar pedido"}
        </button>
      </form>
    </main>
  );
}
