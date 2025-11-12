import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import AuthContext from '../Services/AuthContext';
import StatusMessage from '../StatusMessage/StatusMessage';
import LoadingScreen from '../Pantalla de Carga/LoadingScreen';
import axiosInstance from '../Services/AxiosConfig';
import axios from 'axios';

export default function IniciarSesion() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setIsLoading(true);
        setIsLoadingComplete(false);

        try {
            await login({ email_usuario: email, password_usuario: password });
            setIsLoadingComplete(true);
            setStatus({
                type: 'success',
                message: '¡Inicio de sesión exitoso!'
            });

            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (err) {
            console.error('Error completo:', err);
            setIsLoading(false);

            if (err.message) {
                if (err.message.includes('Credenciales inválidas')) {
                    setStatus({
                        type: 'error',
                        message: 'Correo electrónico o contraseña incorrectos'
                    });
                } else if (err.message.includes('Usuario no verificado') || err.message.includes('verifica tu correo')) {
                    setStatus({
                        type: 'warning',
                        message: 'Por favor verifica tu correo electrónico antes de iniciar sesión'
                    });
                } else if (err.message.includes('no encontrado')) {
                    setStatus({
                        type: 'error',
                        message: 'El usuario no existe en el sistema'
                    });
                } else {
                    setStatus({
                        type: 'error',
                        message: err.message
                    });
                }
            } else if (err.response?.data?.error) {
                const { error, message } = err.response.data;

                switch (error) {
                    case 'USER_NOT_VERIFIED':
                        setStatus({
                            type: 'warning',
                            message: message || 'Por favor verifica tu correo electrónico antes de iniciar sesión'
                        });
                        break;
                    case 'INVALID_CREDENTIALS':
                        setStatus({
                            type: 'error',
                            message: message || 'Correo electrónico o contraseña incorrectos'
                        });
                        break;
                    case 'USER_NOT_FOUND':
                        setStatus({
                            type: 'error',
                            message: message || 'El usuario no existe en el sistema'
                        });
                        break;
                    default:
                        setStatus({
                            type: 'error',
                            message: message || 'Error desconocido. Inténtalo nuevamente'
                        });
                }
            } else if (err.response?.status === 401) {
                setStatus({
                    type: 'error',
                    message: 'Credenciales inválidas'
                });
            } else if (err.response?.status === 403) {
                setStatus({
                    type: 'warning',
                    message: 'Acceso denegado. Tu cuenta podría no estar verificada'
                });
            } else {
                setStatus({
                    type: 'error',
                    message: 'Error de conexión. Verifica tu red o que el servidor esté en ejecución'
                });
            }
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            setIsLoading(true);
            setStatus({ type: '', message: '' });

            try {
                const { access_token } = codeResponse;

                // Obtener información del usuario de Google
                const googleUserInfo = await axios.get(
                    `https://www.googleapis.com/oauth2/v2/userinfo`,
                    {
                        headers: { Authorization: `Bearer ${access_token}` }
                    }
                );

                console.log('Google User Info:', googleUserInfo.data);

                // Enviar información a tu backend con axiosInstance
                const response = await axiosInstance.post('/auth/google/success', {
                    email_usuario: googleUserInfo.data.email,
                    nombre_usuario: googleUserInfo.data.name,
                    googleId: googleUserInfo.data.id
                });

                console.log('Backend Response:', response.data);

                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    setIsLoadingComplete(true);
                    setStatus({
                        type: 'success',
                        message: '¡Inicio de sesión exitoso con Google!'
                    });

                    setTimeout(() => {
                        navigate('/');
                        window.location.reload();
                    }, 1500);
                }
            } catch (error) {
                console.error('Error al iniciar sesión con Google:', error);
                console.error('Error response:', error.response?.data);
                setIsLoading(false);
                setStatus({
                    type: 'error',
                    message: error.response?.data?.message || 'Error al iniciar sesión con Google'
                });
            }
        },
        onError: (error) => {
            console.error('Google OAuth Error:', error);
            setStatus({
                type: 'error',
                message: 'Error al iniciar sesión con Google'
            });
        },
        flow: 'implicit'
    });

    return (
        <>
            {isLoading && (
                <LoadingScreen 
                    message={isLoadingComplete ? "¡Inicio de sesión exitoso!" : "Iniciando sesión..."}
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
                            Inicia sesión en tu cuenta
                        </h2>
                    </div>

                    {/* Formulario */}
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                    Correo electrónico
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                        Contraseña
                                    </label>
                                    <div className="text-sm">
                                        <Link 
                                            to="/forgot-password" 
                                            className="font-semibold text-gray-900 hover:text-gray-600"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-slate-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                                >
                                    Iniciar Sesión
                                </button>
                            </div>
                        </form>

                        {/* Divisor */}
                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">O continúa con</span>
                            </div>
                        </div>

                        {/* Botón Google */}
                        <motion.button
                            type="button"
                            onClick={() => handleGoogleLogin()}
                            whileHover={{ scale: 1.02, backgroundColor: '#f8f9fa' }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full mt-4 flex justify-center items-center space-x-3 rounded-full bg-white border-2 border-gray-300 px-6 py-3 text-base font-semibold text-gray-900 shadow-md hover:shadow-lg hover:border-gray-400 transition-all duration-200"
                        >
                            <FaGoogle className="h-6 w-6 text-blue-500" />
                            <span>Continuar con Google</span>
                        </motion.button>

                        {/* Mover el StatusMessage fuera del formulario */}
                        {status.type && status.message && (
                            <div className="mt-4">
                                <StatusMessage 
                                    type={status.type} 
                                    message={status.message}
                                />
                            </div>
                        )}

                        <p className="mt-10 text-center text-sm/6 text-gray-500">
                            ¿No posees una cuenta?{' '}
                            <Link to='/register' className="font-semibold text-gray-900 hover:text-gray-600">
                                Regístrate!
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
