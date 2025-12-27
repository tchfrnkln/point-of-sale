import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  platform: process.platform,
  print: (text: string) => {
    // send a message to main process to handle printing
    ipcRenderer.send("print", text);
  }
});
