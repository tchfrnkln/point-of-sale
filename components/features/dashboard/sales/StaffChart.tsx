"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function StaffSalesPieChart({
  data
}: {
  data: { staffName: string; totalSales: number }[];
}) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="totalSales"
            nameKey="staffName"
            outerRadius={90}
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
