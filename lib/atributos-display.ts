import {
  Producto,
  AtributosExtractoAceite,
  AtributosMateriaVegetal,
  AtributosCremaTopico,
  AtributosComestible,
} from "@/types/catalogo";

export interface AtributoDisplay {
  label: string;
  valor: string;
}

export function obtenerAtributosDisplay(producto: Producto): AtributoDisplay[] {
  const a = producto.atributos || {};

  switch (producto.tipo_producto) {
    case "extracto_aceite": {
      const at = a as AtributosExtractoAceite;
      return [
        at.tipo_extracto && { label: "Tipo", valor: at.tipo_extracto },
        at.concentracion_mg_ml && {
          label: "Concentración",
          valor: `${at.concentracion_mg_ml} mg/ml`,
        },
        at.volumen_ml && { label: "Volumen", valor: `${at.volumen_ml} ml` },
        at.ratio_cbd_thc && { label: "Ratio CBD:THC", valor: at.ratio_cbd_thc },
      ].filter(Boolean) as AtributoDisplay[];
    }

    case "materia_vegetal": {
      const at = a as AtributosMateriaVegetal;
      return [
        at.genetica && { label: "Genética", valor: at.genetica },
        at.thc_porcentaje != null && {
          label: "THC",
          valor: `${at.thc_porcentaje}%`,
        },
        at.cbd_porcentaje != null && {
          label: "CBD",
          valor: `${at.cbd_porcentaje}%`,
        },
        at.metodo_cultivo && { label: "Cultivo", valor: at.metodo_cultivo },
        at.presentacion_gramos && {
          label: "Presentación",
          valor: `${at.presentacion_gramos} g`,
        },
      ].filter(Boolean) as AtributoDisplay[];
    }

    case "crema_topico": {
      const at = a as AtributosCremaTopico;
      return [
        at.ingredientes_activos?.length && {
          label: "Ingredientes activos",
          valor: at.ingredientes_activos.join(", "),
        },
        at.concentracion_cbd_mg && {
          label: "Concentración CBD",
          valor: `${at.concentracion_cbd_mg} mg`,
        },
        at.volumen_ml && { label: "Volumen", valor: `${at.volumen_ml} ml` },
        at.uso_recomendado && { label: "Uso recomendado", valor: at.uso_recomendado },
      ].filter(Boolean) as AtributoDisplay[];
    }

    case "comestible": {
      const at = a as AtributosComestible;
      return [
        at.mg_por_unidad && {
          label: "Mg por unidad",
          valor: `${at.mg_por_unidad} mg`,
        },
        at.unidades_por_envase && {
          label: "Unidades por envase",
          valor: `${at.unidades_por_envase}`,
        },
        at.sabor && { label: "Sabor", valor: at.sabor },
        at.ingredientes?.length && {
          label: "Ingredientes",
          valor: at.ingredientes.join(", "),
        },
        at.alergenos?.length && {
          label: "Alérgenos",
          valor: at.alergenos.join(", "),
        },
      ].filter(Boolean) as AtributoDisplay[];
    }

    default:
      return [];
  }
}
