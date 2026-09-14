# Fase 2 — Pedidos (carrito, precios por cantidad, checkout)

## 1. Correr la migración en Supabase
En el SQL Editor, después de `schema.sql` y `002_ampliar_catalogo.sql`:
```
supabase/003_pedidos.sql
```
Esto crea `precios_cantidad`, `pedidos` y `pedido_items`.

## 2. Copiar los archivos nuevos a tu proyecto
- `lib/precios.ts`
- `lib/supabase-admin.ts`
- `lib/cart-context.tsx`
- `components/AddToCartButton.tsx` (reemplaza el botón deshabilitado de la Fase 1)
- `components/HeaderCarrito.tsx`
- `app/layout.tsx` (envuelve la app con `CartProvider`)
- `app/carrito/page.tsx`
- `app/checkout/page.tsx`
- `app/api/pedidos/route.ts`
- `app/pedido/[id]/page.tsx`
- `types/catalogo.ts` y `lib/productos.ts` (actualizados: ahora traen `precios_cantidad`)
- `app/catalogo/[slug]/page.tsx` (actualizado: usa `AddToCartButton`)

## 3. Conseguir la Service Role Key
En Supabase → Settings → API → **service_role** (no la `anon`).
Agregala en `.env.local` como `SUPABASE_SERVICE_ROLE_KEY` y también en
Vercel → Project Settings → Environment Variables (marcada como secreta).

**Por qué hace falta:** el precio final de cada pedido se calcula en el
servidor (API Route `/api/pedidos`), nunca confiando en lo que mande el
navegador. Para eso el servidor necesita leer/escribir `pedidos` y
`pedido_items` saltando las políticas RLS (que por diseño no permiten
acceso público a esas tablas).

## 4. Cargar precios por cantidad de ejemplo
```sql
-- Ejemplo: aceite CBD 5% con descuento por volumen
insert into precios_cantidad (producto_id, cantidad_minima, precio_unitario)
values
  ((select id from productos where slug = 'aceite-cbd-5'), 3, 11000),
  ((select id from productos where slug = 'aceite-cbd-5'), 6, 10000);
```
Con esto: 1-2 unidades al precio de lista, 3-5 a $11.000 c/u, 6+ a $10.000 c/u.
Si un producto no tiene filas en `precios_cantidad`, simplemente usa el
precio de lista sin importar la cantidad.

## 5. Cómo funciona el flujo
1. En `/catalogo/[slug]`, el cliente elige cantidad → ve el precio unitario
   y el subtotal recalculado en vivo (usando los escalones cargados).
2. "Agregar al pedido" guarda el ítem en el carrito (`localStorage`).
3. En `/carrito` puede ajustar cantidades o quitar productos; el total se
   recalcula siempre en el cliente para mostrarlo, pero es solo informativo.
4. En `/checkout` completa nombre, teléfono, email (opcional), dirección y
   notas, y confirma.
5. El navegador manda `{ cliente, items: [{producto_id, cantidad}] }` a
   `/api/pedidos`. **El servidor vuelve a calcular todos los precios desde
   la base de datos**, valida stock, crea el pedido + sus items, descuenta
   stock y devuelve el `pedido_id`.
6. El cliente es redirigido a `/pedido/[id]`, que muestra el resumen final,
   el total y sus datos de contacto.

## 6. Probar en local
```bash
npm run dev
```
Flujo completo: `/catalogo` → elegí un producto → agregalo → `/carrito` →
`/checkout` → confirmar → `/pedido/[id]`.

## 7. Deploy
```bash
git add .
git commit -m "Fase 2: carrito, precios por cantidad y checkout"
git push
```
Verificá que `SUPABASE_SERVICE_ROLE_KEY` esté configurada en Vercel antes
de probar en producción, o `/api/pedidos` va a fallar.

---

## ¿Qué sigue? (Fase 3 — Notificaciones)
- Email o WhatsApp automático al cliente y a la ONG cuando se confirma un pedido
- Cambios de estado del pedido (`pendiente` → `confirmado` → `enviado`, etc.)
- Posible integración con un bot de WhatsApp para avisos de seguimiento
