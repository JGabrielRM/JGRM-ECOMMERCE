import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../Services/AuthContext';
import { FaCog, FaPhone, FaIdCard, FaShoppingBag, FaStore } from 'react-icons/fa';

export default function SidebarProfile({ activeTab, setActiveTab }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    const menuItems = [
        { id: 'username', label: 'Cambiar usuario', icon: FaCog },
        { id: 'phone', label: 'Agregar teléfono', icon: FaPhone },
        { id: 'identification', label: 'Agregar identificación', icon: FaIdCard }
    ];

    const sidebarVariants = {
        hidden: { x: -300, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.3 } }
    };

    const isProfilePage = location.pathname === '/profile';
    const isHistorialPage = location.pathname === '/historial-compras';

    return (
        <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            className="w-64 bg-white shadow-lg min-h-screen"
        >
            <div className="p-6 top-0">
                {/* Sección Mi Perfil */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">Mi Perfil</h2>
                <nav className="space-y-2 mb-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <motion.button
                                key={item.id}
                                whileHover={{ x: 5 }}
                                onClick={() => {
                                    if (setActiveTab) {
                                        setActiveTab(item.id);
                                    }
                                    if (!isProfilePage) {
                                        navigate('/profile');
                                    }
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                    isProfilePage && activeTab === item.id
                                        ? 'bg-gray-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </motion.button>
                        );
                    })}
                </nav>

                {/* Línea divisoria */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Sección Historial de Compras */}
                <h3 className="text-lg font-bold text-gray-800 mb-4">Historial de Compras</h3>
                <nav className="space-y-2 mb-6">
                    <motion.button
                        whileHover={{ x: 5 }}
                        onClick={() => navigate('/historial-compras')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isHistorialPage
                                ? 'bg-gray-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <FaShoppingBag className="h-5 w-5" />
                        <span className="font-medium">Historial de compras</span>
                    </motion.button>
                </nav>

                {/* Línea divisoria */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Sección Vender */}
                <h3 className="text-lg font-bold text-gray-800 mb-4">Vender</h3>
                <nav className="space-y-2 mb-6">
                    <motion.button
                        whileHover={{ x: 5 }}
                        onClick={() => navigate('/addEmployee')}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100"
                    >
                        <FaStore className="h-5 w-5" />
                        <span className="font-medium">Vender Productos</span>
                    </motion.button>
                </nav>

                {/* Información del usuario */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Usuario actual:</p>
                    <p className="font-semibold text-gray-800 truncate">{user?.nombre_usuario}</p>
                    <p className="text-xs text-gray-500 mt-2">{user?.email_usuario}</p>
                </div>

                {/* Botón de cerrar sesión */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        logout();
                        navigate('/log-in');
                    }}
                    className="w-full mt-6 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors font-semibold"
                >
                    Cerrar sesión
                </motion.button>
            </div>
        </motion.div>
    );
}

