import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "@/lib/cart-context";
import HeaderCarrito from "@/components/HeaderCarrito";
import AvisosBanner from "@/components/AvisosBanner";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Extractos, aceites, materia vegetal, cremas y comestibles naturales",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Altamente",
  },
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AvisosBanner />
        <CartProvider>
          <HeaderCarrito />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}