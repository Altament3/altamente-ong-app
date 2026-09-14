"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { PrecioCantidad, TipoProducto } from "@/types/catalogo";

export interface CartItem {
  producto_id: string;
  nombre: string;
  slug: string;
  imagen_url: string | null;
  precio_base: number;
  precios_cantidad?: PrecioCantidad[];
  cantidad: number;
  // Datos necesarios para calcular el envío por gramos de flor
  tipo_producto: TipoProducto;
  presentacion_gramos?: number | null;
  categoria_slug?: string | null;
  cuenta_para_envio_flores: boolean;
}

interface CartContextValue {
  items: CartItem[];
  agregarItem: (item: Omit<CartItem, "cantidad">, cantidad?: number) => void;
  actualizarCantidad: (producto_id: string, cantidad: number) => void;
  quitarItem: (producto_id: string) => void;
  vaciarCarrito: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "nachi-ong-carrito";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cargado, setCargado] = useState(false);

  // Cargar carrito guardado al montar
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(STORAGE_KEY);
      if (guardado) setItems(JSON.parse(guardado));
    } catch (e) {
      console.error("Error leyendo el carrito guardado:", e);
    } finally {
      setCargado(true);
    }
  }, []);

  // Persistir cada cambio
  useEffect(() => {
    if (!cargado) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Error guardando el carrito:", e);
    }
  }, [items, cargado]);

  function agregarItem(item: Omit<CartItem, "cantidad">, cantidad: number = 1) {
    setItems((prev) => {
      const existente = prev.find((i) => i.producto_id === item.producto_id);
      if (existente) {
        return prev.map((i) =>
          i.producto_id === item.producto_id
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [...prev, { ...item, cantidad }];
    });
  }

  function actualizarCantidad(producto_id: string, cantidad: number) {
    setItems((prev) =>
      cantidad <= 0
        ? prev.filter((i) => i.producto_id !== producto_id)
        : prev.map((i) =>
            i.producto_id === producto_id ? { ...i, cantidad } : i
          )
    );
  }

  function quitarItem(producto_id: string) {
    setItems((prev) => prev.filter((i) => i.producto_id !== producto_id));
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        agregarItem,
        actualizarCantidad,
        quitarItem,
        vaciarCarrito,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
