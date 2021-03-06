// Native
import { join } from "path";
import { format } from "url";
import fs from "fs";
import { Buffer } from "buffer";
import axios, { AxiosResponse, AxiosError } from "axios";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import { playWav } from "./audio/player";
let mainWindow: BrowserWindow;
// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  mainWindow = new BrowserWindow({
    width: 400,
    height: 130,
    useContentSize: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, "preload.js"),
    },
    alwaysOnTop: true,
  });

  mainWindow.setMenu(null); //メニューバーの削除

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
ipcMain.on(
  "message",
  (event: IpcMainEvent, params: { text: string; speaker: number }) => {
    console.log(event);
    console.log(params);
    axios
      .post(
        "http://localhost:50021/audio_query",
        {},
        {
          params,
        }
      )
      .then(function (res: AxiosResponse) {
        console.log(res.data);
        axios
          .post("http://localhost:50021/synthesis", res.data, {
            params: {
              speaker: params.speaker,
              enable_interrogative_upspeak: "yes",
            },
            responseType: "arraybuffer",
          })
          .then(function (res: AxiosResponse) {
            console.log(res.data.length); // res.dataが音声ファイルの中身
            fs.writeFileSync(`./sound.wav`, Buffer.from(res.data), "binary");
            playWav(`./sound.wav`);
          })
          .catch((e: AxiosError<{ error: string }>) => {
            // エラー処理
            console.log(e.message);
          });
      })
      .catch((e: AxiosError<{ error: string }>) => {
        // エラー処理
        console.log(e.message);
      });
  }
);

ipcMain.on("open-setting", (event: IpcMainEvent) => {
  console.log(event);
  const settingWindow = new BrowserWindow({
    parent: mainWindow,
    width: 400,
    height: 400,
    useContentSize: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, "preload.js"),
    },
    alwaysOnTop: true,
  });
  settingWindow.setMenu(null); //メニューバーの削除

  const url = isDev
    ? "http://localhost:8000/settings"
    : format({
        pathname: join(__dirname, "../renderer/out/settings.html"),
        protocol: "file:",
        slashes: true,
      });

  settingWindow.loadURL(url);
});
