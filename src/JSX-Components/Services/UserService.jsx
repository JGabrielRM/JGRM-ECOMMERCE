import axiosInstance from './AxiosConfig';

const UserService = {
    registerUser: async (userData) => {
        try {
            const response = await axiosInstance.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    verifyCode: async (data) => {
        try {
            const response = await axiosInstance.post('/auth/verify-code', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    requestPasswordReset: async (email) => {
        try {
            const response = await axiosInstance.post('/auth/forgot-password', { email });
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
