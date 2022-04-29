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

const IndexPage = () => {
  const [text, setText] = useState("");
  const onChangeInputText: ChangeEventHandler<HTMLInputElement> = (e) => {
    setText(e.target.value);
  };

  const onClickSay = () => {
    global.ipcRenderer.send("message", text);
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
          <Col className="text-end">
            <Button onClick={onClickSay}>しゃべる</Button>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default IndexPage;
