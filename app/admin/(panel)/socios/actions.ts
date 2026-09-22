"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function crearSocio(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nombre = (formData.get("nombre") as string) || null;

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nombre },
    app_metadata: { role: "socio" },
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/socios");
}

export async function eliminarSocio(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/socios");
}