import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { calcularPrecioUnitario } from "@/lib/precios";
import { calcularCostoEnvio, ZonaEnvio } from "@/lib/envio";

interface ItemRecibido {
  producto_id: string;
  cantidad: number;
}

interface ClienteRecibido {
  nombre: string;
  telefono: string;
  email?: string;
  direccion?: string;
  notas?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cliente = body.cliente as ClienteRecibido;
    const items = body.items as ItemRecibido[];
    const zonaEnvio = body.zona_envio as ZonaEnvio;

    if (!["CABA", "GBA", "retiro_en_persona"].includes(zonaEnvio)) {
      return NextResponse.json(
        { error: "Zona de envío inválida" },
        { status: 400 }
      );
    }
    if (!cliente?.nombre?.trim() || !cliente?.telefono?.trim()) {
      return NextResponse.json(
        { error: "Faltan datos del cliente (nombre y teléfono son obligatorios)" },
        { status: 400 }
      );
    }
    if (zonaEnvio !== "retiro_en_persona" && !cliente?.direccion?.trim()) {
      return NextResponse.json(
        { error: "La dirección es obligatoria para envíos a domicilio" },
        { status: 400 }
      );
    }
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    // Traemos los productos reales + escalones de precio desde la base.
    // NUNCA se usa el precio que venga del navegador.
    const productoIds = items.map((i) => i.producto_id);
    const { data: productos, error: errProductos } = await supabaseAdmin
      .from("productos")
      .select(
        "id, nombre, precio, stock, disponible, tipo_producto, atributos, cuenta_para_envio_flores, categorias ( slug ), precios_cantidad ( cantidad_minima, precio_unitario )"
      )
      .in("id", productoIds);

    if (errProductos || !productos) {
      console.error("Error consultando productos:", errProductos);
      return NextResponse.json(
        { error: "Error consultando productos" },
        { status: 500 }
      );
    }

    let total = 0;
    const itemsParaInsertar: {
      producto_id: string;
      nombre_producto: string;
      cantidad: number;
      precio_unitario: number;
      subtotal: number;
    }[] = [];

    for (const item of items) {
      const producto = productos.find((p) => p.id === item.producto_id);

      if (!producto || !producto.disponible) {
        return NextResponse.json(
          { error: `Un producto de tu pedido ya no está disponible` },
          { status: 400 }
        );
      }
      if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) {
        return NextResponse.json(
          { error: "Cantidad inválida en el pedido" },
          { status: 400 }
        );
      }
      if (producto.stock < item.cantidad) {
        return NextResponse.json(
          { error: `No hay stock suficiente de "${producto.nombre}"` },
          { status: 400 }
        );
      }

      const precioUnitario = calcularPrecioUnitario(
        Number(producto.precio ?? 0),
        item.cantidad,
        (producto.precios_cantidad as any[]) ?? []
      );
      const subtotal = precioUnitario * item.cantidad;
      total += subtotal;

      itemsParaInsertar.push({
        producto_id: producto.id,
        nombre_producto: producto.nombre,
        cantidad: item.cantidad,
        precio_unitario: precioUnitario,
        subtotal,
      });
    }

    // Calculamos el envío en el servidor, en base a los gramos reales
    // de flor de cada producto (nunca confiando en un costo que mande el cliente)
    const itemsParaEnvio = items.map((item) => {
      const producto = productos.find((p) => p.id === item.producto_id)!;
      const gramosPorUnidad =
        producto.tipo_producto === "materia_vegetal"
          ? Number((producto.atributos as any)?.presentacion_gramos ?? 0)
          : 0;
      return {
        gramos: gramosPorUnidad * item.cantidad,
        categoriaSlug: (producto.categorias as any)?.slug ?? null,
        cuenta_para_envio_flores: producto.cuenta_para_envio_flores,
      };
    });

    const envioCosto = calcularCostoEnvio(itemsParaEnvio, zonaEnvio);
    const totalPedido = total + envioCosto;

    // Crear el pedido
    const { data: pedido, error: errPedido } = await supabaseAdmin
      .from("pedidos")
      .insert({
        nombre_cliente: cliente.nombre.trim(),
        telefono: cliente.telefono.trim(),
        email: cliente.email?.trim() || null,
        direccion: cliente.direccion?.trim() || null,
        notas: cliente.notas?.trim() || null,
        zona_envio: zonaEnvio,
        subtotal_productos: total,
        envio_costo: envioCosto,
        total: totalPedido,
      })
      .select()
      .single();

    if (errPedido || !pedido) {
      console.error("Error creando pedido:", errPedido);
      return NextResponse.json(
        { error: "No se pudo crear el pedido" },
        { status: 500 }
      );
    }

    // Guardar los items del pedido
    const { error: errItems } = await supabaseAdmin.from("pedido_items").insert(
      itemsParaInsertar.map((i) => ({ ...i, pedido_id: pedido.id }))
    );

    if (errItems) {
      console.error("Error guardando items del pedido:", errItems);
      return NextResponse.json(
        { error: "No se pudieron guardar los productos del pedido" },
        { status: 500 }
      );
    }

    // Descontar stock (best-effort; para alto volumen conviene mover esto
    // a una función RPC en Postgres para que sea atómico)
    for (const item of items) {
      const producto = productos.find((p) => p.id === item.producto_id)!;
      await supabaseAdmin
        .from("productos")
        .update({ stock: producto.stock - item.cantidad })
        .eq("id", producto.id);
    }

    return NextResponse.json({ pedido_id: pedido.id, total: totalPedido });
  } catch (err) {
    console.error("Error creando pedido:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
