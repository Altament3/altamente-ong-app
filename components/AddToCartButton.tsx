"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/lib/cart-context";
import { calcularPrecioUnitario } from "@/lib/precios";
import { Producto, AtributosMateriaVegetal } from "@/types/catalogo";

export default function AddToCartButton({ producto }: { producto: Producto }) {
  const { agregarItem } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  const tiersOrdenados = useMemo(
    () =>
      [...(producto.precios_cantidad ?? [])].sort(
        (a, b) => a.cantidad_minima - b.cantidad_minima
      ),
    [producto.precios_cantidad]
  );

  const precioUnitario = calcularPrecioUnitario(
    producto.precio ?? 0,
    cantidad,
    producto.precios_cantidad
  );
  const subtotal = precioUnitario * cantidad;
  const sinStock = producto.stock <= 0;

  function handleAgregar() {
    const atributosVegetal =
      producto.tipo_producto === "materia_vegetal"
        ? (producto.atributos as AtributosMateriaVegetal)
        : null;

    agregarItem(
      {
        producto_id: producto.id,
        nombre: producto.nombre,
        slug: producto.slug,
        imagen_url: producto.imagen_url,
        precio_base: producto.precio ?? 0,
        precios_cantidad: producto.precios_cantidad,
        tipo_producto: producto.tipo_producto,
        presentacion_gramos: atributosVegetal?.presentacion_gramos ?? null,
        categoria_slug: producto.categorias?.slug ?? null,
        cuenta_para_envio_flores: producto.cuenta_para_envio_flores,
      },
      cantidad
    );
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  }

  return (
    <div className="mt-6 space-y-3">
      {tiersOrdenados.length > 0 && (
        <div className="text-xs text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-lg p-3 space-y-0.5">
          <p className="font-medium text-neutral-600 mb-1">Precios por cantidad:</p>
          <p>1 - {tiersOrdenados[0].cantidad_minima - 1} unidades: ${Number(producto.precio ?? 0).toLocaleString("es-AR")} c/u</p>
          {tiersOrdenados.map((t, idx) => {
            const siguiente = tiersOrdenados[idx + 1];
            const rango = siguiente
              ? `${t.cantidad_minima} - ${siguiente.cantidad_minima - 1}`
              : `${t.cantidad_minima}+`;
            return (
              <p key={t.id}>
                {rango} unidades: ${Number(t.precio_unitario).toLocaleString("es-AR")} c/u
              </p>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center border border-neutral-200 rounded-lg">
          <button
            type="button"
            aria-label="Restar cantidad"
            className="px-3 py-2 text-neutral-500 disabled:opacity-30"
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
            disabled={cantidad <= 1}
          >
            −
          </button>
          <span className="px-3 min-w-[2ch] text-center">{cantidad}</span>
          <button
            type="button"
            aria-label="Sumar cantidad"
            className="px-3 py-2 text-neutral-500 disabled:opacity-30"
            onClick={() => setCantidad((c) => Math.min(producto.stock, c + 1))}
            disabled={cantidad >= producto.stock}
          >
            +
          </button>
        </div>
        <p className="text-sm text-neutral-500">
          Subtotal:{" "}
          <span className="font-semibold text-neutral-900">
            ${subtotal.toLocaleString("es-AR")}
          </span>
        </p>
      </div>

      <button
        onClick={handleAgregar}
        disabled={sinStock}
        className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
      >
        {sinStock ? "Sin stock" : agregado ? "¡Agregado! ✓" : "Agregar al pedido"}
      </button>
    </div>
  );
}
