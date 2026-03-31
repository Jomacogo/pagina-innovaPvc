import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import './Products.css';

export default function Products() {
  const { products } = useProducts();

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <span className="section-tag">Catálogo Innova PVC</span>
          <h1 className="heading-lg">Nuestros productos</h1>
          <p>Toca una miniatura para ver la foto de cada acabado y la disponibilidad</p>
        </div>

        {products.length === 0 ? (
          <div className="products-empty">
            <span>📦</span>
            <p>No hay productos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
