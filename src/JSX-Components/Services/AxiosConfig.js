import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080'
});

// Interceptor para añadir el token a todas las solicitudes
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('🔑 [AxiosConfig] Token en localStorage:', token ? `Existe (${token.substring(0, 20)}...)` : '❌ NO EXISTE');
        console.log('🌐 [AxiosConfig] Request a:', config.method.toUpperCase(), config.url);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ [AxiosConfig] Header Authorization agregado');
        } else {
            console.log('⚠️ [AxiosConfig] NO se agregó header Authorization (sin token)');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log('🚫 [AxiosConfig] Error 401 - Removiendo token');
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;