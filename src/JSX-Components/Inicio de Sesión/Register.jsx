import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";
import { useGoogleLogin } from '@react-oauth/google';
import UserService from '../Services/UserService';
import LoadingScreen from '../Pantalla de Carga/LoadingScreen';
import StatusMessage from '../StatusMessage/StatusMessage';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Register() {
    const [user, setUser] = useState({
        nombre_usuario: '',
        email_usuario: '',
        password_usuario: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setIsLoadingComplete(false);
        
        try {
            const response = await UserService.registerUser(user);
            if (response?.success || response?.id || response?.usuario) {
                setIsLoadingComplete(true);
                await new Promise(resolve => setTimeout(resolve, 1500));
                navigate('/verify-code', { 
                    state: { 
                        email: user.email_usuario 
                    } 
                });
            }
        } catch (error) {
            if (error?.response?.status === 409) {
                setError('Este correo electrónico ya está registrado');
            } else {
                setError(error?.message || 'Error al registrar usuario');
            }
            console.error('Error details:', error);
            setIsLoadingComplete(false);
        } finally {
            if (!isLoadingComplete) {
                setIsLoading(false);
            }
        }
    };

    const handleGoogleRegister = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            setIsLoading(true);
            setError('');

            try {
                const { access_token } = codeResponse;

                // Obtener información del usuario de Google
                const googleUserInfo = await axios.get(
                    `https://www.googleapis.com/oauth2/v2/userinfo`,
                    {
                        headers: { Authorization: `Bearer ${access_token}` }
                    }
                );

                // Enviar información a tu backend con el endpoint correcto
                const response = await axios.post('http://localhost:8080/auth/google/success', {
                    email_usuario: googleUserInfo.data.email,
                    nombre_usuario: googleUserInfo.data.name,
                    googleId: googleUserInfo.data.id
                });

                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    setIsLoadingComplete(true);
                    
                    setTimeout(() => {
                        navigate('/');
                        window.location.reload();
                    }, 1500);
                } else if (response.data.requiresVerification) {
                    // Si requiere verificación
                    setIsLoadingComplete(true);
                    setTimeout(() => {
                        navigate('/verify-code', { 
                            state: { 
                                email: googleUserInfo.data.email 
                            } 
                        });
                    }, 1500);
                }
            } catch (error) {
                console.error('Error al registrarse con Google:', error);
                setIsLoading(false);
                setError(error.response?.data?.message || 'Error al registrarse con Google');
            }
        },
        onError: () => {
            setError('Error al registrarse con Google');
        },
        flow: 'implicit'
    });

    return (
        <>
            {isLoading && (
                <LoadingScreen 
                    message={isLoadingComplete ? "¡Registro exitoso!" : "Registrando usuario..."}
                    color="lime"
                    size="default"
                    isComplete={isLoadingComplete}
                    onComplete={() => {
                        setIsLoading(false);
                    }}
                />
            )}
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-lg space-y-8 bg-white p-12 rounded-xl shadow-lg">
                    {/* Flecha de regreso */}
                    <div className="flex items-center space-x-2 mb-4">
                        <Link to="/" className="flex items-center text-zinc-800 hover:text-zinc-600">
                            <IoArrowBack className="h-6 w-6" />
                            <span className="ml-2">Inicio</span>
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
                            Crea tu cuenta
                        </h2>
                    </div>

                    {/* Formulario */}
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="nombre_usuario" className="block text-sm font-medium text-gray-900">
                                    Nombre de usuario
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="nombre_usuario"
                                        name="nombre_usuario"
                                        type="text"
                                        required
                                        value={user.nombre_usuario}
                                        onChange={handleChange}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-900 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email_usuario" className="block text-sm font-medium text-gray-900">
                                    Correo electrónico
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email_usuario"
                                        name="email_usuario"
                                        type="email"
                                        required
                                        value={user.email_usuario}
                                        onChange={handleChange}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-900 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password_usuario" className="block text-sm font-medium text-gray-900">
                                    Contraseña
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password_usuario"
                                        name="password_usuario"
                                        type="password"
                                        required
                                        value={user.password_usuario}
                                        onChange={handleChange}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-900 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                                >
                                    Crear cuenta
                                </button>
                            </div>
                        </form>

                        {/* Divisor */}
                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">O regístrate con</span>
                            </div>
                        </div>

                        {/* Botón Google */}
                        <motion.button
                            type="button"
                            onClick={() => handleGoogleRegister()}
                            whileHover={{ scale: 1.02, backgroundColor: '#f8f9fa' }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full mt-4 flex justify-center items-center space-x-3 rounded-full bg-white border-2 border-gray-300 px-6 py-3 text-base font-semibold text-gray-900 shadow-md hover:shadow-lg hover:border-gray-400 transition-all duration-200"
                        >
                            <FaGoogle className="h-6 w-6 text-blue-500" />
                            <span>Continuar con Google</span>
                        </motion.button>

                        {/* Mensajes de error */}
                        {error && (
                            <StatusMessage 
                                type="error"
                                message={error}
                            />
                        )}

                        <p className="mt-10 text-center text-sm text-gray-500">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to='/log-in' className="font-semibold text-gray-900 hover:text-gray-600">
                                Inicia Sesión!
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}


