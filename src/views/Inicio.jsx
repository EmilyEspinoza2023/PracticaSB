import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const tarjetas = [
  {
    icono: "bi-bookmark-fill",
    label: "Módulo",
    titulo: "Categorías",
    ruta: "/categorias",
  },
  {
    icono: "bi-box-fill",
    label: "Módulo",
    titulo: "Productos",
    ruta: "/productos",
  },
  {
    icono: "bi-grid-fill",
    label: "Vista pública",
    titulo: "Catálogo",
    ruta: "/catalogo",
  },
];

const Inicio = () => {
  const navegar = useNavigate();
  const usuario = localStorage.getItem("usuario-supabase") || "Administrador";

  return (
    <Container className="mt-3 mb-5">
      <div className="inicio-hero">
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2>
            <i className="bi bi-house-fill me-2"></i> Bienvenido
          </h2>
          <p>{usuario}</p>
        </div>
      </div>

      <Row className="g-3">
        {tarjetas.map((t) => (
          <Col key={t.ruta} xs={12} sm={6} md={4}>
            <div className="inicio-stat-card" onClick={() => navegar(t.ruta)} style={{ cursor: "pointer" }}>
              <div className="inicio-stat-icono">
                <i className={`bi ${t.icono}`}></i>
              </div>
              <div className="inicio-stat-label">{t.label}</div>
              <p className="inicio-stat-titulo">{t.titulo}</p>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Inicio;
