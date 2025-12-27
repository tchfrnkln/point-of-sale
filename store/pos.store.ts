import { create } from "zustand"

export type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  stockLeft: number
}

export type PaymentType = "CASH" | "TRANSFER" | "CARD"

export type PaymentMethod = {
  type: PaymentType
  amount: number
}

type POSStore = {
  cart: CartItem[]
  suspendedSales: CartItem[][]
  payments: PaymentMethod[]

  addItem: (item: CartItem) => void
  updateQty: (id: string, qty: number) => void
  removeItem: (id: string) => void
  suspendSale: () => void
  resumeSale: (index: number) => void
  clearSale: () => void
  addPayment: (payment: PaymentMethod) => void
}

export const usePOSStore = create<POSStore>((set, get) => ({
  cart: [],
  suspendedSales: [],
  payments: [],

  addItem: item => {
    const existing = get().cart.find(i => i.productId === item.productId)

    if (existing) {
      if (existing.quantity + 1 > existing.stockLeft) return
      set({
        cart: get().cart.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      })
    } else {
      set({ cart: [...get().cart, item] })
    }
  },

  updateQty: (id, qty) =>
    set({
      cart: get().cart.map(i =>
        i.id === id ? { ...i, quantity: Math.min(qty, i.stockLeft) } : i
      )
    }),

  removeItem: id =>
    set({ cart: get().cart.filter(i => i.id !== id) }),

  suspendSale: () =>
    set({
      suspendedSales: [...get().suspendedSales, get().cart],
      cart: [],
      payments: [],
    }),

  resumeSale: index =>
    set(state => ({
      cart: state.suspendedSales[index],
      suspendedSales: state.suspendedSales.filter((_, i) => i !== index),
    })),

  clearSale: () =>
    set({ cart: [], payments: [] }),

  addPayment: payment =>
    set({ payments: [...get().payments, payment] }),
}))
