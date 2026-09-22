import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface ItemEmail {
  nombre_producto: string;
  cantidad: number;
  subtotal: number;
}

function filasItemsHtml(items: ItemEmail[]) {
  return items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;">${i.nombre_producto} × ${i.cantidad}</td>
        <td style="padding:8px 0; text-align:right;">$${i.subtotal.toLocaleString(
          "es-AR"
        )}</td>
      </tr>`
    )
    .join("");
}

function zonaEnvioLabel(zonaEnvio: string) {
  return zonaEnvio === "retiro_en_persona" ? "Retiro en persona" : zonaEnvio;
}

// =========================================================
// Email de confirmación para el CLIENTE
// =========================================================
interface DatosEmailCliente {
  email: string;
  nombreCliente: string;
  pedidoId: string;
  items: ItemEmail[];
  subtotalProductos: number;
  envioCosto: number;
  total: number;
  zonaEnvio: string;
}

/**
 * Envía un email de confirmación de pedido al cliente.
 * Requiere RESEND_API_KEY en las variables de entorno.
 * Opcional: EMAIL_FROM (si no está, usa la dirección de pruebas de Resend).
 * Si falla, solo loguea el error (nunca debe romper la creación del pedido).
 */
export async function enviarEmailConfirmacion(datos: DatosEmailCliente) {
  if (!resend) {
    console.warn("Email no configurado: falta RESEND_API_KEY");
    return;
  }

  const zonaLabel = zonaEnvioLabel(datos.zonaEnvio);

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <h2>¡Gracias por tu pedido, ${datos.nombreCliente.split(" ")[0]}!</h2>
      <p style="color:#555;">Recibimos tu pedido <strong>#${datos.pedidoId.slice(
        0,
        8
      )}</strong>. En breve nos contactamos para coordinar la entrega.</p>
      <table style="width:100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        ${filasItemsHtml(datos.items)}
        <tr>
          <td style="padding:8px 0; color:#666; border-top:1px solid #eee;">Envío (${zonaLabel})</td>
          <td style="padding:8px 0; text-align:right; color:#666; border-top:1px solid #eee;">
            ${
              datos.envioCosto === 0
                ? "Gratis 🎊"
                : `$${datos.envioCosto.toLocaleString("es-AR")}`
            }
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0; font-weight:bold;">Total</td>
          <td style="padding:8px 0; text-align:right; font-weight:bold;">$${datos.total.toLocaleString(
            "es-AR"
          )}</td>
        </tr>
      </table>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: `Altamente <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`,
      to: datos.email,
      subject: `Pedido confirmado #${datos.pedidoId.slice(0, 8)}`,
      html,
    });

    if (error) {
      console.error("Resend devolvió un error (email cliente):", error);
    }
  } catch (err) {
    console.error("Error enviando email de confirmación:", err);
  }
}

// =========================================================
// Email de notificación para el ADMIN (vos)
// =========================================================
interface DatosEmailAdmin {
  pedidoId: string;
  nombreCliente: string;
  telefono: string;
  email?: string | null;
  direccion?: string | null;
  zonaEnvio: string;
  items: ItemEmail[];
  subtotalProductos: number;
  envioCosto: number;
  total: number;
}

/**
 * Envía un email de notificación al administrador (vos) cuando entra
 * un pedido nuevo. Requiere ADMIN_EMAIL además de RESEND_API_KEY.
 */
export async function enviarEmailNotificacionAdmin(datos: DatosEmailAdmin) {
  if (!resend) {
    console.warn("Email no configurado: falta RESEND_API_KEY");
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("Falta ADMIN_EMAIL: no se pudo notificar el pedido nuevo por email");
    return;
  }

  const zonaLabel = zonaEnvioLabel(datos.zonaEnvio);

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <h2>🛒 Nuevo pedido #${datos.pedidoId.slice(0, 8)}</h2>
      <p style="margin:4px 0;"><strong>${datos.nombreCliente}</strong></p>
      <p style="margin:4px 0; color:#555;">
        📞 ${datos.telefono}${datos.email ? ` &nbsp;·&nbsp; ✉️ ${datos.email}` : ""}
      </p>
      ${datos.direccion ? `<p style="margin:4px 0; color:#555;">📍 ${datos.direccion}</p>` : ""}
      <p style="margin:4px 0; color:#555;">🚚 Envío: ${zonaLabel}</p>
      <table style="width:100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        ${filasItemsHtml(datos.items)}
        <tr>
          <td style="padding:8px 0; color:#666; border-top:1px solid #eee;">Envío</td>
          <td style="padding:8px 0; text-align:right; color:#666; border-top:1px solid #eee;">
            ${
              datos.envioCosto === 0
                ? "Gratis 🎊"
                : `$${datos.envioCosto.toLocaleString("es-AR")}`
            }
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0; font-weight:bold;">Total</td>
          <td style="padding:8px 0; text-align:right; font-weight:bold;">$${datos.total.toLocaleString(
            "es-AR"
          )}</td>
        </tr>
      </table>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: `Altamente <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`,
      to: adminEmail,
      subject: `🛒 Nuevo pedido #${datos.pedidoId.slice(0, 8)} — ${datos.nombreCliente}`,
      html,
    });

    if (error) {
      console.error("Resend devolvió un error (email admin):", error);
    }
  } catch (err) {
    console.error("Error enviando email de notificación al admin:", err);
  }
}