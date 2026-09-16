"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function crearProducto(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const nombre = formData.get("nombre") as string;
  const slug = formData.get("slug") as string;
  const categoriaId = (formData.get("categoria_id") as string) || null;
  const tipoProducto = formData.get("tipo_producto") as string;
  const precio = Number(formData.get("precio"));
  const stock = Number(formData.get("stock"));
  const descripcionCorta = (formData.get("descripcion_corta") as string) || null;

  const { error } = await supabase.from("productos").insert({
    nombre,
    slug,
    categoria_id: categoriaId,
    tipo_producto: tipoProducto,
    precio,
    stock,
    descripcion_corta: descripcionCorta,
    disponible: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  redirect("/admin/productos");
}

export async function actualizarProducto(id: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const nombre = formData.get("nombre") as string;
  const precio = Number(formData.get("precio"));
  const stock = Number(formData.get("stock"));
  const disponible = formData.get("disponible") === "on";
  const descripcionCorta = (formData.get("descripcion_corta") as string) || null;

  const { error } = await supabase
    .from("productos")
    .update({
      nombre,
      precio,
      stock,
      disponible,
      descripcion_corta: descripcionCorta,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  redirect("/admin/productos");
}

export async function eliminarProducto(id: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("productos").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
}
