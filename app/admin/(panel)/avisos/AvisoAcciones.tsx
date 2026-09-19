"use client";

import Link from "next/link";
import { useTransition } from "react";
import { eliminarAviso, togglearActivo } from "./actions";

export default function AvisoAcciones({
  id,
  activo,
}: {
  id: string;
  activo: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(() => {
      togglearActivo(id, !activo);
    });
  }

  function handleEliminar() {
    if (!confirm("¿Eliminar este aviso? No se puede deshacer.")) return;
    startTransition(() => {
      eliminarAviso(id);
    });
  }

  return (
    <div className="flex items-center gap-3 flex-shrink-0 text-sm">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className="text-neutral-600 hover:underline disabled:opacity-50"
      >
        {activo ? "Desactivar" : "Activar"}
      </button>
      <Link href={`/admin/avisos/${id}`} className="text-emerald-600 hover:underline">
        Editar
      </Link>
      <button
        onClick={handleEliminar}
        disabled={isPending}
        className="text-red-500 hover:underline disabled:opacity-50"
      >
        Eliminar
      </button>
    </div>
  );
}