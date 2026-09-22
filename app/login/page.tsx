"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/catalogo";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const supabase = createSupabaseBrowserClient();
    const { error: errorLogin } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (errorLogin) {
      setError("Email o contraseña incorrectos");
      setCargando(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <main className="max-w-sm mx-auto px-4 py-24">
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Altamente</h1>
      <p className="text-neutral-500 mb-6">
        Ingresá con tu cuenta de socio/a.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-neutral-600">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-600">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-2"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={cargando}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium disabled:opacity-50"
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <p className="text-xs text-neutral-400 mt-6">
        ¿Todavía no sos socio/a? Contactanos para sumarte.
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}