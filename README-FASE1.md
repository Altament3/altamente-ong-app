# Fase 1 — Catálogo

## 1. Crear el proyecto Next.js (si aún no existe)
```bash
npx create-next-app@latest nachi-app --typescript --tailwind --app
cd nachi-app
npm install @supabase/supabase-js
```

## 2. Copiar estos archivos a tu proyecto
- `supabase/schema.sql` → correr en el SQL Editor de tu proyecto Supabase
- `supabase/002_ampliar_catalogo.sql` → correr después del anterior (agrega
  soporte para materia vegetal, cremas/tópicos y comestibles, además de
  extractos/aceites)
- `lib/supabase.ts`
- `lib/productos.ts`
- `lib/atributos-display.ts`
- `types/catalogo.ts`
- `components/ProductCard.tsx`
- `app/catalogo/page.tsx`
- `app/catalogo/[slug]/page.tsx`

## 3. Configurar variables de entorno
Copiá `.env.local.example` como `.env.local` y completá con los datos de tu
proyecto Supabase (Settings → API → Project URL / anon public key).

## 4. Habilitar imágenes externas (si usás URLs de Supabase Storage)
En `next.config.js`:
```js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "TU-PROYECTO.supabase.co" },
    ],
  },
};
```

## 5. Cargar datos de prueba
En el SQL Editor de Supabase, después de correr `schema.sql` y
`002_ampliar_catalogo.sql`:
```sql
insert into categorias (nombre, slug) values ('Aceites CBD', 'aceites-cbd')
on conflict (slug) do nothing;

insert into patologias (nombre) values
  ('Fibromialgia'), ('Epilepsia'), ('Parkinson'), ('Dermatitis atópica')
on conflict (nombre) do nothing;

-- Extracto / Aceite
insert into productos (categoria_id, nombre, slug, descripcion_corta, tipo_producto, atributos, precio, stock, disponible)
values (
  (select id from categorias where slug = 'aceites-cbd'),
  'Aceite CBD 5%', 'aceite-cbd-5', 'Aceite full spectrum, extracción en frío.',
  'extracto_aceite',
  '{"tipo_extracto": "Full Spectrum", "concentracion_mg_ml": 500, "volumen_ml": 10, "ratio_cbd_thc": "20:1"}',
  12000, 20, true
);

-- Materia vegetal
insert into productos (categoria_id, nombre, slug, descripcion_corta, tipo_producto, atributos, precio, stock, disponible)
values (
  (select id from categorias where slug = 'materia-vegetal'),
  'Flor CBD Charlotte''s Web', 'flor-charlottes-web', 'Cultivo indoor orgánico, bajo THC.',
  'materia_vegetal',
  '{"genetica": "Charlotte''s Web", "thc_porcentaje": 0.3, "cbd_porcentaje": 18, "metodo_cultivo": "Indoor orgánico", "presentacion_gramos": 5}',
  8000, 15, true
);

-- Crema / Tópico
insert into productos (categoria_id, nombre, slug, descripcion_corta, tipo_producto, atributos, precio, stock, disponible)
values (
  (select id from categorias where slug = 'cremas-topicos'),
  'Crema CBD + Árnica', 'crema-cbd-arnica', 'Para dolor localizado y articulaciones.',
  'crema_topico',
  '{"ingredientes_activos": ["CBD", "Árnica"], "concentracion_cbd_mg": 250, "volumen_ml": 50, "uso_recomendado": "Aplicar 2 veces al día en la zona afectada"}',
  9500, 30, true
);

-- Comestible
insert into productos (categoria_id, nombre, slug, descripcion_corta, tipo_producto, atributos, advertencias, precio, stock, disponible)
values (
  (select id from categorias where slug = 'comestibles'),
  'Gomitas CBD Limón', 'gomitas-cbd-limon', 'Gomitas de CBD sabor limón, 10mg c/u.',
  'comestible',
  '{"mg_por_unidad": 10, "unidades_por_envase": 20, "sabor": "Limón", "ingredientes": ["Aceite de coco", "CBD", "Miel"], "alergenos": ["Miel"]}',
  'Contiene miel. Mantener fuera del alcance de niños.',
  11000, 25, true
);
```

## 6. Correr en local
```bash
npm run dev
```
Visitá `http://localhost:3000/catalogo`.

## 7. Deploy
```bash
git add .
git commit -m "Fase 1: catálogo"
git push
```
Y conectá el repo en Vercel (o hacé `vercel` desde la CLI si ya está linkeado).

---

## ¿Qué sigue? (Fase 2 — Pedidos)
- Tabla `pedidos` y `pedido_items` en Supabase
- Carrito (estado en cliente, Zustand o Context)
- Checkout con datos de contacto/envío
- El botón "Agregar al pedido" que dejamos deshabilitado se conecta acá
