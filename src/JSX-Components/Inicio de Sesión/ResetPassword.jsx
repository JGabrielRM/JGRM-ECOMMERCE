import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserService from '../Services/UserService';
import { IoArrowBack } from "react-icons/io5";
import LoadingScreen from '../Pantalla de Carga/LoadingScreen';
import StatusMessage from '../StatusMessage/StatusMessage';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const { token: tokenParam } = useParams();
    const tokenQuery = searchParams.get('token');
    // Aceptar token como parámetro de ruta o como query parameter
    const token = tokenParam || tokenQuery;
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/404');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus({
                type: 'error',
                message: 'Las contraseñas no coinciden'
            });
            return;
        }

        setIsLoading(true);
        setIsLoadingComplete(false);
        setStatus({ type: '', message: '' });

        try {
            await UserService.resetPassword(token, password);
            setIsLoadingComplete(true);
            setStatus({
                type: 'success',
                message: '¡Contraseña actualizada exitosamente!'
            });
            // Ocultar LoadingScreen después de mostrar el checkmark
            setTimeout(() => {
                setIsLoading(false);
                setTimeout(() => {
                    navigate('/log-in');
                }, 500);
            }, 1500);
        } catch (error) {
            // Ocultar LoadingScreen inmediatamente en caso de error
            setIsLoading(false);
            setStatus({
                type: 'error',
                message: error?.response?.data?.message || 'Error al restablecer la contraseña'
            });
        }
    };

    if (!token) return null;

    return (
        <>
            {isLoading && (
                <LoadingScreen 
                    message={isLoadingComplete ? "¡Contraseña actualizada!" : "Actualizando contraseña..."}
                    color="lime"
                    size="default"
                    isComplete={isLoadingComplete}
                />
            )}
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-lg space-y-8 bg-white p-12 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-2 mb-4">
                        <button
                            onClick={() => navigate('/log-in')}
                            className="flex items-center text-zinc-800 hover:text-zinc-600"
                        >
                            <IoArrowBack className="h-6 w-6" />
                            <span className="ml-2">Iniciar sesión</span>
                        </button>
                    </div>

                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            src="/logo behance.png"
                            alt="Logo"
                            className="mx-auto h-25 w-auto"
                        />
                        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                            Restablecer contraseña
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                Nueva contraseña
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-gray-900"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                                Confirmar contraseña
                            </label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-gray-900"
                            />
                        </div>

                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
                        >
                            Actualizar contraseña
                        </button>

                        {status.type && status.message && (
                            <StatusMessage 
                                type={status.type} 
                                message={status.message}
                            />
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}