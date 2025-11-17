import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import axiosInstance from '../Services/AxiosConfig';
import StatusMessage from '../StatusMessage/StatusMessage';
import authenticator from '../../assets/assets-images-project/authenticator.png';

export default function TwoFAAuth() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [secretData, setSecretData] = useState({ secret: '', qrCodeImage: '' });
    const [status, setStatus] = useState({ type: '', message: '' });

    const maskedEmail = useMemo(() => {
        if (!email) return '';
        const [user, domain] = email.split('@');
        if (!domain) return email;
        const visible = user.slice(0, 2);
        return `${visible}${'*'.repeat(Math.max(user.length - 2, 0))}@${domain}`;
    }, [email]);

    const requestSetupData = useCallback(async () => {
        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const { data } = await axiosInstance.post('/auth/2fa/setup');
            setSecretData({
                secret: data?.secret || '',
                qrCodeImage: data?.qrCodeImage || ''
            });

            if (data?.description || data?.message) {
                setStatus({ type: 'info', message: data.description || data.message });
            }
        } catch (error) {
            console.error('Error obteniendo datos de 2FA:', error);
            let message = 'No fue posible generar el código QR. Intenta más tarde.';
            if (error.response?.status === 409) {
                message = 'Ya tienes 2FA habilitado. Desactívalo antes de configurarlo nuevamente.';
            } else if (error.response?.data?.error) {
                message = error.response.data.error;
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            }

            setStatus({ type: 'error', message });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        if (verificationCode.trim().length < 6) {
            setStatus({
                type: 'warning',
                message: 'Ingresa el código de 6 dígitos generado por tu app autenticadora.'
            });
            return;
        }

        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axiosInstance.post('/auth/2fa/enable', {
                code: verificationCode.trim()
            });

            setStatus({
                type: 'success',
                message: '¡Autenticación de dos factores activada correctamente!'
            });
            setIsSuccess(true);

            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Código inválido. Intenta nuevamente.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        requestSetupData();
    }, [requestSetupData]);

    return (
        <>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-4xl grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase">Autenticación 2FA</p>
                            <h1 className="mt-1 text-2xl font-semibold text-gray-900">Protege tu cuenta</h1>
                            {maskedEmail && (
                                <p className="text-sm text-gray-500">
                                    Configurando para: <span className="font-semibold text-gray-800">{maskedEmail}</span>
                                </p>
                            )}
                        </div>
                        <motion.img
                            src={authenticator}
                            alt="Google Authenticator"
                            className="h-20 w-20 mx-auto sm:mx-0"
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>

                    <ol className="space-y-4 text-sm text-gray-700">
                        <li className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <span className="font-semibold text-gray-900">1.</span> Descarga Google Authenticator
                            (iOS o Android) o tu app 2FA favorita.
                        </li>
                        <li className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <span className="font-semibold text-gray-900">2.</span> Escanea el código QR o ingresa la
                            clave secreta manualmente en la aplicación.
                        </li>
                        <li className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <span className="font-semibold text-gray-900">3.</span> Introduce el código de 6 dígitos que
                            se genera para completar la activación.
                        </li>
                    </ol>

                    <form onSubmit={handleVerifyCode} className="mt-8 space-y-4">
                        <label className="block text-sm font-medium text-gray-900">
                            Código de verificación
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength="6"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 px-4 py-2 text-lg tracking-[0.4em] text-center"
                                placeholder="••••••"
                                disabled={isLoading}
                            />
                        </label>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <motion.button
                                type="button"
                                whileTap={{ scale: 0.97 }}
                                onClick={requestSetupData}
                                disabled={isLoading}
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                            >
                                Regenerar QR / clave
                            </motion.button>
                            <motion.button
                                type="submit"
                                whileTap={{ scale: 0.97 }}
                                disabled={isLoading}
                                className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                            >
                                Verificar y activar
                            </motion.button>
                        </div>
                    </form>

                    {status.type && status.message && (
                        <div className="mt-4">
                            <StatusMessage type={status.type} message={status.message} />
                        </div>
                    )}

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Volver al inicio
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/log-in')}
                            className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar configuración
                        </button>
                    </div>
                </motion.section>

                <motion.aside
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100"
                >
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                        {secretData.qrCodeImage ? (
                            <img
                                src={secretData.qrCodeImage.startsWith('data:') ? secretData.qrCodeImage : `data:image/png;base64,${secretData.qrCodeImage}`}
                                alt="Código QR de autenticación"
                                className="mx-auto h-56 w-56 object-contain"
                            />
                        ) : (
                            <div className="mx-auto h-56 w-56 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                {isLoading ? 'Generando QR...' : 'QR no disponible'}
                            </div>
                        )}

                        <p className="mt-4 text-xs text-gray-500">Escanéalo con Google Authenticator</p>
                    </div>

                    <div className="mt-6 bg-slate-900 text-white rounded-2xl p-5 shadow-md">
                        <p className="text-sm text-slate-200">Clave secreta</p>
                        <p className="mt-2 font-mono text-lg tracking-widest">
                            {secretData.secret || '•••••••••••••••'}
                        </p>
                        <p className="mt-4 text-xs text-slate-300">
                            Guarda esta clave en un lugar seguro. Podrás introducirla manualmente si tienes problemas
                            escaneando el código QR.
                        </p>
                    </div>
                </motion.aside>
            </div>
        </div>

        <AnimatePresence>
            {(isLoading || isSuccess) && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-2xl border border-gray-100"
                    >
                        <motion.img
                            src={authenticator}
                            alt="Google Authenticator"
                            className="h-24 w-24 object-contain drop-shadow-md"
                            animate={{ rotate: isSuccess ? 0 : 360, scale: isSuccess ? [1, 1.1, 1] : 1 }}
                            transition={{
                                repeat: isSuccess ? Infinity : Infinity,
                                ease: 'linear',
                                duration: isSuccess ? 2 : 1.2
                            }}
                        />
                        <p className="text-lg font-semibold text-gray-900 text-center">
                            {isSuccess ? '¡Inicio exitoso con 2FA!' : 'Verificando código de 2FA...'}
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
}
