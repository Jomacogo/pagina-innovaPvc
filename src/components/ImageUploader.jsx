import { useRef, useState } from 'react';
import './ImageUploader.css';

/**
 * Componente para subir imágenes de productos.
 * Convierte la imagen a Base64 y llama onImageSelect(base64String).
 */
export default function ImageUploader({ currentImage, onImageSelect, label = 'Subir foto' }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const MAX_SIZE_MB = 5;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  const processFile = (file) => {
    setError('');

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Formato no válido. Usa JPG, PNG o WEBP.');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`La imagen no debe superar ${MAX_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setPreview(base64);
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelect('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="image-uploader">
      <div
        className={`upload-zone ${isDragging ? 'upload-zone-drag' : ''} ${preview ? 'upload-zone-has-image' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <>
            <img src={preview} alt="Vista previa" className="upload-preview" />
            <div className="upload-overlay">
              <span className="upload-change-text">📷 Cambiar foto</span>
            </div>
            <button
              type="button"
              className="upload-remove-btn"
              onClick={handleRemove}
              title="Eliminar imagen"
            >
              ✕
            </button>
          </>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">📷</div>
            <p className="upload-label">{label}</p>
            <p className="upload-hint">Arrastra aquí o haz clic para seleccionar</p>
            <p className="upload-formats">JPG, PNG, WEBP — máx {MAX_SIZE_MB}MB</p>
          </div>
        )}
      </div>

      {error && <p className="upload-error">⚠ {error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="upload-input-hidden"
        tabIndex={-1}
      />
    </div>
  );
}
