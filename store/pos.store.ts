import { toast } from "sonner"
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

export type SuspendedSale = {
  id: number 
  cart: CartItem[]
}

type POSStore = {
  ticketCounter: number
  cart: CartItem[]
  suspendedSales: SuspendedSale[]
  payments: PaymentMethod[]

  addItem: (item: CartItem) => void
  updateQty: (id: string, qty: number) => void
  removeItem: (id: string) => void
  suspendSale: () => void
  resumeSale: (id: number) => void
  clearSale: () => void
  addPayment: (payment: PaymentMethod) => void
}

export type BusinessInfo = {
  name: string
  logoUrl?: string
}

export const businessInfo: BusinessInfo = { 
    name: "My Business", 
    logoUrl: "logo.png" 
}


export const usePOSStore = create<POSStore>((set, get) => ({
  ticketCounter: 1,
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

  // Suspend Sale with persistent ticket numbers
  suspendSale: () =>
    set(state => {
        if (state.cart.length === 0) {
            toast.error("No items in the cart to suspend")
            return state // return current state without changing anything
        }
      const ticket = state.ticketCounter
      return {
        suspendedSales: [...state.suspendedSales, { id: ticket, cart: state.cart }],
        cart: [],
        payments: [],
        ticketCounter: state.ticketCounter + 1, // increment ticket
      }
    }),

  // Resume Sale by ticket id
  resumeSale: (id: number) =>
    set(state => {
      const sale = state.suspendedSales.find(s => s.id === id)
      if (!sale) return state

        const remainingSales = state.suspendedSales.filter(s => s.id !== id)

      return {
        cart: sale.cart,
        suspendedSales: state.suspendedSales.filter(s => s.id !== id),
        ticketCounter: remainingSales.length === 0 ? 1 : state.ticketCounter
      }
    }),

  clearSale: () =>
    set({ cart: [], payments: [] }),

  addPayment: payment =>
    set({ payments: [...get().payments, payment] }),
}))
