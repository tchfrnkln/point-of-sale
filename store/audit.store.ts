import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { PaymentType } from "./pos.store";

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
      quantity: Number(row.quantity),
      pricePerUnit: Number(row.price_per_unit),
      totalPrice: Number(row.total_price),
      soldBy: row.sold_by,
      paymentType: (row.payment_type as PaymentType).toUpperCase() as PaymentType,
      timestamp: row.created_at
    }));

    set({ logs: mapped, filteredLogs: mapped });
  },

  addLog: async log => {
    const newId = crypto.randomUUID();

    const { error } = await supabase.from("audit_logs").insert({
      id: newId,
      product_name: log.productName,
      quantity: log.quantity,
      price_per_unit: log.pricePerUnit,
      total_price: log.totalPrice,
      sold_by: log.soldBy,
      payment_type: log.paymentType.toUpperCase() as PaymentType
    });

    if (error) {
      console.error("Failed to insert log:", error);
      return;
    }

    await get().fetchLogs();
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

    if (usernameFilter?.trim()) {
      result = result.filter(l =>
        l.soldBy.toLowerCase().includes(usernameFilter.trim().toLowerCase())
      );
    }

    if (paymentFilter) {
      result = result.filter(l => l.paymentType === paymentFilter);
    }

    if (dateRange?.from) {
      const from = new Date(dateRange.from);
      result = result.filter(l => new Date(l.timestamp) >= from);
    }

    if (dateRange?.to) {
      const to = new Date(dateRange.to);
      result = result.filter(l => new Date(l.timestamp) <= to);
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
