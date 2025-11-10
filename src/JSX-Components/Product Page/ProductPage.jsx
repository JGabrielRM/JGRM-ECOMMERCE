import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductServices from '../Services/ProductServices';
import ProductCard from '../ProductCard';
import { useCart } from '../Services/CartContext.jsx';
import AuthContext from '../Services/AuthContext.jsx';
import ProductReviews from './ProductReviews';

const BASE_IMAGE_URL = "http://localhost:8080/uploads/";

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, setIsOpen } = useCart();
    const { isAuthenticated } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const shuffleArray = (array) => {
        return array
            .map((item) => ({ ...item, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map((item) => {
                delete item.sort;
                return item;
            });
    };

    const handleAddToCart = (product) => {
        if (!isAuthenticated()) {
            setIsOpen(true);
            return;
        }
        addToCart(product);
    };

    const handleBuyNow = () => {
        if (!isAuthenticated()) {
            setIsOpen(true);
            return;
        }
        addToCart(product);
        navigate('/checkout');
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await ProductServices.getAllProducts();
                const selectedProduct = response.data.find((p) => p.idProduct === parseInt(id));
                if (selectedProduct) {
                    selectedProduct.imageProduct = `${BASE_IMAGE_URL}${selectedProduct.imageProduct}`;
                    setProduct(selectedProduct);

                    const related = response.data
                        .filter((p) => p.idProduct !== parseInt(id))
                        .map((p) => ({
                            ...p,
                            imageProduct: `${BASE_IMAGE_URL}${p.imageProduct}`,
                        }));

                    const shuffledRelated = shuffleArray(related).slice(0, 4);
                    setRelatedProducts(shuffledRelated);
                } else {
                    setError(true);
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

    const { imageProduct: imageUrl, productName, productDescription, categoriaProduct, subCategoriaProduct, productPrice } = product;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 mb-25">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Imagen del producto sin zoom */}
                <div className="space-y-4">
                    <div className="h-96 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                        <img 
                            src={imageUrl} 
                            alt={productName}
                            className="w-full h-full object-contain p-4"
                        />
                    </div>
                    
                    {/* Miniaturas */}
                    <div className="flex space-x-2">
                        <div className="h-20 w-20 bg-gray-300 rounded-lg cursor-pointer hover:opacity-80 border border-gray-400">
                            <img src={imageUrl} alt="Thumbnail 1" className="w-full h-full object-contain rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Información del producto */}
                <div className="space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{productName}</h1>
                        <p className="text-lg text-gray-600 mb-6">{productDescription}</p>
                        <p className="text-sm text-gray-500">
                            Categoría: <span className="font-medium">{categoriaProduct}</span>
                        </p>
                        {subCategoriaProduct && (
                            <p className="text-sm text-gray-500">
                                Subcategoría: <span className="font-medium">{subCategoriaProduct}</span>
                            </p>
                        )}
                    </div>

                    {/* Contenedor de precio y acciones */}
                    <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-gray-200">
                        <p className="text-4xl font-semibold text-lime-600 mb-4">
                            {new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                            }).format(productPrice)}
                        </p>
                        <p className="text-sm text-gray-500 mb-6 flex items-center space-x-1">
                            <span>✓</span>
                            <span>Envío gratis a todo el país</span>
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                className="w-full bg-slate-800 text-white py-3 px-4 rounded-md hover:bg-slate-900 transition-all duration-200 font-semibold transform hover:scale-105 active:scale-95"
                                onClick={handleBuyNow}
                            >
                                Comprar ahora
                            </button>
                            <button
                                className="w-full bg-lime-600 text-white py-3 px-4 rounded-md hover:bg-lime-700 transition-all duration-200 font-semibold transform hover:scale-105 active:scale-95"
                                onClick={() => handleAddToCart(product)}
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

            {/* Apartado de opiniones */}
            <ProductReviews productId={id} />
        </div>
    );
}