-- =========================================================
-- MIGRACIÓN 006: Acceso del panel admin a pedidos
-- =========================================================
-- Hasta ahora pedidos/pedido_items no tenían ninguna policy pública
-- (a propósito, ver migración 003). El panel admin necesita que un
-- usuario autenticado (vos, con tu login de Supabase Auth) pueda
-- LEER y ACTUALIZAR pedidos (por ejemplo, cambiar el estado).

create policy "Lectura autenticada pedidos" on pedidos
  for select using (auth.role() = 'authenticated');

create policy "Actualizacion autenticada pedidos" on pedidos
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Lectura autenticada pedido_items" on pedido_items
  for select using (auth.role() = 'authenticated');
