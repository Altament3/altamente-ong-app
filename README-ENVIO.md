# Envío CABA/GBA por gramos de flor

## 1. Correr la migración
```
supabase/004_envio.sql
supabase/005_categorias_flor.sql
```
Esto agrega:
- `productos.cuenta_para_envio_flores` (marca qué productos participan de la promo)
- `pedidos.zona_envio`, `pedidos.subtotal_productos`, `pedidos.envio_costo`

Por defecto, la migración marca `cuenta_para_envio_flores = true` para **todo**
lo que sea `tipo_producto = 'materia_vegetal'`. Si tenés hongos adaptógenos
cargados como materia vegetal, corré después:
```sql
update productos
set cuenta_para_envio_flores = false
where slug in ('slug-del-hongo-1', 'slug-del-hongo-2');
```

## 2. Clasificar cada flor por categoría
Premium, Premium VIP, Semipremium y Low Cost son **categorías** (tabla
`categorias`, migración `005_categorias_flor.sql`), no un atributo suelto.
Para clasificar un producto:
```sql
update productos
set categoria_id = (select id from categorias where slug = 'premium')
where slug = 'flor-charlottes-web';
```
Los slugs disponibles son: `premium`, `premium-vip`, `semipremium`, `low-cost`.

También necesitás `presentacion_gramos` cargado dentro de `atributos`
(gramos por unidad/paquete que se vende), porque el cálculo de envío
multiplica `presentacion_gramos × cantidad` para saber cuántos gramos
lleva el pedido:
```sql
update productos
set atributos = atributos || '{"presentacion_gramos": 5}'::jsonb
where slug = 'flor-charlottes-web';
```

## 3. Reglas implementadas (`lib/envio.ts`)
| Condición | CABA | GBA |
|---|---|---|
| Base (sin flor o menos de 5g) | $8.000 | $13.000 |
| 5g+ de flor (cualquier categoría, sumado) | $6.000 | $11.000 (-$2.000) |
| 10g+ Premium/Premium VIP, o 15g+ Semipremium, o 20g+ Low Cost (en una misma categoría) | Gratis | $5.000 (-$8.000) |
| Retiro en persona | — | $0 |

Solo cuentan los productos con `cuenta_para_envio_flores = true`.

**Importante sobre mezclas de categoría:** si el pedido tiene, por ejemplo,
7g Premium + 8g Low Cost, ninguna categoría llega a su propio umbral (10g y
20g respectivamente) — pero el total (15g) sí supera el umbral de 5g, así
que se aplica el descuento intermedio ($6.000 CABA / $11.000 GBA), no el
máximo. Si esto no es lo que buscás, avisame y ajusto `calcularCostoEnvio`
en `lib/envio.ts`.

## 4. Dónde se usa
- `app/carrito/page.tsx`: selector de zona + envío calculado en vivo (solo informativo).
- `app/checkout/page.tsx`: mismo cálculo, más el formulario de contacto.
- `app/api/pedidos/route.ts`: **recalcula todo desde cero** con los datos
  reales de la base — el costo de envío que ve el cliente en pantalla es
  solo para mostrar, el que se guarda es el que calcula el servidor.

## 5. Nota sobre el precio variable de GBA
Como el envío a GBA puede variar según la dirección exacta, dejé el
checkout con un aviso de que el valor final se confirma por WhatsApp. El
monto que se guarda en el pedido es el "piso" calculado por estas reglas;
si necesitás ajustar el precio real después de coordinar, lo vas a poder
hacer manualmente en la base de datos (o desde el panel admin en la Fase 4).
