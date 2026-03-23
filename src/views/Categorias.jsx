import { Container, Row, Col } from "react-bootstrap";

const Categorias = () => {
  return (
    <Container className="mt-3">
      <Row className="align-items-center">
        <Col>
          <h2><i className="bi-tag-fill me-2"></i> Categorías</h2>
        </Col>
      </Row>
    </Container>
  );
};

export default Categorias;
