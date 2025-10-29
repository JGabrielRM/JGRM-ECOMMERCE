import axios from 'axios';


const UserService = {
    registerUser: async (userData) => {
        try {
            let API_URL = 'http://localhost:8080/register';
            const response = await axios.post(API_URL, userData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
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
            return response.data; // el backend devuelve "Cuenta verificada correctamente"
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    }
};

export default UserService;
