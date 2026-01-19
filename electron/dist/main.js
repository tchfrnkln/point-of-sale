"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const escpos_1 = __importDefault(require("escpos"));
const escpos_usb_1 = __importDefault(require("escpos-usb")); //test to see issues
// ----------------------
// WINDOW
// ----------------------
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    // DEV
    // if (app.isPackaged) {
    // mainWindow.loadFile(
    //   path.join(__dirname, "../../out/index.html")
    // )
    // } else {
    mainWindow.loadURL("https://geodis.com.ng/");
    // mainWindow.loadURL("http://localhost:3000")
    //   mainWindow.webContents.openDevTools()
    // }
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
// ----------------------
// THERMAL PRINT HANDLER
// ----------------------
electron_1.ipcMain.on("print-receipt", async (_event, payload) => {
    const { cart, businessInfo } = payload;
    if (!cart.length)
        return;
    try {
        const device = new escpos_usb_1.default();
        const printer = new escpos_1.default.Printer(device);
        device.open(async (error) => {
            if (error) {
                console.error("Printer connection failed:", error);
                return;
            }
            // HEADER
            printer
                .align("CT")
                .style("B")
                .text(businessInfo.name)
                .style("NORMAL")
                .text("--------------------------------");
            // ITEMS
            printer.align("LT");
            cart.forEach((item) => {
                const lineTotal = item.price * item.quantity;
                printer.text(`${item.name} x${item.quantity}  ₦${lineTotal.toLocaleString()}`);
            });
            // TOTAL
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            printer
                .text("--------------------------------")
                .align("RT")
                .style("B")
                .text(`TOTAL: ₦${total.toLocaleString()}`)
                .style("NORMAL")
                .feed(1)
                .cut()
                .close();
        });
    }
    catch (err) {
        console.error("Thermal print error:", err);
    }
});
