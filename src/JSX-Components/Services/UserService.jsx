import axiosInstance from './AxiosConfig';

const UserService = {
    registerUser: async (userData) => {
        try {
            const response = await axiosInstance.post('/register', {
                email_usuario: userData.email_usuario,
                nombre_usuario: userData.nombre_usuario,
                password_usuario: userData.password_usuario
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    verifyCode: async (data) => {
        try {
            const response = await axiosInstance.post('/register/verify-code', {
                email: data.email,
                code: data.code
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    requestPasswordReset: async (email) => {
        try {
            const response = await axiosInstance.post('/auth/forgot-password', { 
                email_usuario: email 
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    resetPassword: async (token, password) => {
        try {
            const response = await axiosInstance.post('/auth/reset-password', {
                token,
                newPassword: password
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default UserService;