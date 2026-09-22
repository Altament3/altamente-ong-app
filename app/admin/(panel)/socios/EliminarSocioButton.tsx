"use client";

import { useTransition } from "react";
import { eliminarSocio } from "./actions";

export default function EliminarSocioButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("¿Eliminar esta cuenta de socio? No se puede deshacer.")) {
      return;
    }
    startTransition(() => {
      eliminarSocio(userId);
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