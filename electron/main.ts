import { app, BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import path from "path";
import escpos from "escpos";
import USB from "escpos-usb"; //test to see issues

// ----------------------
// TYPES
// ----------------------

type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type BusinessInfo = {
  name: string;
  logoPath?: string; // local PNG path
};

type PrintReceiptPayload = {
  cart: CartItem[];
  businessInfo: BusinessInfo;
};

// ----------------------
// WINDOW
// ----------------------

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // DEV
  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ----------------------
// THERMAL PRINT HANDLER
// ----------------------

ipcMain.on(
  "print-receipt",
  async (_event: IpcMainEvent, payload: PrintReceiptPayload) => {
    const { cart, businessInfo } = payload;

    if (!cart.length) return;

    try {
      const device = new USB();
      const printer = new escpos.Printer(device);

      device.open(async (error: Error | null) => {
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

        cart.forEach((item: CartItem) => {
          const lineTotal = item.price * item.quantity;
          printer.text(
            `${item.name} x${item.quantity}  ₦${lineTotal.toLocaleString()}`
          );
        });

        // TOTAL
        const total = cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

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
    } catch (err) {
      console.error("Thermal print error:", err);
    }
  }
);
