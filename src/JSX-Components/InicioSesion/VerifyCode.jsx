import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import UserService from '../Services/UserService';
import { IoArrowBack } from "react-icons/io5";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function VerifyCode() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleChange = (index, value) => {
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value !== '' && index < 5) {
                const nextInput = document.getElementById(`code-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const verificationCode = code.join('');
        if (verificationCode.length !== 6) {
            setError('Por favor ingresa el código completo');
            setLoading(false);
            return;
        }

        try {
            const response = await UserService.verifyCode({ code: verificationCode, email });
            if (response.success) {
                setVerificationStatus('success');
                setTimeout(() => {
                    navigate('/log-in');
                }, 2000); // Redirige después de 2 segundos
            } else {
                setVerificationStatus('error');
            }
        } catch (err) {
            setError(err.message || 'Error al verificar el código');
            setVerificationStatus('error');
        } finally {
            setLoading(false);
        }
    };

    // Componente de mensaje de estado
    const StatusMessage = ({ status }) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mt-4 p-4 rounded-lg shadow-lg flex items-center justify-center space-x-3 ${
                    status === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}
            >
                {status === 'success' ? (
                    <>
                        <FaCheckCircle className="text-green-500 text-xl" />
                        <span className="text-green-700 font-medium">
                            ¡Código verificado correctamente! Redirigiendo...
                        </span>
                    </>
                ) : (
                    <>
                        <FaTimesCircle className="text-red-500 text-xl" />
                        <span className="text-red-700 font-medium">
                            Error al verificar el código. Por favor, intenta nuevamente.
                        </span>
                    </>
                )}
            </motion.div>
        );
    };

    const maskEmail = (email) => {
    if (!email) return '';
    
    const [username, domain] = email.split('@');
    const domainParts = domain.split('.');
    const mainDomain = domainParts[0];
    const extension = domainParts.slice(1).join('.');
    
    // Asegurar que no intentemos hacer repeat con números negativos
    const usernameLength = Math.max(0, username.length - 4);
    const domainLength = Math.max(0, mainDomain.length - 4);
    
    // Mostrar solo los primeros 4 caracteres si hay suficientes, o todo si es más corto
    const maskedUsername = username.slice(0, 4) + (usernameLength > 0 ? '*'.repeat(usernameLength) : '');
    const maskedDomain = mainDomain.slice(0, 4) + (domainLength > 0 ? '*'.repeat(domainLength) : '');
    
    return `${maskedUsername}@${maskedDomain}.${extension}`;
};


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-2xl"
            >
                <div className="bg-white p-12 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-2 mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-zinc-800 hover:text-zinc-600"
                        >
                            <IoArrowBack className="h-6 w-6" />
                            <span className="ml-2">Volver</span>
                        </button>
                    </div>

                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="text-center px-8"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Verifica tu correo
                        </h2>
                        <p className="text-lg text-gray-600 mb-10">
                            Hemos enviado un código de verificación a <br/>
                            <span className="font-medium text-gray-900">{email ? maskEmail(email) : ''}</span>
                        </p>

                        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                            <div className="flex justify-center space-x-6">
                                {code.map((digit, index) => (
                                    <motion.input
                                        key={index}
                                        whileFocus={{ scale: 1.1 }}
                                        id={`code-${index}`}
                                        type="text"
                                        maxLength="1"
                                        className="w-16 h-16 text-center text-3xl border-2 rounded-lg focus:border-gray-600 focus:ring-0 transition-all"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                    />
                                ))}
                            </div>

                            {error && (
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-red-500 mt-2"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-2/3 mx-auto flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                {loading ? 'Verificando...' : 'Verificar código'}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>

                {/* Mensaje de estado debajo del contenedor */}
                <AnimatePresence>
                    {verificationStatus && (
                        <StatusMessage status={verificationStatus} />
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}