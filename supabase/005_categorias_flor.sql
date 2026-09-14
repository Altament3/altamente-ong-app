-- =========================================================
-- MIGRACIÓN 005: Premium / Premium VIP / Semipremium / Low Cost
-- son categorías, no un atributo dentro de materia_vegetal
-- =========================================================

insert into categorias (nombre, slug) values
  ('Premium', 'premium'),
  ('Premium VIP', 'premium-vip'),
  ('Semipremium', 'semipremium'),
  ('Low Cost', 'low-cost')
on conflict (slug) do nothing;

-- Nota: la categoría "Materia vegetal" (de la migración 002) queda como
-- una categoría genérica de referencia, pero para tus flores lo esperable
-- es que cada producto tenga categoria_id apuntando a Premium, Premium VIP,
-- Semipremium o Low Cost (el tipo general sigue siendo tipo_producto =
-- 'materia_vegetal', y ESO ya lo distingue de aceites/cremas/comestibles).
--
-- Ejemplo para reclasificar un producto ya cargado:
-- update productos set categoria_id = (select id from categorias where slug = 'premium')
-- where slug = 'flor-charlottes-web';
