import React, { useEffect, useState } from "react";
import ProductServices from "../Services/ProductServices";
import ProductCardInicio from "../ProductCardInicio";

const BASE_IMAGE_URL = "http://localhost:8080/uploads/";

const CatalogoOfertas = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const formatPrice = (productPrice) => {
        console.log("Formateando precio:", productPrice); // Verifica el valor recibido
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(productPrice);
    };


    useEffect(() => {
        ProductServices.getAllProducts()
            .then(response => {
                // Procesar los productos en una sola operación
                const selectedProducts = response.data
                    .filter(product => product.enOferta) // Filtrar productos en oferta
                    .map(product => ({
                        ...product,
                        imageProduct: `${BASE_IMAGE_URL}${product.imageProduct}` // Construir la URL completa
                    }))
                    .sort(() => 0.5 - Math.random()) // Mezclar los productos
                    .slice(0, 9); // Tomar los primeros 9 productos

                // Actualizar el estado con los productos seleccionados
                setProducts(selectedProducts);
                setLoading(false);
                setError(false);
            })
            .catch(error => {
                console.log("Error al obtener los productos:", error);
                setLoading(true);
                setError(true);
            });
    }, []);

    return (
        <div className="max-w-5xl mx-auto py-10">
            <h1 className="text-3xl font-bold text-center mb-6">Ofertas del día</h1>
            {loading && <p>Cargando productos...</p>}
            {error && <p>Hubo un error al obtener los productos</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCardInicio
                        key={product.idProduct}
                        idProduct={product.idProduct}
                        productName={product.productName}
                        productPrice={formatPrice(product.productPrice)}
                        productDescription={product.productDescription}
                        imageUrl={product.imageProduct}
                        enOferta={product.enOferta}
                    />
                ))}
            </div>
        </div>
    );
};

export default CatalogoOfertas;
