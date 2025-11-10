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
        try {
            const response = await axiosInstance.post('/auth/login', credentials);
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                
                // Guardar datos del usuario
                setUser({
                    email_usuario: response.data.email,
                    nombre_usuario: response.data.nombre,
                });
                
                return response.data;
            }
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Credenciales inválidas');
            } else if (error.response?.status === 403) {
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