import { Container, Row, Col } from "react-bootstrap";

const Pagina404 = () => {
  return (
    <Container className="mt-3">
      <Row className="align-items-center">
        <Col>
          <h2><i className="bi-exclamation-triangle-fill me-2"></i> Página no encontrada</h2>
        </Col>
      </Row>
    </Container>
  );
};

export default Pagina404;
