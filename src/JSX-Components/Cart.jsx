import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useCart } from './Services/CartContext';
import { useNavigate } from 'react-router-dom';
import AuthContext from './Services/AuthContext';

export default function Cart() {
    const { cartItems, removeFromCart, clearCart, isOpen, setIsOpen, updateQuantity } = useCart();
    const { isAuthenticated } = useContext(AuthContext);
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0);

    const handleCheckout = () => {
        setIsOpen(false);
        navigate('/checkout');
    };

    const handleLoginRedirect = () => {
        setIsOpen(false);
        navigate('/log-in');
    };

    return (
        <>
            {/* Overlay oscuro - cubre TODO incluyendo navbar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40"
                        style={{ top: 0, left: 0 }}
                    />
                )}
            </AnimatePresence>

            {/* Panel del carrito */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                        className="fixed right-0 top-0 h-screen w-full sm:max-w-md bg-white shadow-2xl z-100 flex flex-col"
                    >
                        {/* Header del carrito */}
                        <div className="bg-gray-600 text-white p-6 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <FaShoppingCart className="h-6 w-6" />
                                <h2 className="text-2xl font-bold">Tu carrito</h2>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <FaTimes className="h-6 w-6" />
                            </motion.button>
                        </div>

                        {/* Contenido del carrito */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {!isAuthenticated() ? (
                                // Mensaje de no autenticado
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center h-full text-center space-y-6"
                                >
                                    <FaShoppingCart className="h-16 w-16 text-gray-300" />
                                    <div className="space-y-3">
                                        <p className="text-lg font-light text-gray-800">
                                            Inicia sesión para añadir o comprar un producto.
                                        </p>
                                    </div>
                                </motion.div>
                            ) : cartItems.length === 0 ? (
                                // Carrito vacío autenticado
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center h-full text-gray-500"
                                >
                                    <FaShoppingCart className="h-12 w-12 mb-4 text-gray-300" />
                                    <p className="text-lg font-semibold">Tu carrito está vacío</p>
                                    <p className="text-sm mt-2">¡Agrega productos para comenzar!</p>
                                </motion.div>
                            ) : (
                                // Items en el carrito
                                <AnimatePresence mode="popLayout">
                                    {cartItems.map((item) => (
                                        <motion.div
                                            key={item.idProduct}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: 100 }}
                                            onMouseEnter={() => setHoveredItemId(item.idProduct)}
                                            onMouseLeave={() => setHoveredItemId(null)}
                                            className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
                                        >
                                            <div className="flex gap-3">
                                                {/* Imagen */}
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={item.imageProduct}
                                                        alt={item.productName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Información */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                                                        {item.productName}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        ${new Intl.NumberFormat('es-CO').format(item.productPrice)}
                                                    </p>

                                                    {/* Controles de cantidad */}
                                                    <div className="flex items-center gap-2 mt-3 bg-white rounded border border-gray-300">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => updateQuantity(item.idProduct, item.quantity - 1)}
                                                            className="p-1 text-gray-600 hover:text-gray-800"
                                                        >
                                                            −
                                                        </motion.button>
                                                        <span className="text-xs font-semibold w-6 text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => updateQuantity(item.idProduct, item.quantity + 1)}
                                                            className="p-1 text-gray-600 hover:text-gray-800"
                                                        >
                                                            +
                                                        </motion.button>
                                                    </div>
                                                </div>

                                                {/* Botón eliminar */}
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => removeFromCart(item.idProduct)}
                                                    className={`p-2 rounded transition-colors ${hoveredItemId === item.idProduct
                                                            ? 'bg-red-100 text-red-600'
                                                            : 'text-gray-400 hover:text-red-600'
                                                        }`}
                                                >
                                                    <FaTrash className="h-4 w-4" />
                                                </motion.button>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                                <p className="text-xs text-gray-600">
                                                    Subtotal: ${new Intl.NumberFormat('es-CO').format(item.productPrice * item.quantity)}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer del carrito */}
                        {!isAuthenticated() ? (
                            // Botón de login
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border-t border-gray-200 p-6 bg-gray-50"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleLoginRedirect}
                                    className="w-full bg-gray-600 text-white font-semibold py-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
                                >
                                    Ir a iniciar sesión
                                </motion.button>
                            </motion.div>
                        ) : cartItems.length > 0 ? (
                            // Botones de checkout
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border-t border-gray-200 p-6 space-y-4 bg-gray-50"
                            >
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${new Intl.NumberFormat('es-CO').format(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Envío</span>
                                        <span className="text-green-600 font-semibold">Gratis</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                                        <span>Total</span>
                                        <span className="text-lime-600">${new Intl.NumberFormat('es-CO').format(totalPrice)}</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCheckout}
                                    className="w-full bg-lime-600 text-white font-semibold py-3 rounded-lg hover:bg-lime-700 transition-all duration-200"
                                >
                                    Ir al checkout
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => clearCart()}
                                    className="w-full text-red-600 font-semibold py-2 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Limpiar carrito
                                </motion.button>
                            </motion.div>
                        ) : null}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}