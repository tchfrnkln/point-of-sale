import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";

/* ===================== TYPES (UNCHANGED) ===================== */

export type SalesSummary = {
  date: string;
  totalAmount: number;
  transactions: number;
};

export type TopProduct = {
  productId: string;
  name: string;
  quantitySold: number;
  revenue: number;
};

export type StaffPerformance = {
  staffId: string;
  staffName: string;
  totalSales: number;
  transactions: number;
};

export type SalesAnalyticsState = {
  daily: SalesSummary[];
  weekly: SalesSummary[];
  monthly: SalesSummary[];

  totalSales: number;
  totalTransactions: number;

  topProducts: TopProduct[];
  staffPerformance: StaffPerformance[];

  /* EXISTING FUNCTION — NOW BACKED BY DB */
  seedMockData: () => Promise<void>;
};

/* ===================== STORE ===================== */

export const useSalesAnalyticsStore = create<SalesAnalyticsState>((set) => ({
  daily: [],
  weekly: [],
  monthly: [],

  totalSales: 0,
  totalTransactions: 0,

  topProducts: [],
  staffPerformance: [],

  /* ==========================================================
     seedMockData() KEPT — NOW FETCHES FROM audit_logs TABLE
     ========================================================== */
  seedMockData: async () => {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("product_name, quantity, total_price, sold_by, created_at");

    if (error || !data) {
      console.error("Failed to fetch sales analytics", error);
      return;
    }

    const dailyMap = new Map<string, SalesSummary>();
    const weeklyMap = new Map<string, SalesSummary>();
    const monthlyMap = new Map<string, SalesSummary>();

    const productMap = new Map<string, TopProduct>();
    const staffMap = new Map<string, StaffPerformance>();

    let totalSales = 0;
    const totalTransactions = data.length;

    for (const row of data) {
      const amount = Number(row.total_price);
      totalSales += amount;

      const date = new Date(row.created_at);
      const dayKey = date.toISOString().split("T")[0];
      const weekKey = `Week ${Math.ceil(date.getDate() / 7)}`;
      const monthKey = date.toLocaleString("default", { month: "short" });

      /* ---------- DAILY ---------- */
      const daily = dailyMap.get(dayKey) ?? {
        date: dayKey,
        totalAmount: 0,
        transactions: 0
      };
      daily.totalAmount += amount;
      daily.transactions += 1;
      dailyMap.set(dayKey, daily);

      /* ---------- WEEKLY ---------- */
      const weekly = weeklyMap.get(weekKey) ?? {
        date: weekKey,
        totalAmount: 0,
        transactions: 0
      };
      weekly.totalAmount += amount;
      weekly.transactions += 1;
      weeklyMap.set(weekKey, weekly);

      /* ---------- MONTHLY ---------- */
      const monthly = monthlyMap.get(monthKey) ?? {
        date: monthKey,
        totalAmount: 0,
        transactions: 0
      };
      monthly.totalAmount += amount;
      monthly.transactions += 1;
      monthlyMap.set(monthKey, monthly);

      /* ---------- TOP PRODUCTS ---------- */
      const product = productMap.get(row.product_name) ?? {
        productId: row.product_name,
        name: row.product_name,
        quantitySold: 0,
        revenue: 0
      };
      product.quantitySold += row.quantity;
      product.revenue += amount;
      productMap.set(row.product_name, product);

      /* ---------- STAFF PERFORMANCE ---------- */
      const staff = staffMap.get(row.sold_by) ?? {
        staffId: row.sold_by,
        staffName: row.sold_by,
        totalSales: 0,
        transactions: 0
      };
      staff.totalSales += amount;
      staff.transactions += 1;
      staffMap.set(row.sold_by, staff);
    }

    set({
      daily: Array.from(dailyMap.values()),
      weekly: Array.from(weeklyMap.values()),
      monthly: Array.from(monthlyMap.values()),

      totalSales,
      totalTransactions,

      topProducts: Array.from(productMap.values()).sort(
        (a, b) => b.revenue - a.revenue
      ),

      staffPerformance: Array.from(staffMap.values()).sort(
        (a, b) => b.totalSales - a.totalSales
      )
    });
  }
}));
