"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function crearAviso(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const titulo = (formData.get("titulo") as string) || null;
  const mensaje = formData.get("mensaje") as string;
  const colorFondo = (formData.get("color_fondo") as string) || "#059669";
  const colorTexto = (formData.get("color_texto") as string) || "#ffffff";
  const fechaInicio = (formData.get("fecha_inicio") as string) || null;
  const fechaFin = (formData.get("fecha_fin") as string) || null;
  const orden = Number(formData.get("orden") || 0);

  const { error } = await supabase.from("avisos").insert({
    titulo,
    mensaje,
    color_fondo: colorFondo,
    color_texto: colorTexto,
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
    orden,
    activo: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/avisos");
  redirect("/admin/avisos");
}

export async function actualizarAviso(id: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const titulo = (formData.get("titulo") as string) || null;
  const mensaje = formData.get("mensaje") as string;
  const colorFondo = (formData.get("color_fondo") as string) || "#059669";
  const colorTexto = (formData.get("color_texto") as string) || "#ffffff";
  const fechaInicio = (formData.get("fecha_inicio") as string) || null;
  const fechaFin = (formData.get("fecha_fin") as string) || null;
  const orden = Number(formData.get("orden") || 0);
  const activo = formData.get("activo") === "on";

  const { error } = await supabase
    .from("avisos")
    .update({
      titulo,
      mensaje,
      color_fondo: colorFondo,
      color_texto: colorTexto,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      orden,
      activo,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/avisos");
  redirect("/admin/avisos");
}

export async function eliminarAviso(id: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("avisos").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/avisos");
}

export async function togglearActivo(id: string, activo: boolean) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("avisos")
    .update({ activo })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/avisos");
}