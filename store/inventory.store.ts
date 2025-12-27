import { supabase } from '@/lib/supabase/client'
import { create } from 'zustand'

export type InventoryItem = {
  id: string
  barcode: string
  productName: string
  stockAmount: number
  cost: number
  expiryDate: Date | null
}

type InventoryStore = {
  inventory: InventoryItem[]
  activeItem: InventoryItem | null
  searchQuery: string
  loading: boolean

  fetchInventory: () => Promise<void>
  setSearchQuery: (q: string) => void
  setActiveItem: (id: string | 'createNew') => void
  updateActiveItem: <K extends keyof InventoryItem>(
    field: K,
    value: InventoryItem[K]
  ) => void
  saveActiveItem: () => Promise<void>
}

const emptyItem: InventoryItem = {
  id: '',
  barcode: '',
  productName: '',
  stockAmount: 0,
  cost: 0,
  expiryDate: null,
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  inventory: [],
  activeItem: null,
  searchQuery: '',
  loading: false,

  setSearchQuery: (q) => set({ searchQuery: q }),

  fetchInventory: async () => {
    set({ loading: true })

    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      set({ loading: false })
      return
    }

    set({
      inventory: data.map(row => ({
        id: row.id,
        barcode: row.barcode,
        productName: row.product_name,
        stockAmount: row.stock_amount,
        cost: Number(row.cost),
        expiryDate: row.expiry_date
          ? new Date(row.expiry_date)
          : null,
      })),
      loading: false,
    })
  },

  setActiveItem: (id) => {
    if (id === 'createNew') {
      set({ activeItem: { ...emptyItem } })
      return
    }

    const found = get().inventory.find(i => i.id === id)
    if (found) set({ activeItem: { ...found } })
  },

  updateActiveItem: (field, value) => {
    set(state => ({
      activeItem: state.activeItem
        ? { ...state.activeItem, [field]: value }
        : null,
    }))
  },

  saveActiveItem: async () => {
    const { activeItem, inventory } = get()
    if (!activeItem) return

    // CREATE
    if (!activeItem.id) {
      const { data, error } = await supabase
        .from('inventory')
        .insert({
          barcode: activeItem.barcode,
          product_name: activeItem.productName,
          stock_amount: activeItem.stockAmount,
          cost: activeItem.cost,
          expiry_date: activeItem.expiryDate
            ? activeItem.expiryDate.toISOString().split('T')[0]
            : null,
        })
        .select()
        .single()

      if (error) throw error

      set({
        inventory: [
          {
            id: data.id,
            barcode: data.barcode,
            productName: data.product_name,
            stockAmount: data.stock_amount,
            cost: Number(data.cost),
            expiryDate: data.expiry_date
              ? new Date(data.expiry_date)
              : null,
          },
          ...inventory,
        ],
        activeItem: null,
      })

      return
    }

    // UPDATE
    await supabase
      .from('inventory')
      .update({
        product_name: activeItem.productName,
        stock_amount: activeItem.stockAmount,
        cost: activeItem.cost,
        expiry_date: activeItem.expiryDate
          ? activeItem.expiryDate.toISOString().split('T')[0]
          : null,
      })
      .eq('id', activeItem.id)

    set({
      inventory: inventory.map(i =>
        i.id === activeItem.id ? activeItem : i
      ),
      activeItem: null,
    })
  },
}))
