import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { isValidUUID } from "./inventory.store";

/* ===================== TYPES ===================== */

export type Product = {
  id: string;
  name: string;
  quantity: number;
  expiryDate: string;
  isExpired: boolean;
};

type ExpiryStore = {
  products: Product[];
  expiredProducts: Product[];

  fetchInventory: (id:string | undefined) => Promise<void>;
  deleteExpiredProduct: (id: string) => Promise<void>;
};

/* ===================== STORE ===================== */

export const useExpiryStore = create<ExpiryStore>((set) => ({
  products: [],
  expiredProducts: [],

  /* ================= FETCH INVENTORY ================= */
  fetchInventory: async (id) => {

    if(id == undefined) return
    if(!isValidUUID(id)) return

    const { data, error } = await supabase
      .from("inventory")
      .select("id, product_name, stock_amount, expiry_date")
      .eq('store_id', id);

    if (error || !data) {
      console.error("Failed to fetch inventory", error);
      return;
    }

    const today = new Date();

    const products: Product[] = data.map((item) => {
      const expiry = item.expiry_date
        ? new Date(item.expiry_date)
        : null;

      const isExpired = expiry ? expiry < today : false;

      return {
        id: item.id,
        name: item.product_name,
        quantity: item.stock_amount,
        expiryDate: item.expiry_date ?? "—",
        isExpired
      };
    });

    set({
      products,
      expiredProducts: products.filter((p) => p.isExpired)
    });
  },

  /* ================= DELETE EXPIRED ================= */
  deleteExpiredProduct: async (id) => {
    const { error } = await supabase
      .from("inventory")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete expired product", error);
      return;
    }

    set((state) => {
      const remaining = state.products.filter((p) => p.id !== id);
      return {
        products: remaining,
        expiredProducts: remaining.filter((p) => p.isExpired)
      };
    });
  }
}));
