import { useEffect } from "react";
import Layout from "../components/Layout";
import { WindowSize } from "../interfaces";

const SettingPage = () => {
  useEffect(() => {
    const windowSize: WindowSize = { width: 400, height: 500 };
    global.ipcRenderer.send("change-window-size", windowSize);
  }, []);
  return (
    <Layout title="設定">
      <h1>設定</h1>
    </Layout>
  );
};

export default SettingPage;
