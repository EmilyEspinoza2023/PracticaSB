import { Container, Row, Col } from "react-bootstrap";

const Productos = () => {
  return (
    <Container className="mt-3">
      <Row className="align-items-center">
        <Col>
          <h2><i className="bi-box-fill me-2"></i> Productos</h2>
        </Col>
      </Row>
    </Container>
  );
};

export default Productos;
