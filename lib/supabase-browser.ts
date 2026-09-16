import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para usar en Client Components (ej: el formulario
 * de login). Guarda la sesión en cookies para que el servidor
 * (lib/supabase-server.ts) pueda leerla en el siguiente request.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
