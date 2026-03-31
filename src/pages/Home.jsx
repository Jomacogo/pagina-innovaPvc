import { Link } from 'react-router-dom';
import './Home.css';
import logoInnova from '../assets/Logo-innovaPvc.png';

const features = [
  {
    icon: '◆',
    title: 'PVC de calidad industrial',
    desc: 'Materiales resistentes y homologados para obra, instalación y proyectos exigentes.',
  },
  {
    icon: '◇',
    title: 'Variedad de acabados',
    desc: 'Opciones y variantes pensadas para adaptarse a cada tipo de instalación.',
  },
  {
    icon: '◈',
    title: 'Cobertura local',
    desc: 'Logística y despachos orientados a entregar eficientemente en El Carmen de Viboral.',
  },
  {
    icon: '⬡',
    title: 'Asesoría técnica',
    desc: 'Acompañamiento para elegir soluciones adecuadas a tu proyecto.',
  },
];

export default function Home() {
  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
        </div>
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="hero-badge">Soluciones profesionales</div>
            <h1 className="heading-xl hero-title">
              Innovación en cada
              <br />
              <span className="gradient-text-accent">proyecto PVC</span>
            </h1>
            <p className="hero-subtitle">
              Productos para construcción y aplicaciones industriales con enfoque técnico,
              durabilidad y un servicio pensado para profesionales.
            </p>
            <div className="hero-actions">
              <Link to="/productos" className="btn btn-primary">
                Ver catálogo →
              </Link>
              <a href="#features" className="btn btn-secondary">
                Conoce más
              </a>
            </div>
          </div>
          <div className="hero-banner" aria-hidden="true">
            <div className="hero-banner-frame">
              <div className="hero-banner-placeholder">
                <span className="hero-banner-label">Imagen / banner</span>
                <p className="hero-banner-hint">
                  <img src={logoInnova} alt="logoInnova" />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span>Desplázate</span>
          <div className="scroll-dot" />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section features-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">Compromiso Innova PVC</span>
            <h2 className="heading-lg">Ingeniería y confianza</h2>
            <p className="text-muted" style={{ marginTop: '0.75rem' }}>
              Precisión, materiales confiables y acompañamiento en tu proyecto
            </p>
          </div>
          <div className="grid-4 features-grid" style={{ marginTop: '3rem' }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-orb" />
            <span className="section-tag">Catálogo completo</span>
            <h2 className="heading-lg">Explora el catálogo</h2>
            <p className="text-muted">
              Consulta disponibilidad, variantes y especificaciones de cada línea.
            </p>
            <Link to="/productos" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
