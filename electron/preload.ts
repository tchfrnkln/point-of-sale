// import { BusinessInfo, CartItem } from "@/store/pos.store";
import { contextBridge, ipcRenderer } from "electron";

type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  stockLeft: number
}

export type BusinessInfo = {
  name: string
  logoUrl?: string
}

contextBridge.exposeInMainWorld("electron", {
  platform: process.platform,
  printReceipt: (cart: CartItem, businessInfo: BusinessInfo) => {
    ipcRenderer.send("print-receipt", { cart, businessInfo });
  }
});
