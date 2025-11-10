import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080' // Tu URL del backend
});

// Interceptor para añadir el token a todas las solicitudes
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
            localStorage.removeItem('token');
            window.location.href = '/log-in';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;