import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente de Supabase para usar en Server Components y Server Actions.
 * Lee/escribe la sesión del usuario logueado a través de las cookies
 * del navegador (necesario para que el panel admin sepa quién está
 * logueado y para que las policies de RLS que dicen
 * "auth.role() = 'authenticated'" funcionen correctamente).
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Los Server Components no pueden escribir cookies directamente;
            // si esto se llama desde uno, se ignora (la sesión se refresca
            // igual en el siguiente request a través del login/logout).
          }
        },
      },
    }
  );
}
