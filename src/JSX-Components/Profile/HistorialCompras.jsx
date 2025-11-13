import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Services/AuthContext';
import { NavbarContext } from '../NavBar/NavbarContext';
import { FaArrowLeft, FaShoppingBag, FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import SidebarProfile from './SidebarProfile';
import axiosInstance from '../Services/AxiosConfig';
import LoadingScreen from '../Pantalla de Carga/LoadingScreen';

export default function HistorialCompras() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useContext(AuthContext);
    const { setIsSticky } = useContext(NavbarContext);
    // Cargar datos desde sessionStorage si existen
    const [orders, setOrders] = useState(() => {
        const savedOrders = sessionStorage.getItem('historialCompras');
        return savedOrders ? JSON.parse(savedOrders) : [];
    });
    const [loading, setLoading] = useState(() => {
        // Solo mostrar loading si no hay datos guardados
        const savedOrders = sessionStorage.getItem('historialCompras');
        return !savedOrders;
    });
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const hasLoadedRef = useRef(!!sessionStorage.getItem('historialCompras'));

    // Hacer la navbar no sticky
    useEffect(() => {
        setIsSticky(false);
        return () => {
            setIsSticky(true);
        };
    }, [setIsSticky]);

    // Verificar autenticación
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/log-in');
        }
    }, [isAuthenticated, navigate]);

    // Cargar historial de compras solo si no hay datos guardados
    useEffect(() => {
        // Evitar recargar si ya se cargaron los datos
        if (hasLoadedRef.current) {
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                // TODO: Reemplazar con el endpoint real del backend
                // const response = await axiosInstance.get('/orders/history');
                // setOrders(response.data);
                
                // Datos de ejemplo para la estructura
                const ordersData = [
                    {
                        id: 1,
                        orderNumber: 'ORD-2024-001',
                        date: '2024-01-15',
                        status: 'completed',
                        total: 125000,
                        items: [
                            { id: 1, name: 'Producto Ejemplo 1', quantity: 2, price: 50000, image: '/placeholder.jpg' },
                            { id: 2, name: 'Producto Ejemplo 2', quantity: 1, price: 25000, image: '/placeholder.jpg' }
                        ]
                    },
                    {
                        id: 2,
                        orderNumber: 'ORD-2024-002',
                        date: '2024-01-20',
                        status: 'pending',
                        total: 75000,
                        items: [
                            { id: 3, name: 'Producto Ejemplo 3', quantity: 1, price: 75000, image: '/placeholder.jpg' }
                        ]
                    },
                    {
                        id: 3,
                        orderNumber: 'ORD-2024-003',
                        date: '2024-01-25',
                        status: 'cancelled',
                        total: 95000,
                        items: [
                            { id: 4, name: 'Producto Ejemplo 4', quantity: 1, price: 95000, image: '/placeholder.jpg' }
                        ]
                    }
                ];
                
                setOrders(ordersData);
                // Guardar en sessionStorage para persistir entre navegaciones
                sessionStorage.setItem('historialCompras', JSON.stringify(ordersData));
                hasLoadedRef.current = true;
            } catch (error) {
                setErrorMessage('Error al cargar el historial de compras');
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated()) {
            fetchOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Solo ejecutar una vez al montar

    const getStatusConfig = (status) => {
        switch (status) {
            case 'completed':
                return {
                    icon: FaCheckCircle,
                    text: 'Completada',
                    color: 'text-green-600',
                    bgColor: 'bg-green-100',
                    borderColor: 'border-green-300'
                };
            case 'pending':
                return {
                    icon: FaClock,
                    text: 'Pendiente',
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-100',
                    borderColor: 'border-yellow-300'
                };
            case 'cancelled':
                return {
                    icon: FaTimesCircle,
                    text: 'Cancelada',
                    color: 'text-red-600',
                    bgColor: 'bg-red-100',
                    borderColor: 'border-red-300'
                };
            default:
                return {
                    icon: FaClock,
                    text: 'Desconocido',
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100',
                    borderColor: 'border-gray-300'
                };
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    const orderVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    // Solo mostrar LoadingScreen completo si está cargando y no hay datos
    if (loading && orders.length === 0) {
        return <LoadingScreen message="Cargando historial de compras..." color="lime" />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Personalizado */}
            <SidebarProfile />

            {/* Contenido Principal */}
            <div className="flex-1 bg-gray-50 flex flex-col">
                <div className="flex-1 flex items-start justify-center px-4 pt-10 pb-10">
                    <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-4xl"
                    >
                        {/* Botón de regreso */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 mb-6"
                        >
                            <FaArrowLeft className="h-5 w-5" />
                            <span>Inicio</span>
                        </motion.button>

                        {/* Título */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Historial de Compras</h1>
                            <p className="text-gray-600">Revisa todas tus compras realizadas</p>
                        </div>

                        {/* Mensaje de error */}
                        {errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
                            >
                                ✗ {errorMessage}
                            </motion.div>
                        )}

                        {/* Lista de órdenes */}
                        <AnimatePresence>
                            {orders.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white rounded-lg shadow-md p-12 text-center"
                                >
                                    <FaShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        No hay compras registradas
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Cuando realices una compra, aparecerá en este historial
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/')}
                                        className="bg-lime-600 text-white px-6 py-3 rounded-lg hover:bg-lime-700 transition-colors font-semibold"
                                    >
                                        Ir a comprar
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => {
                                        const statusConfig = getStatusConfig(order.status);
                                        const StatusIcon = statusConfig.icon;
                                        const isExpanded = expandedOrder === order.id;

                                        return (
                                            <motion.div
                                                key={order.id}
                                                variants={orderVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="bg-white rounded-lg shadow-md overflow-hidden"
                                            >
                                                {/* Header de la orden */}
                                                <div
                                                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                                    onClick={() => toggleOrder(order.id)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-4 mb-2">
                                                                <h3 className="text-lg font-bold text-gray-800">
                                                                    {order.orderNumber}
                                                                </h3>
                                                                <span
                                                                    className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border`}
                                                                >
                                                                    <StatusIcon className="h-3 w-3" />
                                                                    <span>{statusConfig.text}</span>
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                                                <div className="flex items-center space-x-2">
                                                                    <FaCalendarAlt className="h-4 w-4" />
                                                                    <span>{formatDate(order.date)}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <FaShoppingBag className="h-4 w-4" />
                                                                    <span>{order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-6 ml-4">
                                                            <div className="text-right">
                                                                <p className="text-sm text-gray-600">Total</p>
                                                                <p className="text-xl font-bold text-lime-600">
                                                                    ${new Intl.NumberFormat('es-CO').format(order.total)}
                                                                </p>
                                                            </div>
                                                            <motion.div
                                                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                {isExpanded ? (
                                                                    <FaChevronUp className="h-5 w-5 text-gray-400" />
                                                                ) : (
                                                                    <FaChevronDown className="h-5 w-5 text-gray-400" />
                                                                )}
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Detalles expandidos */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-6 pb-6 border-t border-gray-200 bg-gray-50">
                                                                <h4 className="font-semibold text-gray-800 mb-4 mt-4">
                                                                    Productos de la orden
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    {order.items.map((item) => (
                                                                        <motion.div
                                                                            key={item.id}
                                                                            initial={{ opacity: 0, x: -20 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200"
                                                                        >
                                                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                                                                {item.image ? (
                                                                                    <img
                                                                                        src={item.image}
                                                                                        alt={item.name}
                                                                                        className="w-full h-full object-cover"
                                                                                    />
                                                                                ) : (
                                                                                    <FaShoppingBag className="h-6 w-6 text-gray-400" />
                                                                                )}
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <p className="font-semibold text-gray-800">
                                                                                    {item.name}
                                                                                </p>
                                                                                <p className="text-sm text-gray-600">
                                                                                    Cantidad: {item.quantity}
                                                                                </p>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <p className="font-semibold text-gray-800">
                                                                                    ${new Intl.NumberFormat('es-CO').format(item.price * item.quantity)}
                                                                                </p>
                                                                                {item.quantity > 1 && (
                                                                                    <p className="text-xs text-gray-500">
                                                                                        ${new Intl.NumberFormat('es-CO').format(item.price)} c/u
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </motion.div>
                                                                    ))}
                                                                </div>
                                                                <div className="mt-6 pt-4 border-t border-gray-300 flex justify-between items-center">
                                                                    <span className="text-lg font-semibold text-gray-800">
                                                                        Total de la orden
                                                                    </span>
                                                                    <span className="text-2xl font-bold text-lime-600">
                                                                        ${new Intl.NumberFormat('es-CO').format(order.total)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

