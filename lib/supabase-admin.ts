import { createClient } from "@supabase/supabase-js";

// ⚠️ SOLO importar este archivo desde código que corre en el servidor
// (Route Handlers en app/api/**, Server Components, Server Actions).
// NUNCA importarlo desde un archivo con "use client" — la Service Role Key
// tiene permisos totales y saltea RLS.
//
// Variables necesarias (agregar en .env.local y en Vercel → sin prefijo
// NEXT_PUBLIC, para que no se exponga al navegador):
// SUPABASE_SERVICE_ROLE_KEY

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Faltan variables de entorno para el cliente admin de Supabase (SUPABASE_SERVICE_ROLE_KEY)"
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
