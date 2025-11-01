import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import AuthContext from '../Services/AuthContext';
import StatusMessage from '../StatusMessage/StatusMessage';
import LoadingScreen from '../Pantalla de Carga/LoadingScreen';

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
    setStatus({ type: '', message: '' }); // Limpiar mensajes anteriores
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
        console.error('Error details:', err); // Para debugging
        
        if (err.response?.data?.error) {
            switch (err.response.data.error) {
                case 'USER_NOT_VERIFIED':
                    setStatus({
                        type: 'warning',
                        message: 'Por favor verifica tu correo electrónico para iniciar sesión'
                    });
                    break;
                case 'INVALID_CREDENTIALS':
                    setStatus({
                        type: 'error',
                        message: 'Correo electrónico o contraseña incorrectos'
                    });
                    break;
                case 'USER_DISABLED':
                    setStatus({
                        type: 'error',
                        message: 'Tu cuenta ha sido desactivada. Contacta al soporte'
                    });
                    break;
                default:
                    setStatus({
                        type: 'error',
                        message: 'Error al iniciar sesión. Inténtalo de nuevo'
                    });
            }
        } else {
            setStatus({
                type: 'error',
                message: 'Error de conexión. Verifica tu internet'
            });
        }
    } finally {
        if (!isLoadingComplete) {
            setIsLoading(false);
        }
    }
};

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
