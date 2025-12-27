import { create } from "zustand";

export type SalesSummary = {
  date: string;
  totalAmount: number;
  transactions: number;
};

export type TopProduct = {
  productId: string;
  name: string;
  quantitySold: number;
  revenue: number;
};

export type StaffPerformance = {
  staffId: string;
  staffName: string;
  totalSales: number;
  transactions: number;
};

type SalesAnalyticsState = {
  daily: SalesSummary[];
  weekly: SalesSummary[];
  monthly: SalesSummary[];

  totalSales: number;
  totalTransactions: number;

  topProducts: TopProduct[];
  staffPerformance: StaffPerformance[];

  seedMockData: () => void;
};

export const useSalesAnalyticsStore = create<SalesAnalyticsState>(set => ({
  daily: [],
  weekly: [],
  monthly: [],
  totalSales: 0,
  totalTransactions: 0,
  topProducts: [],
  staffPerformance: [],

  seedMockData: () =>
    set({
      daily: [
        { date: "Mon", totalAmount: 45000, transactions: 12 },
        { date: "Tue", totalAmount: 78000, transactions: 18 },
        { date: "Wed", totalAmount: 32000, transactions: 9 },
        { date: "Thu", totalAmount: 91000, transactions: 21 },
        { date: "Fri", totalAmount: 67000, transactions: 15 }
      ],

      weekly: [
        { date: "Week 1", totalAmount: 220000, transactions: 65 },
        { date: "Week 2", totalAmount: 310000, transactions: 82 }
      ],

      monthly: [
        { date: "Jan", totalAmount: 850000, transactions: 240 },
        { date: "Feb", totalAmount: 920000, transactions: 265 }
      ],

      totalSales: 1770000,
      totalTransactions: 505,

      topProducts: [
        {
          productId: "1",
          name: "Indomie",
          quantitySold: 420,
          revenue: 210000
        },
        {
          productId: "2",
          name: "Coca-Cola",
          quantitySold: 310,
          revenue: 186000
        }
      ],

      staffPerformance: [
        {
          staffId: "s1",
          staffName: "John",
          totalSales: 540000,
          transactions: 140
        },
        {
          staffId: "s2",
          staffName: "Mary",
          totalSales: 620000,
          transactions: 170
        }
      ]
    })
}));
