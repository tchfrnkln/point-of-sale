import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // <-- preload script
      contextIsolation: true, // important for security
      nodeIntegration: false, // important for security
    }
  });

  mainWindow.loadURL("http://localhost:3000"); // dev URL

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

ipcMain.on("print", (event, text: string) => {
  if (!mainWindow) return;
  mainWindow.webContents.print({ silent: false, printBackground: true }, (success, failureReason) => {
    if (!success) console.error("Print failed:", failureReason);
  });
});


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
