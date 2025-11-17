import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { FaGoogle, FaExclamationTriangle } from "react-icons/fa";
import UserService from '../Services/UserService';
import LoadingScreen from '../Pantalla de Carga/LoadingScreen';
import StatusMessage from '../StatusMessage/StatusMessage';

export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);
    const [isOAuthAccount, setIsOAuthAccount] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setIsLoadingComplete(false);
        setStatus({ type: '', message: '' });
        setIsOAuthAccount(false);

        try {
            await UserService.requestPasswordReset(email);
            setIsLoadingComplete(true);
            setStatus({
                type: 'success',
                message: 'Se ha enviado un enlace a tu correo electrónico para restablecer tu contraseña'
            });
            // Ocultar LoadingScreen después de mostrar el checkmark
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
        } catch (error) {
            // Ocultar LoadingScreen inmediatamente en caso de error
            setIsLoading(false);
            
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || '';
            
            // Verificar si es una cuenta OAuth2
            if (errorMessage.toLowerCase().includes('google') || 
                errorMessage.toLowerCase().includes('oauth') ||
                errorMessage.toLowerCase().includes('creada con')) {
                setIsOAuthAccount(true);
                setStatus({
                    type: 'warning',
                    message: errorMessage
                });
            } else if (error?.response?.status === 404) {
                // Usuario no encontrado
                setStatus({
                    type: 'error',
                    message: 'No existe una cuenta registrada con este correo electrónico'
                });
            } else {
                // Otros errores
                setStatus({
                    type: 'error',
                    message: errorMessage || 'Error al enviar el enlace de restablecimiento. Inténtalo nuevamente'
                });
            }
        }
    };

    return (
        <>
            {isLoading && (
                <LoadingScreen 
                    message={isLoadingComplete ? "¡Correo enviado!" : "Enviando correo..."}
                    color="lime"
                    size="default"
                    isComplete={isLoadingComplete}
                />
            )}
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-lg space-y-8 bg-white p-12 rounded-xl shadow-lg">
                    {/* Flecha de regreso */}
                    <div className="flex items-center space-x-2 mb-10">
                        <Link to="/log-in" className="flex items-center text-zinc-800 hover:text-zinc-600">
                            <IoArrowBack className="h-6 w-6" />
                            <span className="ml-2">Iniciar sesión</span>
                        </Link>
                    </div>

                    {/* Logo */}
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <Link to='/'>
                            <img
                                alt="Your Company"
                                src="/logo behance.png"
                                className="mx-auto h-25 w-auto"
                            />
                        </Link>
                        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                            Restablecer contraseña
                        </h2>
                        <p className="mt-4 text-center text-gray-600">
                            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                        </p>
                    </div>

                    {/* Formulario */}
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                    Correo electrónico
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-gray-900"
                                        placeholder="tucorreo@ejemplo.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
                            >
                                Enviar enlace de restablecimiento
                            </button>

                            {/* Mensajes de estado */}
                            {status.type && status.message && (
                                <div className="space-y-3">
                                    <StatusMessage 
                                        type={status.type} 
                                        message={status.message}
                                    />
                                    {isOAuthAccount && (
                                        <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 shadow-md">
                                            <div className="flex items-start space-x-3 mb-4">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    <FaExclamationTriangle className="text-amber-500 text-xl" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-bold text-gray-800 mb-1">
                                                        Cuenta registrada con Google
                                                    </h3>
                                                    <p className="text-sm text-gray-700 leading-relaxed">
                                                        Esta cuenta fue creada usando Google y no tiene una contraseña asociada. 
                                                        Para iniciar sesión, debes usar el botón "Continuar con Google".
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center space-x-2 pt-3 border-t border-blue-200">
                                                <FaGoogle className="text-blue-600 text-lg" />
                                                <Link 
                                                    to="/log-in" 
                                                    className="inline-flex items-center text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                                >
                                                    Ir a iniciar sesión con Google
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}