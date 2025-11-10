import React, { useContext } from 'react';
import { CartContext } from '../Services/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Checkout() {
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0);

    return (
        <div className="max-w-4xl mx-auto p-6 mt-10 mb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>

                {/* Resumen del carrito */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de compra</h2>
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.idProduct} className="flex justify-between items-center border-b pb-4">
                                <div>
                                    <p className="font-semibold text-gray-800">{item.productName}</p>
                                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">
                                    ${new Intl.NumberFormat('es-CO').format(item.productPrice * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t-2 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-lime-600">${new Intl.NumberFormat('es-CO').format(totalPrice)}</span>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 transition"
                    >
                        Seguir comprando
                    </button>
                    <button
                        className="flex-1 bg-lime-600 text-white py-3 rounded-lg hover:bg-lime-700 transition font-semibold"
                    >
                        Procesar pago
                    </button>
                </div>
            </motion.div>
        </div>
    );
}