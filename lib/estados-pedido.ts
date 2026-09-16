export const ESTADOS_PEDIDO = [
  "pendiente",
  "confirmado",
  "en_preparacion",
  "enviado",
  "entregado",
  "cancelado",
] as const;

export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];