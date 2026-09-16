"use client";

import { useTransition } from "react";
import { eliminarProducto } from "./actions";

export default function EliminarProductoButton({
  id,
  nombre,
}: {
  id: string;
  nombre: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    startTransition(() => {
      eliminarProducto(id);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-red-500 hover:underline disabled:opacity-50"
    >
      {isPending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
