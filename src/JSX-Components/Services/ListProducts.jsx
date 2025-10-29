import React, { useEffect, useState } from 'react';
import ProductServices from './ProductServices';
import ProductCard from '../ProductCard';

const BASE_IMAGE_URL = "http://localhost:8080/uploads/"; // URL base para imágenes

const ListProducts = ({ filters, searchTerm, setSearchTerm }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const formatPrice = (productPrice) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(productPrice);
  };

  useEffect(() => {
    ProductServices.getAllProducts()
      .then((response) => {
        // Concatena la URL base con el nombre de la imagen recibido
        const productsWithFullImageUrl = response.data.map((product) => ({
          ...product,
          imageProduct: `${BASE_IMAGE_URL}${product.imageProduct}`,
        }));
        setProducts(productsWithFullImageUrl);
        setLoading(false);
        setError(false);
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
        setLoading(false);
        setError(true);
      });
  }, []);

  // Filtrar productos según los filtros y el término de búsqueda
  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm =
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !filters.category ||
      (product.categoriaProduct &&
       product.categoriaProduct.toLowerCase() === filters.category.toLowerCase());

    const matchesSubcategory =
      !filters.subcategory ||
      (product.subCategoriaProduct &&
       product.subCategoriaProduct.toLowerCase() === filters.subcategory.toLowerCase());

    const matchesPrice =
      product.productPrice >= filters.priceRange[0] &&
      product.productPrice <= filters.priceRange[1];

    const matchesOnSale = !filters.onSale || product.enOferta;

    return matchesSearchTerm && matchesCategory && matchesSubcategory && matchesPrice && matchesOnSale;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Actualizar el término de búsqueda
  };

  return (
    <div>
      {loading && <p>Cargando productos...</p>}
      {error && <p>Hubo un error al obtener los productos</p>}
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border bg-white border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 block"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.idProduct}
              idProduct={product.idProduct}
              productName={product.productName}
              productPrice={formatPrice(product.productPrice)}
              productDescription={product.productDescription}
              imageUrl={product.imageProduct}
            />
          ))}
          {filteredProducts.length === 0 && (
            <p>No se encontraron productos con los filtros aplicados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListProducts;
