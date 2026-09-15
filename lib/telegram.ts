interface ItemNotificacion {
  nombre_producto: string;
  cantidad: number;
  subtotal: number;
}

interface DatosNotificacion {
  pedidoId: string;
  nombreCliente: string;
  telefono: string;
  email?: string | null;
  direccion?: string | null;
  zonaEnvio: string;
  items: ItemNotificacion[];
  subtotalProductos: number;
  envioCosto: number;
  total: number;
}

/**
 * Envía un mensaje a Telegram avisando que entró un pedido nuevo.
 * Requiere TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID en las variables de entorno.
 * Si fallan, solo loguea el error (nunca debe romper la creación del pedido).
 */
export async function enviarNotificacionTelegram(datos: DatosNotificacion) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "Telegram no configurado: faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID"
    );
    return;
  }

  const lineasItems = datos.items
    .map(
      (i) =>
        `• ${i.nombre_producto} × ${i.cantidad} — $${i.subtotal.toLocaleString(
          "es-AR"
        )}`
    )
    .join("\n");

  const zonaLabel =
    datos.zonaEnvio === "retiro_en_persona" ? "Retiro en persona" : datos.zonaEnvio;

  const mensaje = [
    `🛒 *Nuevo pedido #${datos.pedidoId.slice(0, 8)}*`,
    "",
    `👤 ${datos.nombreCliente}`,
    `📞 ${datos.telefono}`,
    datos.email ? `✉️ ${datos.email}` : null,
    datos.direccion ? `📍 ${datos.direccion}` : null,
    `🚚 Envío: ${zonaLabel}`,
    "",
    lineasItems,
    "",
    `Subtotal: $${datos.subtotalProductos.toLocaleString("es-AR")}`,
    `Envío: ${
      datos.envioCosto === 0 ? "Gratis 🎊" : `$${datos.envioCosto.toLocaleString("es-AR")}`
    }`,
    `*Total: $${datos.total.toLocaleString("es-AR")}*`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: mensaje,
        parse_mode: "Markdown",
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Error enviando notificación a Telegram:", errorBody);
    }
  } catch (err) {
    console.error("Error de red enviando notificación a Telegram:", err);
  }
}