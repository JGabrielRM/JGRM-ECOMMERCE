import axios from 'axios';


const UserService = {
    registerUser: async (userData) => {
        try {
            const response = await axios.post('http://localhost:8080/register', userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            // Si hay datos en la respuesta a pesar del error 500, los devolvemos
            if (error.response?.status === 500 && error.response?.data?.usuario) {
                return error.response.data;
            }
            
            throw {
                response: error.response,
                status: error.response?.status,
                message: error.response?.data?.message || 'Error en el registro'
            };
        }
    },

    loginUser: async (loginData) => {
        try {
            let API_URL = 'http://localhost:8080/auth/login';
            const response = await axios.post(`${API_URL}`, loginData, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    getUserDetails: async () => {
        try {
            let API_URL = 'http://localhost:8080/auth/user';
            const response = await axios.get(API_URL, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    logoutUser: async () => {
        try {
            let API_URL = 'http://localhost:8080/auth/logout';
            const response = await axios.post(API_URL, {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    verifyEmail: async (token) => {
        try {
            const API_URL = `http://localhost:8080/verify?token=${token}`;
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    verifyCode: async ({ code, email }) => {
        try {
            const API_URL = 'http://localhost:8080/register/verify-code';
            const response = await axios.post(API_URL, { code, email });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    resendVerificationCode: async ({ email }) => {dfdffd
        try {
            const API_URL = 'http://localhost:8080/resend-verification-code';
            const response = await axios.post(API_URL, { email });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

        // Agregar estos métodos al objeto UserService
        requestPasswordReset: async (email) => {
        try {
            const response = await axios.post('http://localhost:8080/auth/forgot-password', { 
                email_usuario: email  // ✅ Cambio aquí
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    resetPassword: async (token, newPassword) => {  // ✅ Cambio en parámetros
        try {
            const response = await axios.post('http://localhost:8080/auth/reset-password', {
                token: token,           // ✅ Token UUID (no code)
                newPassword: newPassword // ✅ Correcto
            });
            return response.data;
        } catch (error) {
            throw error;
        }
},
};

    

export default UserService;
