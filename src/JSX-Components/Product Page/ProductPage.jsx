import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ProductServices from '../Services/ProductServices';
import ProductCard from '../ProductCard'; // Importar el ProductCard original
import { useCart } from '../Services/CartContext.jsx';
import AuthContext from '../Services/AuthContext.jsx';

const BASE_IMAGE_URL = "http://localhost:8080/uploads/"; // URL base para imágenes

export default function ProductPage() {
    const { id } = useParams(); // Obtén el id del producto desde la URL
    const { addToCart } = useCart(); // Usar la función para agregar al carrito
    const { isAuthenticated } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]); // Estado para productos relacionados
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const shuffleArray = (array) => {
        return array
            .map((item) => ({ ...item, sort: Math.random() })) // Agregar un valor aleatorio
            .sort((a, b) => a.sort - b.sort) // Ordenar por el valor aleatorio
            .map((item) => {
                delete item.sort; // Eliminar el valor aleatorio después de ordenar
                return item;
            });
    };

    const handleAddToCart = (product) => {
        if (!isAuthenticated) {
            return;
        }
        addToCart(product); // Llama a la función addToCart del contexto
    };

    useEffect(() => {
        // Llama al servicio para obtener los datos del producto
        const fetchProduct = async () => {
            try {
                const response = await ProductServices.getAllProducts(); // Obtén todos los productos
                const selectedProduct = response.data.find((p) => p.idProduct === parseInt(id)); // Busca el producto por ID
                if (selectedProduct) {
                    selectedProduct.imageProduct = `${BASE_IMAGE_URL}${selectedProduct.imageProduct}`;
                    setProduct(selectedProduct);

                    // Filtrar productos relacionados (por categoría o subcategoría)
                    const related = response.data
                        .filter((p) => p.idProduct !== parseInt(id))
                        .map((p) => ({
                            ...p,
                            imageProduct: `${BASE_IMAGE_URL}${p.imageProduct}`, // Construir URL completa para las imágenes relacionadas
                        }));

                    // Mezclar productos relacionados y limitar a 4
                    const shuffledRelated = shuffleArray(related).slice(0, 4);
                    setRelatedProducts(shuffledRelated);
                } else {
                    setError(true); // Marca error si no se encuentra el producto
                }
            } catch (err) {
                console.error('Error al obtener el producto:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-semibold text-gray-600">Cargando producto...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-semibold text-red-500">Error: Producto no encontrado.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 mb-25">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Galería de imágenes */}
                <div className="col-span-2">
                    <div className="flex flex-col gap-4">
                        <img
                            src={product.imageProduct}
                            alt={product.productName}
                            className="w-full max-h-[470px] object-contain mx-auto outline-2 outline-gray-300 rounded-lg shadow-md"
                        />
                    </div>
                </div>

                {/* Detalles del producto */}
                <div className="col-span-2 md:col-span-1 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.productName}</h1>
                        <p className="text-lg text-gray-600 mb-6">{product.productDescription}</p>
                        <p className="text-sm text-gray-500">
                            Categoría: <span className="font-medium">{product.categoriaProduct}</span>
                        </p>
                        {product.subCategoriaProduct && (
                            <p className="text-sm text-gray-500">
                                Subcategoría: <span className="font-medium">{product.subCategoriaProduct}</span>
                            </p>
                        )}
                    </div>

                    {/* Contenedor de precio y acciones */}
                    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                        <p className="text-4xl font-semibold text-lime-600 mb-4">
                            {new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                            }).format(product.productPrice)}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">Envío gratis a todo el país</p>
                        <div className="flex flex-col gap-4">
                            <button
                                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
                                onClick={() => alert('Compra realizada')}
                            >
                                Comprar ahora
                            </button>
                            <button
                                className="bg-lime-600 text-white py-2 px-4 rounded-md hover:bg-lime-700 transition-colors duration-200"
                                onClick={() => handleAddToCart(product)} // Llama a addToCart
                            >
                                Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Apartado de "Te podría interesar" */}
            <div className="mt-15">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Te podría interesar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {relatedProducts.map((relatedProduct) => (
                        <ProductCard
                            key={relatedProduct.idProduct}
                            idProduct={relatedProduct.idProduct}
                            productName={relatedProduct.productName}
                            productPrice={new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                            }).format(relatedProduct.productPrice)}
                            productDescription={relatedProduct.productDescription}
                            imageUrl={relatedProduct.imageProduct}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}