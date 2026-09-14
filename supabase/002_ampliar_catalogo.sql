-- =========================================================
-- MIGRACIÓN 002: Ampliar catálogo a 4 tipos de producto
-- (Extractos/Aceites, Materia vegetal, Cremas/Tópicos, Comestibles)
-- =========================================================

-- 1. Tipo de producto (define qué "familia" de atributos aplica)
alter table productos
  add column if not exists tipo_producto text not null default 'extracto_aceite'
  check (tipo_producto in ('extracto_aceite', 'materia_vegetal', 'crema_topico', 'comestible'));

-- 2. Campo flexible para atributos específicos de cada tipo (ver guía abajo)
alter table productos
  add column if not exists atributos jsonb not null default '{}'::jsonb;

-- 3. Comestibles suelen necesitar advertencias/alérgenos visibles
alter table productos
  add column if not exists advertencias text;

-- Índice para poder filtrar rápido por tipo de producto
create index if not exists idx_productos_tipo on productos(tipo_producto);

-- Índice GIN por si más adelante querés filtrar/buscar dentro del JSONB
create index if not exists idx_productos_atributos on productos using gin (atributos);

-- =========================================================
-- GUÍA DE ATRIBUTOS POR TIPO (conviven en la columna `atributos`)
-- =========================================================
-- extracto_aceite:
--   { "tipo_extracto": "Full Spectrum", "concentracion_mg_ml": 500,
--     "volumen_ml": 10, "ratio_cbd_thc": "20:1" }
--
-- materia_vegetal:
--   { "genetica": "Charlotte's Web", "thc_porcentaje": 0.3, "cbd_porcentaje": 18,
--     "metodo_cultivo": "Indoor orgánico", "presentacion_gramos": 5 }
--
-- crema_topico:
--   { "ingredientes_activos": ["CBD", "Árnica"], "concentracion_cbd_mg": 250,
--     "volumen_ml": 50, "uso_recomendado": "Aplicar 2 veces al día en la zona afectada" }
--
-- comestible:
--   { "mg_por_unidad": 10, "unidades_por_envase": 20, "sabor": "Limón",
--     "ingredientes": ["Aceite de coco", "CBD", "Miel"], "alergenos": ["Miel"] }
--
-- Nota: las columnas viejas (tipo_extracto, concentracion_mg_ml, volumen_ml,
-- ratio_cbd_thc) se mantienen por compatibilidad con productos ya cargados.
-- Para productos nuevos, se recomienda usar `atributos` directamente
-- (incluso para extracto_aceite), así todo el catálogo queda consistente.

-- =========================================================
-- Categorías sugeridas para los nuevos tipos
-- =========================================================
insert into categorias (nombre, slug) values
  ('Materia vegetal', 'materia-vegetal'),
  ('Cremas y tópicos', 'cremas-topicos'),
  ('Comestibles', 'comestibles')
on conflict (slug) do nothing;
