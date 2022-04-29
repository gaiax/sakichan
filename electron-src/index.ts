// Native
import { join } from "path";
import { format } from "url";
import fs from "fs";
import { Buffer } from "buffer";
import axios, { AxiosResponse, AxiosError } from "axios";

// Packages
import { BrowserWindow, app, ipcMain } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, "preload.js"),
    },
  });

  const url = isDev
    ? "http://localhost:8000/"
    : format({
      pathname: join(__dirname, "../renderer/out/index.html"),
      protocol: "file:",
      slashes: true,
    });

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (message: any) => {
  console.log(message)

  axios.post('http://localhost:50021/audio_query', {}, {
    params: {
      speaker: 1,
      text: "test"
    }
  })
    .then(function (res: AxiosResponse) {
      console.log(res.data);
      axios.post('http://localhost:50021/synthesis', res.data, {
        params: {
          speaker: "1",
          enable_interrogative_upspeak: "yes",
        },
        responseType: 'arraybuffer'
      })
        .then(function (res: AxiosResponse) {
          console.log(res.data.length);// res.dataが音声ファイルの中身
          fs.writeFileSync(`./sound.wav`, Buffer.from(res.data), 'binary');
        })
        .catch((e: AxiosError<{ error: string }>) => {
          // エラー処理
          console.log(e.message);
        })
    })
    .catch((e: AxiosError<{ error: string }>) => {
      // エラー処理
      console.log(e.message);
    })
})
