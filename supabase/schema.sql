-- =========================================================
-- SCHEMA: Catálogo de productos (Fase 1)
-- ONG de bienestar natural — extractos y aceites de cannabis
-- =========================================================

-- Extensión para UUIDs
create extension if not exists "uuid-ossp";

-- -------------------------
-- Categorías (ej: "Aceite CBD", "Extracto full spectrum", "Skincare")
-- -------------------------
create table categorias (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  slug text not null unique,
  descripcion text,
  orden int default 0,
  activa boolean default true,
  created_at timestamptz default now()
);

-- -------------------------
-- Patologías (para poder filtrar productos por condición)
-- -------------------------
create table patologias (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null unique, -- Cáncer, Parkinson, Epilepsia, Fibromialgia, Alzheimer, Depresión, Enf. de Horton, Dermatitis atópica, etc.
  descripcion text,
  created_at timestamptz default now()
);

-- -------------------------
-- Productos
-- -------------------------
create table productos (
  id uuid primary key default uuid_generate_v4(),
  categoria_id uuid references categorias(id) on delete set null,
  nombre text not null,
  slug text not null unique,
  descripcion_corta text,
  descripcion_larga text,

  -- Datos técnicos específicos de extractos/aceites
  tipo_extracto text, -- 'CBD', 'THC', 'Full Spectrum', 'Broad Spectrum', etc.
  concentracion_mg_ml numeric, -- concentración en mg/ml
  volumen_ml numeric, -- volumen del envase
  ratio_cbd_thc text, -- ej: '20:1'

  -- Comercial
  precio numeric(10,2),
  stock int default 0,
  sku text unique,
  requiere_receta boolean default false, -- por si algún producto necesita prescripción
  disponible boolean default true,

  -- Media
  imagen_url text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -------------------------
-- Relación N:N producto <-> patologías recomendadas
-- -------------------------
create table producto_patologias (
  producto_id uuid references productos(id) on delete cascade,
  patologia_id uuid references patologias(id) on delete cascade,
  primary key (producto_id, patologia_id)
);

-- -------------------------
-- Imágenes adicionales por producto (galería)
-- -------------------------
create table producto_imagenes (
  id uuid primary key default uuid_generate_v4(),
  producto_id uuid references productos(id) on delete cascade,
  url text not null,
  orden int default 0
);

-- -------------------------
-- Índices útiles para el catálogo
-- -------------------------
create index idx_productos_categoria on productos(categoria_id);
create index idx_productos_disponible on productos(disponible);
create index idx_producto_patologias_patologia on producto_patologias(patologia_id);

-- -------------------------
-- RLS (Row Level Security) — lectura pública del catálogo,
-- escritura solo autenticada (para el futuro panel admin)
-- -------------------------
alter table categorias enable row level security;
alter table patologias enable row level security;
alter table productos enable row level security;
alter table producto_patologias enable row level security;
alter table producto_imagenes enable row level security;

create policy "Lectura pública categorías" on categorias for select using (true);
create policy "Lectura pública patologías" on patologias for select using (true);
create policy "Lectura pública productos disponibles" on productos for select using (disponible = true);
create policy "Lectura pública producto_patologias" on producto_patologias for select using (true);
create policy "Lectura pública producto_imagenes" on producto_imagenes for select using (true);

-- Escritura solo para usuarios autenticados (ajustaremos con roles en la fase de panel admin)
create policy "Escritura autenticada productos" on productos for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
