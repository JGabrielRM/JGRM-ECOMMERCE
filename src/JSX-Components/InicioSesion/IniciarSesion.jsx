import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

import AuthContext from '../Services/AuthContext';
import StatusMessage from '../StatusMessage/StatusMessage';
import LoadingScreen from '../Pantalla de Carga/LoadingScreen';
import TwoFactorLoginModal from './TwoFactorLoginModal.jsx'; // ⭐ NUEVO IMPORT
import authenticator from '../../assets/assets-images-project/authenticator.png';
import axiosInstance from '../Services/AxiosConfig';

export default function IniciarSesion() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);
    
    // ⭐ NUEVOS ESTADOS
    const [showTwoFactorPrompt, setShowTwoFactorPrompt] = useState(false); // Pregunta si quiere configurar 2FA
    const [show2FALoginModal, setShow2FALoginModal] = useState(false); // Pide código 2FA para login
    const [pendingCredentials, setPendingCredentials] = useState(null); // Guarda credenciales para reintentar con código

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            const emailParam = searchParams.get('email');
            setStatus({
                type: 'success',
                message: `¡Cuenta creada exitosamente con ${emailParam}! Ahora puedes iniciar sesión.`
            });
            setEmail(emailParam || '');
        }
    }, [searchParams]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setShowTwoFactorPrompt(false);
        setShow2FALoginModal(false); // ⭐ CERRAR MODAL 2FA
        setIsLoading(true);
        setIsLoadingComplete(false);

        try {
            const result = await login({ 
                email_usuario: email, 
                password_usuario: password 
            });

            // ⭐ CASO 1: Requiere código 2FA (usuario YA tiene 2FA habilitado)
            if (result.requires2FA && result.twoFactorEnabled) {
                setIsLoading(false);
                setPendingCredentials({ email, password });
                setShow2FALoginModal(true); // Mostrar modal para INGRESAR código
                setStatus({
                    type: 'info',
                    message: 'Se requiere autenticación de dos factores'
                });
                return;
            }

            // ⭐ CASO 2: Login exitoso (sin 2FA o ya validado)
            if (result.success) {
                setIsLoadingComplete(true);
                setStatus({
                    type: 'success',
                    message: '¡Inicio de sesión exitoso!'
                });
                
                // ✅ Solo mostrar el modal si el login fue directo (sin código 2FA)
                // Si llegamos aquí sin código 2FA, significa que el usuario NO tiene 2FA
                // Si llegamos aquí con código 2FA, el usuario YA tiene 2FA configurado
                
                console.log('🔍 Login exitoso - pendingCredentials:', pendingCredentials);
                
                if (!pendingCredentials) {
                    // Login directo sin 2FA - mostrar modal para configurar
                    setShowTwoFactorPrompt(true);
                } else {
                    // Login con código 2FA - ya tiene 2FA configurado, no mostrar modal
                    navigate('/');
                }
            }

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

    // ⭐ NUEVA FUNCIÓN: Manejar verificación del código 2FA para LOGIN
    const handle2FALoginVerify = async (code) => {
    if (!pendingCredentials) return;

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
        // Reintentar login CON el código 2FA
        const result = await login({
            email_usuario: pendingCredentials.email,
            password_usuario: pendingCredentials.password,
            twoFactorCode: code
        });

        console.log('🔍 Resultado del login 2FA:', result); // <-- AGREGAR ESTE LOG

        if (result && result.success) {
            setShow2FALoginModal(false);
            setPendingCredentials(null); // <-- LIMPIAR credenciales pendientes
            setIsLoadingComplete(true);
            setStatus({
                type: 'success',
                message: '¡Inicio de sesión exitoso con 2FA!'
            });
            
            setTimeout(() => navigate('/'), 1500);
        } else if (result && result.requires2FA) {
            // Si todavía requiere 2FA, el código fue inválido
            setIsLoading(false);
            throw new Error('Código 2FA inválido. Por favor intenta de nuevo.');
        } else {
            // Cualquier otro caso
            setIsLoading(false);
            console.error('❌ Login falló sin razón clara:', result);
            throw new Error('Error al iniciar sesión. Por favor intenta de nuevo.');
        }
    } catch (err) {
        setIsLoading(false);
        console.error('❌ Error en handle2FALoginVerify:', err); // <-- AGREGAR ESTE LOG
        throw err; // El modal lo manejará
    }
};

    const handleTwoFactorChoice = (option) => {
    setShowTwoFactorPrompt(false);
    
    if (option === 'google') {
        // Verificar que el token exista antes de navegar
        const token = localStorage.getItem('token');
        console.log('🔑 Token antes de navegar a configurar-2fa:', token ? 'Existe ✅' : '❌ NO EXISTE');
        
        if (!token) {
            setStatus({
                type: 'error',
                message: 'Error: No hay sesión activa. Intenta hacer login de nuevo.'
            });
            return;
        }
        
        navigate('/configurar-2fa', { state: { email } });
    } else {
        // Usuario decidió omitir configuración de 2FA
        navigate('/');
    }
};

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
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

            {/* ⭐ MODAL PARA INGRESAR CÓDIGO 2FA (LOGIN) */}
            <TwoFactorLoginModal
                isOpen={show2FALoginModal}
                onClose={() => {
                    setShow2FALoginModal(false);
                    setPendingCredentials(null);
                }}
                onVerify={handle2FALoginVerify}
                email={pendingCredentials?.email}
                isLoading={isLoading}
            />

            {/* ⭐ MODAL PARA PREGUNTAR SI QUIERE CONFIGURAR 2FA (después de login exitoso) */}
            <AnimatePresence>
                {showTwoFactorPrompt && !isLoading && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                        >
                            <div className="flex justify-center p-3">
                                <motion.img
                                    src={authenticator}
                                    alt="Google Authenticator"
                                    className="h-20 w-20 object-contain drop-shadow-md"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 text-center">
                                ¿Deseas habilitar la autenticación 2FA con Google?
                            </h3>
                            <p className="mt-3 text-sm text-gray-600 text-center">
                                Añade una capa extra de seguridad configurándola ahora o continúa hacia la página principal y hazlo más tarde.
                            </p>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleTwoFactorChoice('google')}
                                    className="w-full rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
                                >
                                    Configurar 2FA con Google
                                </motion.button>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleTwoFactorChoice('skip')}
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Omitir por ahora
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* RESTO DEL COMPONENTE (sin cambios) */}
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-lg space-y-8 bg-white p-12 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-2 mb-4">
                        <Link to="/" className="flex items-center text-zinc-800 hover:text-zinc-600">
                            <IoArrowBack className="h-6 w-6" />
                            <span className="ml-2">Inicio</span>
                        </Link>
                    </div>

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
                                    disabled={isLoading || showTwoFactorPrompt}
                                    className="flex w-full justify-center rounded-md bg-slate-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                                >
                                    Iniciar Sesión
                                </button>
                            </div>
                        </form>

                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">O continúa con</span>
                            </div>
                        </div>

                        <motion.button
                            type="button"
                            onClick={handleGoogleLogin}
                            whileHover={{ scale: 1.02, backgroundColor: '#f8f9fa' }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full mt-4 flex justify-center items-center space-x-3 rounded-full bg-white border-2 border-gray-300 px-6 py-3 text-base font-semibold text-gray-900 shadow-md hover:shadow-lg hover:border-gray-400 transition-all duration-200"
                        >
                            <FaGoogle className="h-6 w-6 text-blue-500" />
                            <span>Continuar con Google</span>
                        </motion.button>

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