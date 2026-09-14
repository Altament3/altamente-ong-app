"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { calcularPrecioUnitario } from "@/lib/precios";
import { calcularCostoEnvio, ZonaEnvio } from "@/lib/envio";

const ZONAS: { valor: ZonaEnvio; label: string }[] = [
  { valor: "CABA", label: "CABA" },
  { valor: "GBA", label: "GBA" },
  { valor: "retiro_en_persona", label: "Retiro en persona" },
];

export default function CarritoPage() {
  const { items, actualizarCantidad, quitarItem, totalItems } = useCart();
  const [zona, setZona] = useState<ZonaEnvio>("CABA");

  const lineas = items.map((item) => {
    const precioUnitario = calcularPrecioUnitario(
      item.precio_base,
      item.cantidad,
      item.precios_cantidad ?? []
    );
    return {
      ...item,
      precioUnitario,
      subtotal: precioUnitario * item.cantidad,
    };
  });

  const subtotalProductos = lineas.reduce((acc, l) => acc + l.subtotal, 0);

  const costoEnvio = useMemo(() => {
    const itemsEnvio = items.map((i) => ({
      gramos: (i.presentacion_gramos ?? 0) * i.cantidad,
      categoriaSlug: i.categoria_slug,
      cuenta_para_envio_flores: i.cuenta_para_envio_flores,
    }));
    return calcularCostoEnvio(itemsEnvio, zona);
  }, [items, zona]);

  const total = subtotalProductos + costoEnvio;

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-neutral-500">Tu carrito está vacío.</p>
        <Link
          href="/catalogo"
          className="text-emerald-600 font-medium mt-2 inline-block"
        >
          Ver catálogo →
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Tu pedido</h1>

      <div className="space-y-4">
        {lineas.map((linea) => (
          <div
            key={linea.producto_id}
            className="flex gap-4 items-center border-b border-neutral-100 pb-4"
          >
            <div className="relative w-16 h-16 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
              {linea.imagen_url && (
                <Image
                  src={linea.imagen_url}
                  alt={linea.nombre}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium text-neutral-900">{linea.nombre}</p>
              <p className="text-sm text-neutral-500">
                ${linea.precioUnitario.toLocaleString("es-AR")} c/u
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() =>
                    actualizarCantidad(linea.producto_id, linea.cantidad - 1)
                  }
                  className="w-7 h-7 border border-neutral-200 rounded text-neutral-500"
                >
                  −
                </button>
                <span className="min-w-[2ch] text-center">
                  {linea.cantidad}
                </span>
                <button
                  onClick={() =>
                    actualizarCantidad(linea.producto_id, linea.cantidad + 1)
                  }
                  className="w-7 h-7 border border-neutral-200 rounded text-neutral-500"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-neutral-900">
                ${linea.subtotal.toLocaleString("es-AR")}
              </p>
              <button
                onClick={() => quitarItem(linea.producto_id)}
                className="text-xs text-red-500 mt-1"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-neutral-200">
        <p className="text-neutral-500">Subtotal ({totalItems} unidades)</p>
        <p className="font-semibold text-neutral-900">
          ${subtotalProductos.toLocaleString("es-AR")}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-sm text-neutral-600 mb-2">Zona de envío</p>
        <div className="flex gap-2">
          {ZONAS.map((z) => (
            <button
              key={z.valor}
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

      <div className="flex justify-between items-center mt-3">
        <p className="text-neutral-500">Envío</p>
        <p className="font-medium text-neutral-900">
          {costoEnvio === 0 ? "Gratis 🎊" : `$${costoEnvio.toLocaleString("es-AR")}`}
        </p>
      </div>

      <div className="flex justify-between items-center mt-2 pt-3 border-t border-neutral-200">
        <p className="font-semibold text-neutral-900">Total</p>
        <p className="text-xl font-bold text-neutral-900">
          ${total.toLocaleString("es-AR")}
        </p>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block text-center w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
      >
        Continuar con el pedido
      </Link>
    </main>
  );
}
