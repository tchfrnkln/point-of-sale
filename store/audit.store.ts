import { create } from "zustand";

export type SaleLog = {
  id: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  soldBy: string;
  timestamp: string;
};

type AuditLogStore = {
  logs: SaleLog[];
  filteredLogs: SaleLog[];
  filterByUser: (username: string) => void;
  resetFilter: () => void;
  seedMockData: () => void;
};

export const useAuditLogStore = create<AuditLogStore>((set, get) => ({
  logs: [],
  filteredLogs: [],

  filterByUser: (username: string) => {
    const logs = get().logs;
    set({ filteredLogs: logs.filter(log => log.soldBy.toLowerCase() === username.toLowerCase()) });
  },

  resetFilter: () => {
    const logs = get().logs;
    set({ filteredLogs: logs });
  },

  seedMockData: () => {
    const data: SaleLog[] = [
      {
        id: "1",
        productName: "Milk",
        quantity: 2,
        pricePerUnit: 100,
        totalPrice: 200,
        soldBy: "Alice",
        timestamp: "2025-12-30T07:15:00"
      },
      {
        id: "2",
        productName: "Bread",
        quantity: 3,
        pricePerUnit: 50,
        totalPrice: 150,
        soldBy: "Bob",
        timestamp: "2025-12-30T08:45:00"
      },
      {
        id: "3",
        productName: "Eggs",
        quantity: 12,
        pricePerUnit: 20,
        totalPrice: 240,
        soldBy: "Alice",
        timestamp: "2025-12-30T09:30:00"
      }
    ];

    set({ logs: data, filteredLogs: data });
  }
}));
