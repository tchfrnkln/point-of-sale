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

  setSearchQuery: (query: string) => void
  setActiveItem: (itemId: string | 'createNew') => void
  updateActiveItem: <K extends keyof InventoryItem>(
    field: K,
    value: InventoryItem[K]
  ) => void
  saveActiveItem: () => void
  resetActiveItem: () => void
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
  inventory: [
    {
      id: 'INV001',
      barcode: '123456',
      productName: 'Product A',
      stockAmount: 2,
      cost: 250000,
      expiryDate: null,
    },
    {
      id: 'INV002',
      barcode: '789456',
      productName: 'Product B',
      stockAmount: 100,
      cost: 150000,
      expiryDate: null,
    },
  ],

  activeItem: null,
  searchQuery: '',

  setSearchQuery: (query) => set({ searchQuery: query }),

  setActiveItem: (itemId) => {
    if (itemId === 'createNew') {
      set({ activeItem: { ...emptyItem } })
      return
    }

    const found = get().inventory.find(i => i.id === itemId)
    if (found) {
      set({ activeItem: { ...found } })
    }
  },

  updateActiveItem: (field, value) => {
    set(state => ({
      activeItem: state.activeItem
        ? { ...state.activeItem, [field]: value }
        : null,
    }))
  },

  saveActiveItem: () => {
    const { activeItem, inventory } = get()
    if (!activeItem) return

    if (!activeItem.id) {
      set({
        inventory: [
          ...inventory,
          { ...activeItem, id: crypto.randomUUID() },
        ],
        activeItem: null,
      })
      return
    }

    set({
      inventory: inventory.map(item =>
        item.id === activeItem.id ? activeItem : item
      ),
      activeItem: null,
    })
  },

  resetActiveItem: () => set({ activeItem: null }),
}))
