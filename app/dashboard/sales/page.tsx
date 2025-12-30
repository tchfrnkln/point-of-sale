"use client";

import { useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useSalesAnalyticsStore } from "@/store/sales.store";
import DailySalesBarChart from "@/components/features/dashboard/sales/DailyChart";
import WeeklySalesLineChart from "@/components/features/dashboard/sales/WeeklyChart";
import StaffSalesPieChart from "@/components/features/dashboard/sales/StaffChart";
import { ExportPopover } from "@/components/features/dashboard/sales/Exports/PopOver";
import { handleExcelExport, handlePDFExport } from "@/lib/exports/handler";


export default function AdminSalesPage() {
    const store = useSalesAnalyticsStore();

    const seedMockData = useSalesAnalyticsStore(state => state.seedMockData);

    useEffect(() => {
        seedMockData();
    }, [seedMockData]);


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Sales Dashboard</h1>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p>Total Sales</p>
            <p className="text-2xl font-bold">₦{store.totalSales.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p>Transactions</p>
            <p className="text-2xl font-bold">{store.totalTransactions.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* TABS */}
      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <DailySalesBarChart data={store.daily} />
          <SalesTable data={store.daily} />
        </TabsContent>

        <TabsContent value="weekly">
          <WeeklySalesLineChart data={store.weekly} />
          <SalesTable data={store.weekly} />
        </TabsContent>

        <TabsContent value="monthly">
          <SalesTable data={store.monthly} />
        </TabsContent>
      </Tabs>

      <Separator />

      {/* TOP PRODUCTS */}
      <h2 className="font-semibold">Top Products</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Qty Sold</TableHead>
            <TableHead>Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {store.topProducts.map(p => (
            <TableRow key={p.productId}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.quantitySold}</TableCell>
              <TableCell>₦{p.revenue.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Separator />

      {/* STAFF */}
      <h2 className="font-semibold">Staff Performance</h2>
      <StaffSalesPieChart data={store.staffPerformance} />

      <Table>
        <TableBody>
          {store.staffPerformance.map(s => (
            <TableRow key={s.staffId}>
              <TableCell>{s.staffName}</TableCell>
              <TableCell>₦{s.totalSales.toLocaleString()}</TableCell>
              <TableCell>{s.transactions.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Separator />


        <div className="flex gap-2">
            <ExportPopover
                label="Export Excel"
                onConfirm={(range) => handleExcelExport(range, store)}
            />

            <ExportPopover
                label="Export PDF"
                onConfirm={(range) => handlePDFExport(range, store)}
            />
        </div>

    </div>
  );
}

/* ---------- REUSABLE TABLE ---------- */
function SalesTable({
  data
}: {
  data: { date: string; totalAmount: number; transactions: number }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Period</TableHead>
          <TableHead>Sales</TableHead>
          <TableHead>Transactions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(d => (
          <TableRow key={d.date}>
            <TableCell>{d.date}</TableCell>
            <TableCell>₦{d.totalAmount.toLocaleString()}</TableCell>
            <TableCell>{d.transactions.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
