export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  orden: number;
  activa: boolean;
}

export interface Patologia {
  id: string;
  nombre: string;
  descripcion: string | null;
}

export interface ProductoImagen {
  id: string;
  url: string;
  orden: number;
}

export type TipoProducto =
  | "extracto_aceite"
  | "materia_vegetal"
  | "crema_topico"
  | "comestible";

export const TIPO_PRODUCTO_LABELS: Record<TipoProducto, string> = {
  extracto_aceite: "Extracto / Aceite",
  materia_vegetal: "Materia vegetal",
  crema_topico: "Crema / Tópico",
  comestible: "Comestible",
};

// Atributos flexibles según el tipo de producto (columna `atributos` en Supabase)
export interface AtributosExtractoAceite {
  tipo_extracto?: string;
  concentracion_mg_ml?: number;
  volumen_ml?: number;
  ratio_cbd_thc?: string;
}

export interface AtributosMateriaVegetal {
  genetica?: string;
  thc_porcentaje?: number;
  cbd_porcentaje?: number;
  metodo_cultivo?: string;
  presentacion_gramos?: number;
}

export interface AtributosCremaTopico {
  ingredientes_activos?: string[];
  concentracion_cbd_mg?: number;
  volumen_ml?: number;
  uso_recomendado?: string;
}

export interface AtributosComestible {
  mg_por_unidad?: number;
  unidades_por_envase?: number;
  sabor?: string;
  ingredientes?: string[];
  alergenos?: string[];
}

export type AtributosProducto =
  | AtributosExtractoAceite
  | AtributosMateriaVegetal
  | AtributosCremaTopico
  | AtributosComestible;

export interface PrecioCantidad {
  id: string;
  cantidad_minima: number;
  precio_unitario: number;
}

export interface Producto {
  id: string;
  categoria_id: string | null;
  nombre: string;
  slug: string;
  descripcion_corta: string | null;
  descripcion_larga: string | null;
  tipo_producto: TipoProducto;
  atributos: AtributosProducto;
  advertencias: string | null;
  // Columnas legacy (productos cargados antes de la migración 002)
  tipo_extracto: string | null;
  concentracion_mg_ml: number | null;
  volumen_ml: number | null;
  ratio_cbd_thc: string | null;
  precio: number | null;
  stock: number;
  sku: string | null;
  requiere_receta: boolean;
  disponible: boolean;
  cuenta_para_envio_flores: boolean;
  imagen_url: string | null;
  categorias?: Categoria | null;
  patologias?: Patologia[];
  producto_imagenes?: ProductoImagen[];
  precios_cantidad?: PrecioCantidad[];
}
