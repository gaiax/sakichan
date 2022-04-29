import { useEffect } from "react";
import Layout from "../components/Layout";
import { WindowSize } from "../interfaces";
import { Container, Row, Col, Button, Tabs, Tab } from "react-bootstrap";

const SettingPage = () => {
  useEffect(() => {
    const windowSize: WindowSize = { width: 400, height: 500 };
    global.ipcRenderer.send("change-window-size", windowSize);
  }, []);
  return (
    <Layout title="設定">
      <Container>
        <Row>
          <Col xs={3}>
            <Button>戻る</Button>
          </Col>
          <Col>
            <h2>設定</h2>
          </Col>
        </Row>
        <Row className="mt-3">
          <Tabs defaultActiveKey="teikei">
            <Tab eventKey="teikei" title="定型文"></Tab>
            <Tab eventKey="character" title="キャラクター"></Tab>
            <Tab eventKey="dictionary" title="ユーザー辞書"></Tab>
          </Tabs>
        </Row>
      </Container>
    </Layout>
  );
};

export default SettingPage;
