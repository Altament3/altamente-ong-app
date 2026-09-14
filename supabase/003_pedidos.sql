-- =========================================================
-- MIGRACIÓN 003: Precios por cantidad + Pedidos (Fase 2)
-- =========================================================

-- -------------------------
-- Precios escalonados por cantidad
-- Ej: producto X -> 1-4u: $1000 c/u, 5-9u: $900 c/u, 10+: $800 c/u
-- Se guarda solo el "piso" de cada escalón (cantidad_minima)
-- -------------------------
create table precios_cantidad (
  id uuid primary key default uuid_generate_v4(),
  producto_id uuid not null references productos(id) on delete cascade,
  cantidad_minima int not null check (cantidad_minima > 0),
  precio_unitario numeric(10,2) not null check (precio_unitario >= 0),
  unique (producto_id, cantidad_minima)
);

create index idx_precios_cantidad_producto on precios_cantidad(producto_id);

alter table precios_cantidad enable row level security;
create policy "Lectura pública precios por cantidad" on precios_cantidad
  for select using (true);
create policy "Escritura autenticada precios por cantidad" on precios_cantidad
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- -------------------------
-- Pedidos
-- -------------------------
create table pedidos (
  id uuid primary key default uuid_generate_v4(),
  nombre_cliente text not null,
  telefono text not null,
  email text,
  direccion text,
  notas text,
  estado text not null default 'pendiente'
    check (estado in ('pendiente','confirmado','en_preparacion','enviado','entregado','cancelado')),
  total numeric(10,2) not null default 0,
  created_at timestamptz default now()
);

-- -------------------------
-- Items de cada pedido (snapshot: precio y nombre al momento de comprar)
-- -------------------------
create table pedido_items (
  id uuid primary key default uuid_generate_v4(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  producto_id uuid references productos(id) on delete set null,
  nombre_producto text not null,
  cantidad int not null check (cantidad > 0),
  precio_unitario numeric(10,2) not null,
  subtotal numeric(10,2) not null
);

create index idx_pedido_items_pedido on pedido_items(pedido_id);

-- -------------------------
-- RLS: pedidos y pedido_items NO tienen policies públicas.
-- Solo se crean/leen desde el servidor con la Service Role Key
-- (ver lib/supabase-admin.ts), nunca directo desde el navegador.
-- Esto evita que alguien inserte pedidos falsos o lea pedidos ajenos
-- directamente contra la API de Supabase.
-- -------------------------
alter table pedidos enable row level security;
alter table pedido_items enable row level security;
-- (sin policies = deny by default para el cliente anónimo/autenticado normal)
