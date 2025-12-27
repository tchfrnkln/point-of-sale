"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function WeeklySalesLineChart({
  data
}: {
  data: { date: string; totalAmount: number }[];
}) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="totalAmount" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
