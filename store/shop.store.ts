import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';

interface Store {
  id: string;
  name: string;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

interface StoreState {
  currentStore: Store | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  createUserStoreAfterSignUp: (email: string, id: string) => Promise<Store | null>;
  setCurrentStore: (store: Store | null) => void;
  clearError: () => void;
}

export const useStoreStore = create<StoreState>((set) => ({
  currentStore: null,
  isLoading: false,
  error: null,

  createUserStoreAfterSignUp: async (email, id) => {
    set({ isLoading: true, error: null });

    try {
      // Step 1: Create the Store
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .insert({
          name: `${email?.split('@')[0] || 'My'}'s Store`,
          owner_id: id,
        })
        .select()
        .single();

      if (storeError) throw storeError;
      if (!store) throw new Error('Failed to create store');

      // Step 2: Update user profile with store_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          store_id: store.id,
        })
        .eq('id', id);

      if (profileError) throw profileError;

      // Success
      set({
        currentStore: store,
        isLoading: false,
      });

      console.log("✅ Store created and linked successfully:", store);
      return store;

    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'Failed to create store';
      set({
        error: errorMessage,
        isLoading: false,
      });
      console.error("Failed to create store:", error);
      throw error;
    }
  },

  setCurrentStore: (store) => set({ currentStore: store }),

  clearError: () => set({ error: null }),
}));