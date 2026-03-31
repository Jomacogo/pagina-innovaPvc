import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import './Admin.css';

const emptyProduct = { nombre: '', descripcion: '', colores: [] };
const emptyColor = { nombre: '', hex: '#f88e02', imagen: '', disponible: true };

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, toggleAvailability, addColor, removeColor, syncLocalToCloud } = useProducts();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState('list'); // 'list' | 'form'
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [newColor, setNewColor] = useState(emptyColor);
  const [addingColorTo, setAddingColorTo] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  /* ===== FORM HANDLERS ===== */
  const openAddForm = () => {
    setEditingProduct(null);
    setFormData(emptyProduct);
    setView('form');
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setView('form');
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    setView('list');
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  /* ===== COLOR MANAGEMENT IN FORM ===== */
  const addColorInForm = () => {
    if (!newColor.nombre.trim()) return;
    setFormData(prev => ({ ...prev, colores: [...prev.colores, { ...newColor }] }));
    setNewColor(emptyColor);
  };

  const removeColorInForm = (index) => {
    setFormData(prev => ({
      ...prev,
      colores: prev.colores.filter((_, i) => i !== index)
    }));
  };

  const toggleAvailabilityInForm = (index) => {
    setFormData(prev => {
      const newColors = [...prev.colores];
      newColors[index] = { ...newColors[index], disponible: !newColors[index].disponible };
      return { ...prev, colores: newColors };
    });
  };

  /* ===== ADD COLOR INLINE (from list view) ===== */
  const handleInlineAddColor = (productId) => {
    if (!newColor.nombre.trim()) return;
    addColor(productId, { ...newColor });
    setNewColor(emptyColor);
    setAddingColorTo(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /* Helper: thumbnail or path display */
  const renderImageCell = (imagen) => {
    if (!imagen) return <span className="img-path">— Sin foto</span>;
    if (imagen.startsWith('data:')) {
      return <img src={imagen} alt="preview" className="table-thumb" />;
    }
    return <span className="img-path">{imagen}</span>;
  };

  /* ===== RENDER FORM ===== */
  const renderForm = () => (
    <div className="admin-form-page">
      <div className="admin-form-header">
        <button className="btn btn-secondary btn-sm" onClick={() => setView('list')}>
          ← Volver
        </button>
        <h2>{editingProduct ? `Editar: ${editingProduct.nombre}` : 'Agregar Producto'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="admin-form card">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Nombre del producto *</label>
            <input
              className="form-input"
              value={formData.nombre}
              onChange={(e) => handleFormChange('nombre', e.target.value)}
              placeholder="Ej: Marmol, Madera"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <input
              className="form-input"
              value={formData.descripcion || ''}
              onChange={(e) => handleFormChange('descripcion', e.target.value)}
              placeholder="Descripción breve del producto"
            />
          </div>
        </div>

        {/* COLORS IN FORM */}
        <div className="admin-colors-section">
          <div className="admin-section-title">
            <span>🎨 Colores ({formData.colores.length}) — agrega las fotos de tu producto</span>
          </div>

          {/* Already added colors */}
          <div className="admin-color-list">
            {formData.colores.map((color, index) => (
              <div key={index} className="admin-color-item">
                {color.imagen
                  ? <img src={color.imagen} alt={color.nombre} className="color-item-thumb" />
                  : <div className="color-dot" style={{ backgroundColor: color.hex }} />
                }
                <span className="color-item-name">{color.nombre}</span>
                <span className={`badge ${color.disponible ? 'badge-success' : 'badge-danger'}`}>
                  {color.disponible ? 'Disponible' : 'Agotado'}
                </span>
                <div className="color-item-actions">
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => toggleAvailabilityInForm(index)}
                    title="Cambiar disponibilidad"
                  >
                    ⇄
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => removeColorInForm(index)}
                    title="Eliminar color"
                    style={{ color: 'var(--danger)' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ADD NEW COLOR */}
          <div className="add-color-form">
            <p className="add-color-heading">➕ Nuevo color / variante</p>
            <div className="add-color-fields">
              <div className="form-group">
                <label className="form-label">Nombre del color</label>
                <input
                  className="form-input"
                  placeholder="Ej: Rojo, Azul marino..."
                  value={newColor.nombre}
                  onChange={(e) => setNewColor(p => ({ ...p, nombre: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Color de referencia (swatch)</label>
                <div className="color-picker-group">
                  <input
                    type="color"
                    className="color-picker"
                    value={newColor.hex}
                    onChange={(e) => setNewColor(p => ({ ...p, hex: e.target.value }))}
                    title="Selecciona el color"
                  />
                  <span className="color-picker-value">{newColor.hex}</span>
                </div>
              </div>

              <div className="form-group upload-col">
                <label className="form-label">📷 Foto del producto</label>
                <ImageUploader
                  currentImage={newColor.imagen}
                  onImageSelect={(base64) => setNewColor(p => ({ ...p, imagen: base64 }))}
                  label="Subir foto de este color"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Disponibilidad</label>
                <label className="availability-toggle availability-toggle-lg">
                  <input
                    type="checkbox"
                    checked={newColor.disponible}
                    onChange={(e) => setNewColor(p => ({ ...p, disponible: e.target.checked }))}
                  />
                  <span>{newColor.disponible ? '✓ Disponible' : '✗ Agotado'}</span>
                </label>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={addColorInForm}
              style={{ marginTop: '0.75rem' }}
            >
              + Agregar este color al producto
            </button>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setView('list')}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );

  /* ===== RENDER LIST ===== */
  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <div className="container admin-topbar-inner">
          <div>
            <h1 className="admin-title">Panel de Admin</h1>
            <span className="admin-subtitle">{products.length} productos en catálogo</span>
          </div>
          <div className="admin-header-actions">
            <button className="btn btn-success" onClick={syncLocalToCloud} title="Sincronizar a la base de datos">
              ☁️ Subir a la nube
            </button>
            <button className="btn btn-primary" onClick={openAddForm}>
              + Nuevo Producto
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="container admin-content">
        {view === 'form' ? renderForm() : (
          <div className="admin-list">
            {products.length === 0 ? (
              <div className="admin-empty card">
                <span>📦</span>
                <p>No hay productos. Crea el primero.</p>
                <button className="btn btn-primary" onClick={openAddForm}>
                  + Agregar Producto
                </button>
              </div>
            ) : (
              products.map(product => (
                <div key={product.id} className="admin-product-card card">
                  <div className="admin-product-header">
                    <div className="admin-product-meta">
                      <button
                        className="expand-btn"
                        onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                      >
                        {expandedProduct === product.id ? '▼' : '▶'}
                      </button>
                      <div>
                        <h3 className="admin-product-name">{product.nombre}</h3>
                        {product.descripcion && (
                          <p className="admin-product-desc">{product.descripcion}</p>
                        )}
                        <div className="admin-color-dots">
                          {product.colores.map((c, i) => (
                            c.imagen && c.imagen.startsWith('data:')
                              ? <img key={i} src={c.imagen} alt={c.nombre} className="color-thumb-mini" title={c.nombre} />
                              : <div key={i} className="color-dot" style={{ backgroundColor: c.hex }} title={c.nombre} />
                          ))}
                          <span className="colors-count">{product.colores.length} colores</span>
                        </div>
                      </div>
                    </div>
                    <div className="admin-product-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEditForm(product)}>
                        ✏️ Editar
                      </button>
                      {deleteConfirm === product.id ? (
                        <div className="delete-confirm">
                          <span>¿Eliminar?</span>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}>
                            Sí
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>
                            No
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(product.id)}>
                          🗑️ Eliminar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* EXPANDED: color table */}
                  {expandedProduct === product.id && (
                    <div className="admin-colors-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Foto</th>
                            <th>Color</th>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.colores.map((color, idx) => (
                            <tr key={idx}>
                              <td>
                                {color.imagen && color.imagen.startsWith('data:')
                                  ? <img src={color.imagen} alt={color.nombre} className="table-thumb" />
                                  : <span className="text-muted" style={{ fontSize: '0.78rem' }}>Sin foto</span>
                                }
                              </td>
                              <td>
                                <div className="color-dot" style={{ backgroundColor: color.hex }} />
                              </td>
                              <td>{color.nombre}</td>
                              <td>
                                <span className={`badge ${color.disponible ? 'badge-success' : 'badge-danger'}`}>
                                  {color.disponible ? 'Disponible' : 'Agotado'}
                                </span>
                              </td>
                              <td>
                                <div className="flex gap-1">
                                  <button
                                    className={`btn btn-sm ${color.disponible ? 'btn-danger' : 'btn-success'}`}
                                    onClick={() => toggleAvailability(product.id, idx)}
                                  >
                                    {color.disponible ? 'Marcar agotado' : 'Marcar disponible'}
                                  </button>
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => removeColor(product.id, idx)}
                                  >
                                    ✕
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* INLINE ADD COLOR WITH UPLOAD */}
                      {addingColorTo === product.id ? (
                        <div className="inline-add-color">
                          <p className="add-color-heading">➕ Agregar color</p>
                          <div className="add-color-fields">
                            <div className="form-group">
                              <label className="form-label">Nombre</label>
                              <input
                                className="form-input"
                                placeholder="Nombre del color"
                                value={newColor.nombre}
                                onChange={(e) => setNewColor(p => ({ ...p, nombre: e.target.value }))}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Swatch</label>
                              <div className="color-picker-group">
                                <input
                                  type="color"
                                  className="color-picker"
                                  value={newColor.hex}
                                  onChange={(e) => setNewColor(p => ({ ...p, hex: e.target.value }))}
                                />
                                <span className="color-picker-value">{newColor.hex}</span>
                              </div>
                            </div>
                            <div className="form-group upload-col">
                              <label className="form-label">📷 Foto</label>
                              <ImageUploader
                                currentImage={newColor.imagen}
                                onImageSelect={(base64) => setNewColor(p => ({ ...p, imagen: base64 }))}
                                label="Subir foto"
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Estado</label>
                              <label className="availability-toggle">
                                <input
                                  type="checkbox"
                                  checked={newColor.disponible}
                                  onChange={(e) => setNewColor(p => ({ ...p, disponible: e.target.checked }))}
                                />
                                <span>Disponible</span>
                              </label>
                            </div>
                          </div>
                          <div className="flex gap-1" style={{ marginTop: '0.75rem' }}>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleInlineAddColor(product.id)}
                            >
                              Agregar
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => { setAddingColorTo(null); setNewColor(emptyColor); }}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm add-color-btn"
                          onClick={() => { setAddingColorTo(product.id); setNewColor(emptyColor); }}
                        >
                          + Agregar Color / Foto
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
