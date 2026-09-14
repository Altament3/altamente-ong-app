-- =========================================================
-- MIGRACIÓN 004: Lógica de envío CABA/GBA por gramos de flor
-- =========================================================

-- Flag explícito: ¿este producto cuenta para la promo de envío por gramos?
-- (permite excluir hongos adaptógenos aunque estén cargados como materia_vegetal)
alter table productos
  add column if not exists cuenta_para_envio_flores boolean not null default false;

-- Por defecto, activamos el flag para todo lo que ya está cargado como materia_vegetal.
-- Después, desde el panel admin (Fase 4) o a mano, desmarcás los productos que sean
-- hongos adaptógenos u otros que no correspondan a la promo.
update productos
  set cuenta_para_envio_flores = true
  where tipo_producto = 'materia_vegetal';

-- Campos de envío en el pedido
alter table pedidos
  add column if not exists zona_envio text
    check (zona_envio in ('CABA', 'GBA', 'retiro_en_persona'));
alter table pedidos
  add column if not exists subtotal_productos numeric(10,2) not null default 0;
alter table pedidos
  add column if not exists envio_costo numeric(10,2) not null default 0;

-- =========================================================
-- Nota sobre "calidad" en materia_vegetal:
-- No requiere columna nueva, va dentro de `atributos` (jsonb), por ejemplo:
--   { "genetica": "...", "calidad": "premium", "presentacion_gramos": 5, ... }
-- Valores válidos de "calidad": premium | premium_vip | semipremium | low_cost
-- =========================================================
