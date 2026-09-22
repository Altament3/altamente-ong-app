"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function HeaderCarrito() {
  const { totalItems } = useCart();
  const pathname = usePathname();

  if (pathname === "/login" || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="border-b border-neutral-100 sticky top-0 bg-white/80 backdrop-blur z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/catalogo" className="font-semibold text-neutral-900">
          Catálogo
        </Link>
        <Link href="/carrito" className="relative text-sm text-neutral-600">
          Carrito
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-emerald-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}