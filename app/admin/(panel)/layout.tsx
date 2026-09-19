import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div>
      <header className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <nav className="flex gap-4 text-sm font-medium text-neutral-700">
            <Link href="/admin/dashboard" className="hover:text-emerald-600">
              Dashboard
            </Link>
            <Link href="/admin/productos" className="hover:text-emerald-600">
              Productos
            </Link>
            <Link href="/admin/pedidos" className="hover:text-emerald-600">
              Pedidos
            </Link>
            <Link href="/admin/clientes" className="hover:text-emerald-600">
              Clientes
            </Link>
            <Link href="/admin/reportes" className="hover:text-emerald-600">
              Reportes
            </Link>
            <Link href="/admin/avisos" className="hover:text-emerald-600">
              Avisos
            </Link>
            <Link href="/catalogo" className="text-neutral-400 hover:text-neutral-600">
              Ver catálogo público →
            </Link>
          </nav>
          <LogoutButton />
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}