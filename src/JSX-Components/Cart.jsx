import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from './Services/CartContext.jsx';
import { useContext } from 'react';
import AuthContext from './Services/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa'; // Importar íconos

export default function Cart() {
    const { cart, isCartOpen, closeCart, addToCart, removeFromCart, clearCart } = useCart();
    const { isAuthenticated } = useContext(AuthContext); // Verificar si el usuario está autenticado
    const navigate = useNavigate();

    const calculateSubtotal = () => {
        return cart.reduce((total, product) => total + product.productPrice * product.quantity, 0);
    };

    return (
        <Transition show={isCartOpen} as={React.Fragment}>
            <Dialog open={isCartOpen} onClose={closeCart} className="relative z-50">
                {/* Fondo con animación */}
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-20"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-20"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black opacity-10" />
                </Transition.Child>

                {/* Panel del carrito */}
                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={React.Fragment}
                                enter="transform transition ease-out duration-300"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in duration-200"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">
                                                    Carrito de compras
                                                </Dialog.Title>
                                                <button
                                                    type="button"
                                                    className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                                    onClick={closeCart}
                                                >
                                                    <span className="sr-only">Cerrar panel</span>
                                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                </button>
                                            </div>

                                            <div className="mt-8">
                                                {!isAuthenticated ? (
                                                    // Mostrar mensaje si no está autenticado
                                                    <div className="text-center">
                                                        <p className="text-gray-500 mb-4">
                                                            Debes iniciar sesión para ver tu carrito.
                                                        </p>
                                                        <button
                                                            onClick={() => {
                                                                closeCart();
                                                                navigate('/log-in');
                                                            }}
                                                            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition"
                                                        >
                                                            Iniciar sesión
                                                        </button>
                                                    </div>
                                                ) : cart.length > 0 ? (
                                                    <ul className="-my-6 divide-y divide-gray-200">
                                                        {cart.map((product) => (
                                                            <li key={product.idProduct} className="flex py-6">
                                                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                    <img
                                                                        src={product.imageProduct}
                                                                        alt={product.productName}
                                                                        className="h-full w-full object-contain"
                                                                    />
                                                                </div>
                                                                <div className="ml-4 flex flex-1 flex-col">
                                                                    <div>
                                                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                                                            <h3>{product.productName}</h3>
                                                                            <p className="ml-4">
                                                                                {new Intl.NumberFormat('es-CO', {
                                                                                    style: 'currency',
                                                                                    currency: 'COP',
                                                                                }).format(product.productPrice)}
                                                                            </p>
                                                                        </div>
                                                                        <p className="mt-1 text-sm text-gray-500">
                                                                            {product.categoriaProduct}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center justify-between mt-4">
                                                                        <div className="flex items-center space-x-4">
                                                                            {/* Botón para agregar más cantidad */}
                                                                            <button
                                                                                onClick={() => addToCart(product)}
                                                                                className="p-2 bg-lime-500 text-white rounded-full hover:bg-lime-600"
                                                                            >
                                                                                <FaPlus />
                                                                            </button>
                                                                            {/* Mostrar cantidad */}
                                                                            <span className="text-gray-700 font-medium">
                                                                                {product.quantity}
                                                                            </span>
                                                                            {/* Botón para eliminar una unidad */}
                                                                            <button
                                                                                onClick={() => removeFromCart(product.idProduct)}
                                                                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                                            >
                                                                                <FaMinus />
                                                                            </button>
                                                                        </div>
                                                                        {/* Botón para eliminar todos los productos */}
                                                                        <button
                                                                            onClick={() => clearCart(product.idProduct)}
                                                                            className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
                                                                        >
                                                                            <FaTrash />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-center text-gray-500">Tu carrito está vacío.</p>
                                                )}
                                            </div>
                                        </div>

                                        {isAuthenticated && cart.length > 0 && (
                                            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <p>Subtotal</p>
                                                    <p>
                                                        {new Intl.NumberFormat('es-CO', {
                                                            style: 'currency',
                                                            currency: 'COP',
                                                        }).format(calculateSubtotal())}
                                                    </p>
                                                </div>
                                                <div className="mt-6">
                                                    <button className="flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700">
                                                        Finalizar compra
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}