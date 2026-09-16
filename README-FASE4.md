# Fase 4 — Panel de administración

## 1. Correr la migración
```
supabase/006_admin_pedidos_rls.sql
```
Esto le da permiso a un usuario logueado (vos) para leer y actualizar
pedidos — antes esa tabla no tenía ninguna policy pública, a propósito.

## 2. Instalar la librería de autenticación
```bash
npm install @supabase/ssr
```

## 3. Crear tu usuario de administradora
El panel NO tiene pantalla de "registrarse" — a propósito, para que nadie
más pueda crear una cuenta de admin sola. Vos te creás el usuario a mano:

1. Andá a Supabase → **Authentication** → **Users**
2. Clic en **"Add user"** → **"Create new user"**
3. Poné tu email y una contraseña segura
4. Marcá **"Auto Confirm User"** (así no hace falta que confirmes por
   email para poder entrar)
5. Guardá

Con ese email y contraseña vas a entrar en `/admin/login`.

## 4. Archivos nuevos
- `lib/supabase-server.ts` — cliente de Supabase para Server
  Components/Actions, lee la sesión desde las cookies
- `lib/supabase-browser.ts` — cliente de Supabase para el navegador
  (usado en el login)
- `app/admin/page.tsx` — redirige a `/admin/productos`
- `app/admin/login/page.tsx` — pantalla de login
- `app/admin/(panel)/layout.tsx` — protege todo lo de adentro: si no
  hay sesión, redirige a `/admin/login`. Muestra el menú (Productos /
  Pedidos) y el botón de salir
- `app/admin/(panel)/productos/page.tsx` — listado de productos
- `app/admin/(panel)/productos/actions.ts` — crear/editar/eliminar
  (Server Actions)
- `app/admin/(panel)/productos/EliminarProductoButton.tsx`
- `app/admin/(panel)/productos/nuevo/page.tsx` — formulario alta
- `app/admin/(panel)/productos/[id]/page.tsx` — formulario edición
- `app/admin/(panel)/pedidos/page.tsx` — listado de pedidos con detalle
- `components/admin/LogoutButton.tsx`

**Importante sobre las carpetas con paréntesis:** `(panel)` es una
carpeta especial de Next.js (un "route group") — agrupa páginas sin
que su nombre aparezca en la URL. Por eso `/admin/productos` funciona
directo, aunque el archivo esté en `app/admin/(panel)/productos/page.tsx`.
Al crear la carpeta en VS Code, escribí el nombre completo con los
paréntesis: `(panel)`.

## 5. Cómo entrar
Con el servidor corriendo (`npm run dev`):
```
http://localhost:3000/admin/login
```
Iniciá sesión con el usuario que creaste en el paso 3. Deberías caer en
`/admin/productos`, ver el listado, poder crear uno nuevo, editarlo,
eliminarlo, y ver `/admin/pedidos` con todos los pedidos hechos hasta
ahora.

## 6. Qué NO cubre esta primera versión (por diseño, para no
complicarla de entrada)
- El formulario de "Nuevo producto" no carga los atributos técnicos
  específicos (concentración, THC/CBD, gramaje, calidad de flor, etc.)
  — esos por ahora se siguen cargando a mano en Supabase → tabla
  `productos` → columna `atributos` (igual que hicimos con las 14
  flores). Se puede sumar un formulario más completo en una vuelta
  futura si hace falta.
- No hay forma de cambiar el **estado** del pedido (pendiente →
  confirmado → enviado, etc.) desde el panel todavía — se puede hacer
  a mano en Supabase por ahora, o lo sumamos después como botón.
- Solo hay un usuario admin (vos). Si en el futuro necesitás dar acceso
  a alguien más del equipo, se crea otro usuario de la misma forma
  (paso 3) — no hace falta tocar código.

## 7. Deploy a Vercel
No hace falta ninguna variable de entorno nueva (usa las mismas de
Supabase que ya tenés cargadas). Simplemente:
```bash
git add .
git commit -m "Fase 4: panel de administracion"
git push
```
Y Vercel deployea solo. Probá `https://altamente-ong-app.vercel.app/admin/login`
con el mismo usuario que creaste en Supabase.
