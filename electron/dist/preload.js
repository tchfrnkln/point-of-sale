"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { BusinessInfo, CartItem } from "@/store/pos.store";
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("electron", {
    platform: process.platform,
    printReceipt: (cart, businessInfo) => {
        electron_1.ipcRenderer.send("print-receipt", { cart, businessInfo });
    }
});
