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
import { UserInfo } from "@/components/features/dashboard/UserInfo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminSalesPage() {
  const {
    daily,
    weekly,
    monthly,
    totalSales,
    totalTransactions,
    topProducts,
    staffPerformance,
    fromDate,
    toDate,
    setDateRange,
    fetchSales
  } = useSalesAnalyticsStore();

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return (
    <div className="p-6 space-y-6">
      <UserInfo name="Sales Dashboard" />

      {/* DATE RANGE FILTER */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-sm">From</label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setDateRange(e.target.value, toDate)}
            />
          </div>

          <div>
            <label className="text-sm">To</label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setDateRange(fromDate, e.target.value)}
            />
          </div>

          <Button onClick={fetchSales}>Apply</Button>
        </CardContent>
      </Card>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p>Total Sales</p>
            <p className="text-2xl font-bold">
              ₦{totalSales.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p>Transactions</p>
            <p className="text-2xl font-bold">
              {totalTransactions.toLocaleString()}
            </p>
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
          <DailySalesBarChart data={daily} />
          <SalesTable data={daily} />
        </TabsContent>

        <TabsContent value="weekly">
          <WeeklySalesLineChart data={weekly} />
          <SalesTable data={weekly} />
        </TabsContent>

        <TabsContent value="monthly">
          <SalesTable data={monthly} />
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
          {topProducts.map((p) => (
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
      <StaffSalesPieChart data={staffPerformance} />

      <Table>
        <TableBody>
          {staffPerformance.map((s) => (
            <TableRow key={s.staffId}>
              <TableCell>{s.staffName}</TableCell>
              <TableCell>₦{s.totalSales.toLocaleString()}</TableCell>
              <TableCell>{s.transactions}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Separator />

      {/* EXPORT */}
      <div className="flex gap-2">
        <ExportPopover
          label="Export Excel"
          onConfirm={(range) => handleExcelExport(range, useSalesAnalyticsStore.getState())}
        />

        <ExportPopover
          label="Export PDF"
          onConfirm={(range) => handlePDFExport(range, useSalesAnalyticsStore.getState())}
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
        {data.map((d) => (
          <TableRow key={d.date}>
            <TableCell>{d.date}</TableCell>
            <TableCell>₦{d.totalAmount.toLocaleString()}</TableCell>
            <TableCell>{d.transactions}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
