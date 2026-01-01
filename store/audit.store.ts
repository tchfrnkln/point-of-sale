import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";

export type PaymentType = "cash" | "card" | "transfer";

export type SaleLog = {
  id: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  soldBy: string;
  paymentType: PaymentType;
  timestamp: string;
};

type DateRange = {
  from?: string;
  to?: string;
};

type AuditLogStore = {
  logs: SaleLog[];
  filteredLogs: SaleLog[];

  usernameFilter?: string;
  paymentFilter?: PaymentType;
  dateRange?: DateRange;

  fetchLogs: () => Promise<void>;
  addLog: (log: Omit<SaleLog, "id" | "timestamp">) => Promise<void>;

  setUsernameFilter: (username?: string) => void;
  setPaymentFilter: (type?: PaymentType) => void;
  setDateRange: (range?: DateRange) => void;

  applyFilters: () => void;
  resetFilters: () => void;
};

export const useAuditLogStore = create<AuditLogStore>((set, get) => ({
  logs: [],
  filteredLogs: [],

  fetchLogs: async () => {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch audit logs", error);
      return;
    }

    const mapped: SaleLog[] = data.map(row => ({
      id: row.id,
      productName: row.product_name,
      quantity: row.quantity,
      pricePerUnit: Number(row.price_per_unit),
      totalPrice: Number(row.total_price),
      soldBy: row.sold_by,
      paymentType: row.payment_type,
      timestamp: row.created_at
    }));

    set({ logs: mapped, filteredLogs: mapped });
  },

  addLog: async log => {
    const { error } = await supabase.from("audit_logs").insert({
      product_name: log.productName,
      quantity: log.quantity,
      price_per_unit: log.pricePerUnit,
      total_price: log.totalPrice,
      sold_by: log.soldBy,
      payment_type: log.paymentType
    });

    if (!error) {
      await get().fetchLogs();
    }
  },

  setUsernameFilter: username => {
    set({ usernameFilter: username });
    get().applyFilters();
  },

  setPaymentFilter: type => {
    set({ paymentFilter: type });
    get().applyFilters();
  },

  setDateRange: range => {
    set({ dateRange: range });
    get().applyFilters();
  },

  applyFilters: () => {
    const { logs, usernameFilter, paymentFilter, dateRange } = get();

    let result = [...logs];

    if (usernameFilter) {
      result = result.filter(l =>
        l.soldBy.toLowerCase().includes(usernameFilter.toLowerCase())
      );
    }

    if (paymentFilter) {
      result = result.filter(l => l.paymentType === paymentFilter);
    }

    if (dateRange?.from) {
      result = result.filter(
        l => new Date(l.timestamp) >= new Date(dateRange.from!)
      );
    }

    if (dateRange?.to) {
      result = result.filter(
        l => new Date(l.timestamp) <= new Date(dateRange.to!)
      );
    }

    set({ filteredLogs: result });
  },

  resetFilters: () => {
    set({
      usernameFilter: undefined,
      paymentFilter: undefined,
      dateRange: undefined,
      filteredLogs: get().logs
    });
  }
}));
