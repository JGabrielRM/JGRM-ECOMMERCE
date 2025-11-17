import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from './AxiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verificar token al cargar la aplicación
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, []);

    // Verificar si el token es válido
    const checkAuth = async () => {
        try {
            const response = await axiosInstance.get('/auth/user');
            setUser(response.data);
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
    console.log('🔵 LOGIN - Credenciales enviadas:', {
        email: credentials.email_usuario,
        hasPassword: !!credentials.password_usuario,
        hasTwoFactorCode: !!credentials.twoFactorCode,
        twoFactorCode: credentials.twoFactorCode
    });

    try {
        const response = await axiosInstance.post('/auth/login', credentials);
        
        console.log('✅ LOGIN - Respuesta exitosa:', response.data);
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            
            setUser({
                email_usuario: response.data.email_,
                nombre_usuario: response.data.nombre,
            });
            
            return { success: true, data: response.data };
        }
    } catch (error) {
        console.log('❌ LOGIN - Error capturado:', {
            status: error.response?.status,
            error: error.response?.data?.error,
            message: error.response?.data?.message,
            fullData: error.response?.data
        });

        // ⭐ DETECTAR SI REQUIERE 2FA
        if (error.response?.status === 403 && error.response?.data?.error === '2FA_REQUIRED') {
            console.log('🔐 LOGIN - Requiere 2FA');
            return {
                success: false,
                requires2FA: true,
                twoFactorEnabled: true,
                message: error.response.data.message,
                email: credentials.email_usuario
            };
        }

        // ⭐ DETECTAR CÓDIGO 2FA INVÁLIDO
        if (error.response?.status === 401 && error.response?.data?.error === 'INVALID_2FA_CODE') {
            console.log('❌ LOGIN - Código 2FA inválido');
            throw new Error('Código 2FA inválido. Intenta nuevamente.');
        }

        // Otros errores
        if (error.response?.status === 401) {
            throw new Error('Credenciales inválidas');
        } else if (error.response?.status === 403) {
            console.log('⚠️ LOGIN - 403 sin 2FA_REQUIRED, lanzando error usuario no verificado');
            throw new Error('Usuario no verificado');
        } else if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Error en el servidor');
        }
    }
};

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem('token');
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                login, 
                logout, 
                isAuthenticated,
                loading 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export default AuthContext;