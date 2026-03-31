import { Link } from 'react-router-dom';
import logoInnova from '../assets/Logo-innovaPvc.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img
            src={logoInnova}
            alt="Innova PVC"
            className="footer-logo-img"
            width={160}
            height={54}
            decoding="async"
          />
          <p>Soluciones en PVC para construcción e industria. Calidad técnica y servicio cercano.</p>
        </div>

        <div className="footer-links">
          <h4>Navegación</h4>
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
        </div>

        <div className="footer-contact">
          <h4>Contacto</h4>
          <p>📍 Calle 31 # 33-24 <br /> El Carmen de Viboral, Antioquia</p>
          <p>📱 +57 320 557 00 93</p>
          <p>✉️ innovapvc2026@gmail.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Innova PVC. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
