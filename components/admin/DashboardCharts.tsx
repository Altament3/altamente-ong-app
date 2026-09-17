"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface Props {
  ventasPorDia: { fecha: string; total: number }[];
  productosMasVendidos: { nombre: string; cantidad: number; ingresos: number }[];
  ventasPorDiaSemana: { dia: string; total: number; cantidadPedidos: number }[];
}

export default function DashboardCharts({
  ventasPorDia,
  productosMasVendidos,
  ventasPorDiaSemana,
}: Props) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-3">
          Ventas por día
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ventasPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: any) => `$${Number(value ?? 0).toLocaleString("es-AR")}`}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-3">
          Productos más vendidos
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={productosMasVendidos}
              layout="vertical"
              margin={{ left: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="nombre"
                tick={{ fontSize: 11 }}
                width={140}
              />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#059669" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-3">
          Ventas por día de la semana
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ventasPorDiaSemana}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: any) => `$${Number(value ?? 0).toLocaleString("es-AR")}`}
              />
              <Bar dataKey="total" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}