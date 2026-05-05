import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useAuditLogStore } from './audit.store';
import { useInventoryStore } from './inventory.store';

export type ReturnLog = {
  id: string;
  saleLogId: string | null;
  productName: string;
  returnedQuantity: number;
  originalQuantity: number;
  returnReason?: string;
  returnedBy: string;
  returnDate: string;
};

type ReturnsRow = {
  id: string;
  sale_log_id: string | null;
  product_name: string;
  returned_quantity: number;
  return_reason?: string;
  returned_by: string;
  created_at: string;
};

type SaleLogRow = {
  id: string;
  product_name: string;
  quantity: number;
};

type ReturnsStore = {
  returns: ReturnLog[];
  loading: boolean;

  fetchReturns: () => Promise<void>;

  processReturn: (
    saleLogId: string,
    returnedQuantity: number,
    reason?: string
  ) => Promise<void>;

  deleteReturn: (returnId: string) => Promise<void>;
};

export const useReturnsStore = create<ReturnsStore>((set, get) => ({
  returns: [],
  loading: false,

  fetchReturns: async () => {
    set({ loading: true });

    const { data, error } = await supabase
      .from('returns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch returns:', error);
      toast.error("Failed to fetch returns");
      set({ loading: false });
      return;
    }

    const mapped: ReturnLog[] = (data || []).map((row: ReturnsRow) => ({
      id: row.id,
      saleLogId: row.sale_log_id,
      productName: row.product_name,
      returnedQuantity: row.returned_quantity,
      originalQuantity: row.returned_quantity, // Since we don't have original anymore
      returnReason: row.return_reason,
      returnedBy: row.returned_by,
      returnDate: row.created_at,
    }));

    set({ returns: mapped, loading: false });
  },

  processReturn: async (
    saleLogId: string,
    returnedQuantity: number,
    reason?: string
  ) => {
    try {
      // 1. Get sale details
      const { data: saleLog, error: saleError } = await supabase
        .from('audit_logs')
        .select('id, product_name, quantity')
        .eq('id', saleLogId)
        .single();

      if (saleError || !saleLog) {
        toast.error("Sale record not found");
        return;
      }

      const typedSaleLog = saleLog as SaleLogRow;

      if (returnedQuantity <= 0 || returnedQuantity > typedSaleLog.quantity) {
        toast.error("Invalid return quantity");
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user?.email || 'Unknown';

      // 2. Record return with product_name
      const { error: returnError } = await supabase
        .from('returns')
        .insert({
          sale_log_id: saleLogId,
          product_name: typedSaleLog.product_name,
          returned_quantity: returnedQuantity,
          return_reason: reason,
          returned_by: currentUser,
        });

      if (returnError) throw returnError;

      // 3. Delete from audit_logs
      const { error: deleteError } = await supabase
        .from('audit_logs')
        .delete()
        .eq('id', saleLogId);

      if (deleteError) throw deleteError;

      // 4. Restore stock in inventory
      const { data: inventoryItem } = await supabase
        .from('inventory')
        .select('id, stock_amount')
        .eq('product_name', typedSaleLog.product_name)
        .single();

      if (inventoryItem) {
        await supabase
          .from('inventory')
          .update({
            stock_amount: inventoryItem.stock_amount + returnedQuantity
          })
          .eq('id', inventoryItem.id);
      }

      // 5. Refresh stores
      await useInventoryStore.getState().fetchInventory();
      await useAuditLogStore.getState().fetchLogs();
      await get().fetchReturns();

      toast.success(
        `Return processed: ${returnedQuantity} × ${typedSaleLog.product_name}`
      );

    } catch (error: unknown) {
      console.error('Return processing failed:', error);
      const message = error instanceof Error ? error.message : "Failed to process return";
      toast.error(message);
    }
  },

  deleteReturn: async (returnId: string) => {
    const { error } = await supabase.from('returns').delete().eq('id', returnId);
    if (error) {
      toast.error("Failed to delete return record");
    } else {
      toast.success("Return record deleted");
      await get().fetchReturns();
    }
  },
}));