import { ChangeEventHandler, useState } from "react";
import Layout from "../components/Layout";
import {
  Button,
  ButtonGroup,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useRouter } from "next/router";

const IndexPage = () => {
  const router = useRouter();
  const [text, setText] = useState("");
  const onChangeInputText: ChangeEventHandler<HTMLInputElement> = (e) => {
    setText(e.target.value);
  };
  const [speaker, setSpeaker] = useState(9);

  const onClickSay = () => {
    global.ipcRenderer.send("message", {
      text: text,
      speaker: speaker,
    });
  };
  const onClickSettings = () => {
    router.push("/settings");
  };

  return (
    <Layout title="サキちゃん">
      <Container fluid>
        <Row className="mt-1">
          <Form>
            <Form.Control as="textarea" rows={2} onChange={onChangeInputText} />
          </Form>
        </Row>
        <Row className="mt-1">
          <Col>
            <ButtonGroup>
              <Button>1</Button>
              <Button>2</Button>
              <Button>3</Button>
            </ButtonGroup>
          </Col>
          <Col>
            <Button variant="secondary" onClick={onClickSettings}>
              設定
            </Button>
          </Col>
          <Col className="text-end">
            <Button onClick={onClickSay}>しゃべる</Button>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default IndexPage;
