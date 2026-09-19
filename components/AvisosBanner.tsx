"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Aviso {
  id: string;
  titulo: string | null;
  mensaje: string;
  color_fondo: string;
  color_texto: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
}

export default function AvisosBanner() {
  const pathname = usePathname();
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    async function cargar() {
      const ahora = new Date().toISOString();

      const { data } = await supabase
        .from("avisos")
        .select("*")
        .eq("activo", true)
        .order("orden", { ascending: true });

      if (!data) return;

      const vigentes = data.filter((a: Aviso) => {
        const iniOk = !a.fecha_inicio || a.fecha_inicio <= ahora;
        const finOk = !a.fecha_fin || a.fecha_fin >= ahora;
        return iniOk && finOk;
      });

      setAvisos(vigentes);
    }

    cargar();
  }, [pathname]);

  if (pathname?.startsWith("/admin") || avisos.length === 0) return null;

  return (
    <div>
      {avisos.map((a) => (
        <div
          key={a.id}
          style={{ backgroundColor: a.color_fondo, color: a.color_texto }}
          className="px-4 py-2 text-sm text-center"
        >
          {a.titulo && <strong className="mr-1">{a.titulo}:</strong>}
          {a.mensaje}
        </div>
      ))}
    </div>
  );
}