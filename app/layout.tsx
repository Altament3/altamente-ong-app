import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import HeaderCarrito from "@/components/HeaderCarrito";

export const metadata = {
  title: "Catálogo",
  description:
    "Extractos, aceites, materia vegetal, cremas y comestibles naturales",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <HeaderCarrito />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
