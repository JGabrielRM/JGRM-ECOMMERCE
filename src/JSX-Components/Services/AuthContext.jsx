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
            const response = await axiosInstance.get('/auth/verify');
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await axiosInstance.post('/auth/login', credentials);
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                setUser(response.data.user);
                return response.data;
            }
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Credenciales inválidas');
            } else if (error.response?.status === 403) {
                throw new Error('Usuario no verificado');
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
        return !!localStorage.getItem('token');
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
            {!loading && children}
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