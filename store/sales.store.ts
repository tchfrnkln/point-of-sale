import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";

/* ===================== TYPES ===================== */

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

  fromDate: string;
  toDate: string;

  setDateRange: (from: string, to: string) => void;
  fetchSales: () => Promise<void>;
};

/* ===================== STORE ===================== */

export const useSalesAnalyticsStore = create<SalesAnalyticsState>((set, get) => ({
  daily: [],
  weekly: [],
  monthly: [],

  totalSales: 0,
  totalTransactions: 0,

  topProducts: [],
  staffPerformance: [],

  fromDate: "",
  toDate: "",

  setDateRange: (from, to) => set({ fromDate: from, toDate: to }),

  fetchSales: async () => {
    const { fromDate, toDate } = get();

    let query = supabase
      .from("audit_logs")
      .select("product_name, quantity, total_price, sold_by, created_at");

    if (fromDate) query = query.gte("created_at", fromDate);
    if (toDate) query = query.lte("created_at", `${toDate}T23:59:59`);

    const { data, error } = await query;

    if (error || !data) {
      console.error("Failed to fetch sales", error);
      return;
    }

    const dailyMap = new Map<string, SalesSummary>();
    const weeklyMap = new Map<string, SalesSummary>();
    const monthlyMap = new Map<string, SalesSummary>();
    const productMap = new Map<string, TopProduct>();
    const staffMap = new Map<string, StaffPerformance>();

    let totalSales = 0;

    for (const row of data) {
      const amount = Number(row.total_price);
      totalSales += amount;

      const date = new Date(row.created_at);
      const dayKey = date.toISOString().split("T")[0];
      const weekKey = `Week ${Math.ceil(date.getDate() / 7)}`;
      const monthKey = date.toLocaleString("default", { month: "short" });

      const push = (map: Map<string, SalesSummary>, key: string) => {
        const entry = map.get(key) ?? {
          date: key,
          totalAmount: 0,
          transactions: 0
        };
        entry.totalAmount += amount;
        entry.transactions += 1;
        map.set(key, entry);
      };

      push(dailyMap, dayKey);
      push(weeklyMap, weekKey);
      push(monthlyMap, monthKey);

      const product = productMap.get(row.product_name) ?? {
        productId: row.product_name,
        name: row.product_name,
        quantitySold: 0,
        revenue: 0
      };
      product.quantitySold += row.quantity;
      product.revenue += amount;
      productMap.set(row.product_name, product);

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
      totalTransactions: data.length,
      topProducts: Array.from(productMap.values()).sort(
        (a, b) => b.revenue - a.revenue
      ),
      staffPerformance: Array.from(staffMap.values()).sort(
        (a, b) => b.totalSales - a.totalSales
      )
    });
  }
}));
