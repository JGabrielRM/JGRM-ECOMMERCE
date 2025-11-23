import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function SessionRevoked() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const status = searchParams.get('status');
    const userName = searchParams.get('user');
    const errorReason = searchParams.get('reason');

    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Redirigir al login después de 5 segundos
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    navigate('/log-in');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fadeIn">
                    {/* Icono de éxito */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Título */}
                    <h1 className="text-2xl font-bold text-green-600 mb-4">
                        Sesión Cerrada Exitosamente
                    </h1>

                    {/* Mensaje */}
                    <p className="text-gray-600 mb-6">
                        Hola <strong>{userName || 'Usuario'}</strong>, la sesión sospechosa ha sido cerrada correctamente.
                        El token de acceso ha sido revocado y ya no podrá ser utilizado.
                    </p>

                    {/* Info box */}
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 text-left rounded">
                        <p className="text-sm text-green-800 font-semibold mb-2">
                            🔒 Tu cuenta está segura
                        </p>
                        <p className="text-sm text-green-700">
                            Si no reconocías esa actividad, te recomendamos cambiar tu contraseña inmediatamente para mayor seguridad.
                        </p>
                    </div>

                    {/* Countdown */}
                    <p className="text-sm text-gray-500 mb-4">
                        Redirigiendo al login en {countdown} segundos...
                    </p>

                    {/* Botón */}
                    <button
                        onClick={() => navigate('/log-in')}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                        Ir al Login Ahora
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        const errorMessages = {
            invalid_token: 'El enlace de revocación no es válido o ya expiró.',
            server_error: 'Ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.',
        };

        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fadeIn">
                    {/* Icono de error */}
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                    {/* Título */}
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        Error al Cerrar Sesión
                    </h1>

                    {/* Mensaje */}
                    <p className="text-gray-600 mb-6">
                        {errorMessages[errorReason] || 'Ocurrió un error inesperado.'}
                    </p>

                    {/* Botones */}
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/log-in')}
                            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Ir al Login
                        </button>
                        <button
                            onClick={() => navigate('/contacto')}
                            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                        >
                            Contactar Soporte
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Estado por defecto (no debería llegar aquí)
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                <p className="text-gray-600">Cargando...</p>
            </div>
        </div>
    );
}
