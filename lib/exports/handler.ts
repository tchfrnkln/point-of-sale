import { ExportRange } from "@/components/features/dashboard/sales/Exports/PopOver";
import { exportToExcel } from "./exportToExcel";
import { exportToPDF } from "./exportToPdf";
import { SalesAnalyticsState } from "@/store/sales.store";

export function handleExcelExport(range: ExportRange, store: SalesAnalyticsState) {
  switch (range) {
    case "DAILY":
      exportToExcel({
        filename: "daily-sales",
        sheetName: "Daily Sales",
        data: store.daily.map(d => ({
          Date: d.date,
          Sales: d.totalAmount,
          Transactions: d.transactions
        }))
      });
      break;

    case "WEEKLY":
      exportToExcel({
        filename: "weekly-sales",
        sheetName: "Weekly Sales",
        data: store.weekly.map(w => ({
          Period: w.date,
          Sales: w.totalAmount,
          Transactions: w.transactions
        }))
      });
      break;

    case "MONTHLY":
      exportToExcel({
        filename: "monthly-sales",
        sheetName: "Monthly Sales",
        data: store.monthly.map(m => ({
          Period: m.date,
          Sales: m.totalAmount,
          Transactions: m.transactions
        }))
      });
      break;

    case "TOP_PRODUCTS_30":
      exportToExcel({
        filename: "top-products-30-days",
        sheetName: "Top Products",
        data: store.topProducts.map(p => ({
          Product: p.name,
          Quantity: p.quantitySold,
          Revenue: p.revenue
        }))
      });
      break;

    case "STAFF_30":
      exportToExcel({
        filename: "staff-performance-30-days",
        sheetName: "Staff Performance",
        data: store.staffPerformance.map(s => ({
          Staff: s.staffName,
          Sales: s.totalSales,
          Transactions: s.transactions
        }))
      });
      break;
  }
}


export function handlePDFExport(range: ExportRange, store: SalesAnalyticsState) {
  switch (range) {
    case "DAILY":
      exportToPDF({
        title: "Daily Sales Report",
        filename: "daily-sales",
        headers: ["Date", "Sales", "Transactions"],
        data: store.daily.map(d => [
          d.date,
          d.totalAmount,
          d.transactions
        ])
      });
      break;

    case "TOP_PRODUCTS_30":
      exportToPDF({
        title: "Top Products (Last 30 Days)",
        filename: "top-products",
        headers: ["Product", "Qty Sold", "Revenue"],
        data: store.topProducts.map(p => [
          p.name,
          p.quantitySold,
          p.revenue
        ])
      });
      break;

    case "STAFF_30":
      exportToPDF({
        title: "Staff Performance (Last 30 Days)",
        filename: "staff-performance",
        headers: ["Staff", "Sales", "Transactions"],
        data: store.staffPerformance.map(s => [
          s.staffName,
          s.totalSales,
          s.transactions
        ])
      });
      break;
  }
}

