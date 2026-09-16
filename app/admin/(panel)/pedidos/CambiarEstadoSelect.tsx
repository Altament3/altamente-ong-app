"use client";

import { useState, useTransition } from "react";
import { actualizarEstadoPedido } from "./actions";
import { ESTADOS_PEDIDO, EstadoPedido } from "@/lib/estados-pedido";

const LABELS: Record<EstadoPedido, string> = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  en_preparacion: "En preparación",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const COLORES: Record<EstadoPedido, string> = {
  pendiente: "bg-neutral-100 text-neutral-600",
  confirmado: "bg-blue-50 text-blue-700",
  en_preparacion: "bg-amber-50 text-amber-700",
  enviado: "bg-indigo-50 text-indigo-700",
  entregado: "bg-emerald-50 text-emerald-700",
  cancelado: "bg-red-50 text-red-600",
};

export default function CambiarEstadoSelect({
  pedidoId,
  estadoActual,
}: {
  pedidoId: string;
  estadoActual: EstadoPedido;
}) {
  const [estado, setEstado] = useState<EstadoPedido>(estadoActual);
  const [isPending, startTransition] = useTransition();

  function handleChange(nuevoEstado: EstadoPedido) {
    setEstado(nuevoEstado);
    startTransition(() => {
      actualizarEstadoPedido(pedidoId, nuevoEstado);
    });
  }

  return (
    <select
      value={estado}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value as EstadoPedido)}
      className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer disabled:opacity-50 ${COLORES[estado]}`}
    >
      {ESTADOS_PEDIDO.map((e) => (
        <option key={e} value={e}>
          {LABELS[e]}
        </option>
      ))}
    </select>
  );
}