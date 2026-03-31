import { useState } from 'react';
import './ProductCard.css';

function VariantThumb({ variant, isActive, isUnavailable, onSelect, productName }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <button
      type="button"
      className={`variant-thumb ${isActive ? 'variant-thumb-active' : ''} ${isUnavailable ? 'variant-thumb-unavailable' : ''}`}
      onClick={onSelect}
      title={`${variant.nombre}${isUnavailable ? ' (Agotado)' : ''}`}
      aria-label={`Ver foto de ${variant.nombre}, variante de ${productName}`}
      aria-pressed={isActive}
    >
      <span className="variant-thumb-frame">
        {!imgFailed && variant.imagen ? (
          <img
            src={variant.imagen}
            alt=""
            className="variant-thumb-img"
            loading="lazy"
            draggable={false}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span
            className="variant-thumb-fallback"
            style={{ background: `linear-gradient(145deg, ${variant.hex}, ${variant.hex}99)` }}
            aria-hidden
          />
        )}
        {isUnavailable && (
          <span className="variant-thumb-unavailable-mark" aria-hidden>✕</span>
        )}
      </span>
    </button>
  );
}

export default function ProductCard({ product }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selected = product.colores[selectedIndex];
  const isUnavailable = !selected.disponible;

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <div className="product-image-bg">
          <img
            src={selected.imagen}
            alt={`${product.nombre} — ${selected.nombre}`}
            className="product-img"
            onError={(e) => {
              e.target.style.display = 'none';
              const ph = e.target.nextElementSibling;
              if (ph) ph.style.display = 'flex';
            }}
          />
          <div className="product-img-placeholder" style={{ display: 'none' }}>
            <div
              className="placeholder-inner"
              style={{
                background: `linear-gradient(135deg, ${selected.hex}55, ${selected.hex}22)`,
                border: `2px solid ${selected.hex}44`,
              }}
            >
              <span className="placeholder-icon" aria-hidden>◧</span>
              <span className="placeholder-color-name">{selected.nombre}</span>
            </div>
          </div>
        </div>

        {isUnavailable && (
          <div className="product-unavailable-overlay">
            <div className="product-unavailable-badge">
              <span>Agotado</span>
            </div>
          </div>
        )}

        {!isUnavailable && (
          <div className="product-available-badge">
            <span>✓ Disponible</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.nombre}</h3>
        {product.descripcion && (
          <p className="product-desc">{product.descripcion}</p>
        )}

        <div className="product-variants">
          <span className="variants-label">
            Acabado: <strong>{selected.nombre}</strong>
          </span>
          <div className="variant-thumbs" role="group" aria-label="Variantes del producto (fotos)">
            {product.colores.map((variant, index) => (
              <VariantThumb
                key={index}
                variant={variant}
                isActive={index === selectedIndex}
                isUnavailable={!variant.disponible}
                onSelect={() => setSelectedIndex(index)}
                productName={product.nombre}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
