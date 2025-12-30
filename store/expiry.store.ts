import { create } from "zustand";

export type Product = {
  id: string;
  name: string;
  quantity: number;
  expiryDate: string; // ISO string yyyy-mm-dd
  isExpired: boolean;
};

type ExpiryStore = {
  products: Product[];
  expiredProducts: Product[];

  seedMockData: () => void;
  recalculateExpiry: () => void;
  deleteExpiredProduct: (id: string) => void;
};

export const useExpiryStore = create<ExpiryStore>((set, get) => ({
  products: [],
  expiredProducts: [],

  seedMockData: () => {
    const data: Product[] = [
  { id: "1", name: "Peak Milk 400g", quantity: 24, expiryDate: "2024-09-10", isExpired: false },
  { id: "2", name: "Golden Penny Spaghetti", quantity: 50, expiryDate: "2025-06-01", isExpired: false },
  { id: "3", name: "Indomie Chicken", quantity: 120, expiryDate: "2024-11-01", isExpired: false },
  { id: "4", name: "Indomie Onion", quantity: 90, expiryDate: "2024-10-20", isExpired: false },
  { id: "5", name: "Milo Sachet", quantity: 60, expiryDate: "2025-02-15", isExpired: false },
  { id: "6", name: "Bournvita Jar", quantity: 15, expiryDate: "2024-08-25", isExpired: false },
  { id: "7", name: "Dangote Sugar 1kg", quantity: 40, expiryDate: "2025-12-31", isExpired: false },
  { id: "8", name: "Honeywell Semolina", quantity: 30, expiryDate: "2025-01-05", isExpired: false },
  { id: "9", name: "Power Oil 3L", quantity: 10, expiryDate: "2024-07-01", isExpired: false },
  { id: "10", name: "Eva Table Water", quantity: 200, expiryDate: "2024-06-15", isExpired: false },

  { id: "11", name: "Coca Cola 50cl", quantity: 80, expiryDate: "2024-12-05", isExpired: false },
  { id: "12", name: "Pepsi 50cl", quantity: 75, expiryDate: "2024-12-01", isExpired: false },
  { id: "13", name: "Fanta Orange", quantity: 65, expiryDate: "2024-11-28", isExpired: false },
  { id: "14", name: "Sprite 50cl", quantity: 50, expiryDate: "2024-11-20", isExpired: false },

  { id: "15", name: "Mr Chef Tomato Paste", quantity: 35, expiryDate: "2024-09-30", isExpired: false },
  { id: "16", name: "Titus Sardines", quantity: 55, expiryDate: "2026-03-01", isExpired: false },
  { id: "17", name: "Gino Curry", quantity: 20, expiryDate: "2024-10-10", isExpired: false },
  { id: "18", name: "Maggi Star Cubes", quantity: 150, expiryDate: "2025-05-20", isExpired: false },

  { id: "19", name: "Cornflakes 500g", quantity: 25, expiryDate: "2024-08-01", isExpired: false },
  { id: "20", name: "Custard Powder", quantity: 45, expiryDate: "2025-04-10", isExpired: false },

  { id: "21", name: "Dettol Soap", quantity: 70, expiryDate: "2026-01-01", isExpired: false },
  { id: "22", name: "Lux Soap", quantity: 60, expiryDate: "2025-07-15", isExpired: false },

  { id: "23", name: "Close Up Toothpaste", quantity: 30, expiryDate: "2024-09-01", isExpired: false },
  { id: "24", name: "Colgate Toothpaste", quantity: 35, expiryDate: "2025-11-10", isExpired: false },

  { id: "25", name: "Omo Detergent", quantity: 40, expiryDate: "2026-06-30", isExpired: false },
  { id: "26", name: "Ariel Detergent", quantity: 30, expiryDate: "2025-03-15", isExpired: false },

  { id: "27", name: "Body Spray", quantity: 20, expiryDate: "2024-07-20", isExpired: false },
  { id: "28", name: "Roll-on Deodorant", quantity: 18, expiryDate: "2024-08-18", isExpired: false },

  { id: "29", name: "Corn Oil 1L", quantity: 22, expiryDate: "2024-09-25", isExpired: false },
  { id: "30", name: "Palm Oil Bottle", quantity: 16, expiryDate: "2025-08-01", isExpired: false }
  ];


    set({ products: data });
    get().recalculateExpiry();
  },

  recalculateExpiry: () => {
    const today = new Date();

    const updated = get().products.map(p => {
      const expiry = new Date(p.expiryDate);
      return {
        ...p,
        isExpired: expiry < today
      };
    });

    set({
      products: updated,
      expiredProducts: updated.filter(p => p.isExpired)
    });
  },

  deleteExpiredProduct: (id: string) => {
    const remaining = get().products.filter(p => p.id !== id);

    set({
      products: remaining,
      expiredProducts: remaining.filter(p => p.isExpired)
    });
  }
}));
