"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { EstadoPedido } from "@/lib/estados-pedido";

export async function actualizarEstadoPedido(id: string, estado: EstadoPedido) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("pedidos")
    .update({ estado })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/pedidos");
}