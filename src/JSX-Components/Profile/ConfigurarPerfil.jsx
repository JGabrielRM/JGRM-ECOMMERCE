import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Services/AuthContext';
import { NavbarContext } from '../NavBar/NavbarContext';
import { FaArrowLeft } from 'react-icons/fa';
import SidebarProfile from './SidebarProfile';
import axiosInstance from '../Services/AxiosConfig';

export default function ConfigurarPerfil() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useContext(AuthContext);
    const { setIsSticky } = useContext(NavbarContext);
    const [activeTab, setActiveTab] = useState('username');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Estados para los formularios
    const [formData, setFormData] = useState({
        nombre_usuario: user?.nombre_usuario || '',
        numero_telefono: user?.numero_telefono || '',
        numero_identificacion: user?.numero_identificacion || ''
    });

    const [editData, setEditData] = useState({
        nombre_usuario: user?.nombre_usuario || '',
        numero_telefono: user?.numero_telefono || '',
        numero_identificacion: user?.numero_identificacion || ''
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value
        });
    };

    const handleUpdateUsername = async (e) => {
        e.preventDefault();
        if (!editData.nombre_usuario.trim()) {
            setErrorMessage('El nombre de usuario no puede estar vacío');
            return;
        }

        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await axiosInstance.put('/auth/update-username', {
                nombre_usuario: editData.nombre_usuario
            });
            setFormData({ ...formData, nombre_usuario: editData.nombre_usuario });
            setSuccessMessage('Nombre de usuario actualizado exitosamente');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error al actualizar el nombre de usuario');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePhoneNumber = async (e) => {
        e.preventDefault();
        const phoneRegex = /^[0-9]{7,15}$/;
        
        if (!editData.numero_telefono.trim()) {
            setErrorMessage('El número de teléfono no puede estar vacío');
            return;
        }

        if (!phoneRegex.test(editData.numero_telefono.replace(/\D/g, ''))) {
            setErrorMessage('Por favor ingresa un número de teléfono válido (7-15 dígitos)');
            return;
        }

        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await axiosInstance.put('/auth/update-phone', {
                numero_telefono: editData.numero_telefono
            });
            setFormData({ ...formData, numero_telefono: editData.numero_telefono });
            setSuccessMessage('Número de teléfono actualizado exitosamente');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error al actualizar el número de teléfono');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateIdentificationNumber = async (e) => {
        e.preventDefault();
        
        if (!editData.numero_identificacion.trim()) {
            setErrorMessage('El número de identificación no puede estar vacío');
            return;
        }

        if (editData.numero_identificacion.length < 5) {
            setErrorMessage('El número de identificación debe tener al menos 5 dígitos');
            return;
        }

        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await axiosInstance.put('/auth/update-id', {
                numero_identificacion: editData.numero_identificacion
            });
            setFormData({ ...formData, numero_identificacion: editData.numero_identificacion });
            setSuccessMessage('Número de identificación actualizado exitosamente');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error al actualizar el número de identificación');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };


    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    const messageVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Personalizado */}
            <SidebarProfile activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Contenido Principal - Ocupando todo el espacio derecho */}
            <div className="flex-1 bg-gray-50 flex flex-col">
                {/* Contenido centrado */}
                <div className="flex-1 flex items-start justify-center px-4 pt-10 pb-10">
                    <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-2xl"
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
                        {/* Mensajes */}
                        <AnimatePresence>
                            {successMessage && (
                                <motion.div
                                    variants={messageVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
                                >
                                    ✓ {successMessage}
                                </motion.div>
                            )}
                            {errorMessage && (
                                <motion.div
                                    variants={messageVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
                                >
                                    ✗ {errorMessage}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Cambiar Nombre de Usuario */}
                        {activeTab === 'username' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white rounded-lg shadow-md p-8"
                            >
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">Cambiar Nombre de Usuario</h3>
                                <form onSubmit={handleUpdateUsername} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre de usuario actual
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nombre_usuario}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nuevo nombre de usuario
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre_usuario"
                                            value={editData.nombre_usuario}
                                            onChange={handleInputChange}
                                            placeholder="Ingresa tu nuevo nombre de usuario"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-lime-600 text-white py-3 rounded-lg hover:bg-lime-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Actualizando...' : 'Actualizar nombre de usuario'}
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}

                        {/* Agregar Número de Teléfono */}
                        {activeTab === 'phone' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white rounded-lg shadow-md p-8"
                            >
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">Agregar Número de Teléfono</h3>
                                <form onSubmit={handleUpdatePhoneNumber} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Número de teléfono actual
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.numero_telefono || 'No registrado'}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nuevo número de teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            name="numero_telefono"
                                            value={editData.numero_telefono}
                                            onChange={handleInputChange}
                                            placeholder="Ej: +57 3232465878"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            Ingresa un número válido (7-15 dígitos)
                                        </p>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-lime-600 text-white py-3 rounded-lg hover:bg-lime-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Actualizando...' : 'Agregar número de teléfono'}
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}

                        {/* Agregar Número de Identificación */}
                        {activeTab === 'identification' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white rounded-lg shadow-md p-8"
                            >
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">Agregar Número de Identificación</h3>
                                <form onSubmit={handleUpdateIdentificationNumber} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Número de identificación actual
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.numero_identificacion || 'No registrado'}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nuevo número de identificación
                                        </label>
                                        <input
                                            type="text"
                                            name="numero_identificacion"
                                            value={editData.numero_identificacion}
                                            onChange={handleInputChange}
                                            placeholder="Ej: 1234567890"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            Ingresa tu cédula o número de identificación (mínimo 5 dígitos)
                                        </p>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-lime-600 text-white py-3 rounded-lg hover:bg-lime-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Actualizando...' : 'Agregar número de identificación'}
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}