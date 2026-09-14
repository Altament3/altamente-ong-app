import { supabase } from "./supabase";
import { Producto } from "@/types/catalogo";

import { TipoProducto } from "@/types/catalogo";

interface FiltrosCatalogo {
  categoriaSlug?: string;
  patologiaId?: string;
  tipoProducto?: TipoProducto;
}

export async function obtenerProductos(filtros: FiltrosCatalogo = {}): Promise<Producto[]> {
  let query = supabase
    .from("productos")
    .select(
      `
      *,
      categorias ( id, nombre, slug ),
      producto_patologias ( patologias ( id, nombre ) ),
      precios_cantidad ( id, cantidad_minima, precio_unitario )
    `
    )
    .eq("disponible", true)
    .order("nombre", { ascending: true });

  if (filtros.tipoProducto) {
    query = query.eq("tipo_producto", filtros.tipoProducto);
  }

  if (filtros.categoriaSlug) {
    // Filtrado por categoría vía join; si Supabase no permite filtrar
    // directamente sobre la relación, se filtra en memoria más abajo.
    const { data: categoria } = await supabase
      .from("categorias")
      .select("id")
      .eq("slug", filtros.categoriaSlug)
      .single();

    if (categoria) {
      query = query.eq("categoria_id", categoria.id);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error obteniendo productos:", error);
    return [];
  }

  let productos = (data ?? []).map((p: any) => ({
    ...p,
    patologias: p.producto_patologias?.map((pp: any) => pp.patologias) ?? [],
  })) as Producto[];

  if (filtros.patologiaId) {
    productos = productos.filter((p) =>
      p.patologias?.some((pat) => pat.id === filtros.patologiaId)
    );
  }

  return productos;
}

export async function obtenerProductoPorSlug(slug: string): Promise<Producto | null> {
  const { data, error } = await supabase
    .from("productos")
    .select(
      `
      *,
      categorias ( id, nombre, slug ),
      producto_patologias ( patologias ( id, nombre ) ),
      producto_imagenes ( id, url, orden ),
      precios_cantidad ( id, cantidad_minima, precio_unitario )
    `
    )
    .eq("slug", slug)
    .eq("disponible", true)
    .single();

  if (error || !data) {
    console.error("Error obteniendo producto:", error);
    return null;
  }

  return {
    ...data,
    patologias: data.producto_patologias?.map((pp: any) => pp.patologias) ?? [],
  } as Producto;
}
