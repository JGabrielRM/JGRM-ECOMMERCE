import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import authenticator from '../../assets/assets-images-project/authenticator.png';
import StatusMessage from '../StatusMessage/StatusMessage';

export default function TwoFactorLoginModal({ isOpen, onClose, onVerify, email, isLoading }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (code.trim().length !== 6) {
            setError('El código debe tener 6 dígitos');
            return;
        }

        try {
            await onVerify(code);
        } catch (err) {
            setError(err.message || 'Código inválido');
        }
    };

    const maskedEmail = email ? (() => {
        const [user, domain] = email.split('@');
        if (!domain) return email;
        const visible = user.slice(0, 2);
        return `${visible}${'*'.repeat(Math.max(user.length - 2, 0))}@${domain}`;
    })() : '';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
                    >
                        <div className="flex justify-center mb-4">
                            <motion.img
                                src={authenticator}
                                alt="Google Authenticator"
                                className="h-20 w-20 object-contain drop-shadow-md"
                                animate={{ scale: [1, 1.08, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 text-center">
                            Autenticación de Dos Factores
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 text-center">
                            Ingresa el código de 6 dígitos de tu aplicación autenticadora
                        </p>
                        {maskedEmail && (
                            <p className="mt-1 text-xs text-gray-500 text-center">
                                Cuenta: <span className="font-semibold text-gray-800">{maskedEmail}</span>
                            </p>
                        )}

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Código de verificación
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="6"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                                    placeholder="••••••"
                                    autoFocus
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <StatusMessage type="error" message={error} />
                            )}

                            <div className="flex gap-3">
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                                >
                                    Cancelar
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isLoading || code.length !== 6}
                                    className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium disabled:opacity-50"
                                >
                                    {isLoading ? 'Verificando...' : 'Verificar'}
                                </motion.button>
                            </div>
                        </form>

                        <p className="mt-6 text-xs text-center text-gray-500">
                            El código se genera cada 30 segundos. Si no funciona, espera al siguiente código.
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}