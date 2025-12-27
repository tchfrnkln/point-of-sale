import { BusinessInfo, CartItem } from "@/store/pos.store";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  platform: process.platform,
  printReceipt: (cart: CartItem, businessInfo: BusinessInfo) => {
    ipcRenderer.send("print-receipt", { cart, businessInfo });
  }
});
