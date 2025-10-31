import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import UserService from '../Services/UserService';
import LoadingScreen from '../Pantalla de Carga/LoadingScreen';
import StatusMessage from '../StatusMessage/StatusMessage';

export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: email, 2: código y nueva contraseña
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await UserService.requestPasswordReset(email);
            setIsLoadingComplete(true);
            setStatus({
                type: 'success',
                message: 'Se ha enviado un código a tu correo electrónico'
            });
            setTimeout(() => {
                setStep(2);
                setIsLoading(false);
            }, 1500);
        } catch (error) {
            setStatus({
                type: 'error',
                message: error?.response?.data?.message || 'Error al enviar el código'
            });
            setIsLoading(false);
        }
    };

    const handleCodeChange = (index, value) => {
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value !== '' && index < 5) {
                const nextInput = document.getElementById(`reset-code-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setStatus({
                type: 'error',
                message: 'Las contraseñas no coinciden'
            });
            return;
        }

        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await UserService.resetPassword({
                email,
                code: code.join(''),
                newPassword
            });
            setIsLoadingComplete(true);
            setStatus({
                type: 'success',
                message: '¡Contraseña actualizada exitosamente!'
            });
            setTimeout(() => {
                navigate('/log-in');
            }, 1500);
        } catch (error) {
            setStatus({
                type: 'error',
                message: error?.response?.data?.message || 'Error al restablecer la contraseña'
            });
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && (
                <LoadingScreen 
                    message={isLoadingComplete ? "¡Proceso completado!" : "Procesando..."}
                    color="lime"
                    size="default"
                    isComplete={isLoadingComplete}
                />
            )}
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-lg space-y-8 bg-white p-12 rounded-xl shadow-lg">
                    {/* Flecha de regreso */}
                    <div className="flex items-center space-x-2 mb-4">
                        <Link to="/log-in" className="flex items-center text-zinc-800 hover:text-zinc-600">
                            <IoArrowBack className="h-6 w-6" />
                            <span className="ml-2">Volver al inicio de sesión</span>
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
                            {step === 1 ? 'Restablecer contraseña' : 'Ingresa el código de verificación'}
                        </h2>
                    </div>

                    {/* Mensajes de estado */}
                    {status.type && status.message && (
                        <StatusMessage 
                            type={status.type} 
                            message={status.message}
                        />
                    )}

                    {/* Formularios */}
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        {step === 1 ? (
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
                                    Enviar código de verificación
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">
                                        Código de verificación
                                    </label>
                                    <div className="flex justify-center space-x-4 mt-2">
                                        {code.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`reset-code-${index}`}
                                                type="text"
                                                maxLength="1"
                                                value={digit}
                                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                                className="w-12 h-12 text-center text-2xl border-2 rounded-lg focus:border-gray-600 focus:ring-0"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900">
                                        Nueva contraseña
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="newPassword"
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-gray-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                                        Confirmar contraseña
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-gray-900"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
                                >
                                    Restablecer contraseña
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}