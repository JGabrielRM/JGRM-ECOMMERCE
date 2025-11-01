import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import UserService from '../Services/UserService';
import LoadingScreen from '../Pantalla de Carga/LoadingScreen';
import StatusMessage from '../StatusMessage/StatusMessage';

export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await UserService.requestPasswordReset(email);
            setIsLoadingComplete(true);
            setStatus({
                type: 'success',
                message: 'Se ha enviado un enlace a tu correo electrónico para restablecer tu contraseña'
            });
        } catch (error) {
            setStatus({
                type: 'error',
                message: error?.response?.data?.message || 'Error al enviar el enlace de restablecimiento'
            });
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
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
                                <StatusMessage 
                                    type={status.type} 
                                    message={status.message}
                                />
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}