import { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import initialProducts from '../data/products.json';

const ProductContext = createContext();
const STORAGE_KEY = 'catalogo_productos';

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = collection(db, 'products');
    
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      if (snapshot.empty) {
        // Fallback local: si firebase está vacío, intentamos cargar de localStorage
        let fallback = initialProducts;
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              fallback = parsed;
            }
          }
        } catch (e) {
          console.error("Error leyendo localStorage:", e);
        }
        setProducts(fallback);
        setLoading(false);
      } else {
        const productsData = snapshot.docs.map(doc => ({ ...doc.data(), id: Number(doc.id) }));
        // Ordenamos por ID
        productsData.sort((a, b) => a.id - b.id);
        setProducts(productsData);
        setLoading(false);
      }
    }, (error) => {
      console.error("Error sincronizando con Firebase:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (product) => {
    try {
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      const productToSave = { ...product, id: newId };
      await setDoc(doc(db, 'products', newId.toString()), productToSave);
    } catch (e) {
      console.error("Error agregando producto:", e);
      if (e.code === 'resource-exhausted') alert("Error: Las imágenes pueden ser demasiado grandes para Firestore.");
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      await updateDoc(doc(db, 'products', id.toString()), updatedProduct);
    } catch (e) {
      console.error("Error actualizando producto:", e);
      if (e.code === 'not-found') {
        // En caso de que se intente actualizar algo local que no está en la nube, lo forzamos a crearse
        await setDoc(doc(db, 'products', id.toString()), { ...updatedProduct, id });
      }
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id.toString()));
    } catch (e) {
      console.error("Error eliminando producto:", e);
    }
  };

  const toggleAvailability = async (productId, colorIndex) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newColors = [...product.colores];
    newColors[colorIndex] = {
      ...newColors[colorIndex],
      disponible: !newColors[colorIndex].disponible
    };
    
    try {
      await updateDoc(doc(db, 'products', productId.toString()), { colores: newColors });
    } catch (e) {
      console.error("Error actualizando disponibilidad:", e);
    }
  };

  const addColor = async (productId, color) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    try {
      await updateDoc(doc(db, 'products', productId.toString()), { colores: [...product.colores, color] });
    } catch (e) {
      console.error("Error agregando color:", e);
      if (e.code === 'resource-exhausted') alert("Error: La imagen es demasiado grande para guardar en Firestore.");
    }
  };

  const removeColor = async (productId, colorIndex) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const newColors = product.colores.filter((_, i) => i !== colorIndex);
    try {
      await updateDoc(doc(db, 'products', productId.toString()), { colores: newColors });
    } catch (e) {
      console.error("Error eliminando color:", e);
    }
  };

  // Función para subir el estado local a la base de datos (migración)
  const syncLocalToCloud = async () => {
    try {
      const batch = writeBatch(db);
      products.forEach(p => {
        const docRef = doc(db, 'products', p.id.toString());
        batch.set(docRef, p);
      });
      await batch.commit();
      alert("¡Catálogo sincronizado a la nube exitosamente!");
    } catch (e) {
      console.error("Error al sincronizar:", e);
      if (e.code === 'resource-exhausted') alert("Error: Algunas imágenes son demasiado grandes. Se superó el límite de la cuota (1MB por producto). Disminuye su peso.");
      else alert("Hubo un error al sincronizar con la nube.");
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleAvailability,
      addColor,
      removeColor,
      syncLocalToCloud
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
