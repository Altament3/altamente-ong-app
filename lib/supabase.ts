import { createClient } from "@supabase/supabase-js";

// Variables de entorno (definir en .env.local y en Vercel):
// NEXT_PUBLIC_SUPABASE_URL
// NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan las variables de entorno de Supabase (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)"
  );
}

// Cliente único para usar tanto en Server Components como en Client Components
// (para escritura autenticada en fases futuras, se agregará un cliente server-side con cookies)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
