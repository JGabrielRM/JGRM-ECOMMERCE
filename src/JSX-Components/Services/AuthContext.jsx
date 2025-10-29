import React, { createContext, useState, useEffect} from "react";
import UserService from "../Services/UserService";
import { useCart } from "./CartContext.jsx";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { setCart, clearCart } = useCart();
    const navigate = useNavigate(); // Importar funciones del carrito

    // Cargar usuario desde el backend o localStorage al iniciar la app
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    setIsAuthenticated(true);

                    // Cargar carrito del usuario desde localStorage
                    const savedCart = localStorage.getItem(`cart_${userData.name}`);
                    if (savedCart) {
                        setCart(JSON.parse(savedCart));
                    }
                }
            } catch (error) {
                console.error("Error al obtener usuario:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // Función de inicio de sesión
    const login = async (credentials) => {
        try {
            const response = await UserService.loginUser(credentials);
            if (response.usuario) {
                const userData = { name: response.usuario };
                setUser(userData);
                setIsAuthenticated(true);
                localStorage.setItem("user", JSON.stringify(userData));

                // Cargar carrito del usuario desde localStorage
                const savedCart = localStorage.getItem(`cart_${userData.name}`);
                if (savedCart) {
                    setCart(JSON.parse(savedCart));
                }
            }
        } catch (error) {
            console.error("Error en login:", error);
            throw error;
        }
    };

    // Función de cierre de sesión
    const logout = async () => {
        try {
            await UserService.logoutUser();
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("user"); // Eliminar usuario del localStorage
            clearCart();
            navigate("/log-in") // Limpiar el carrito al cerrar sesión
        } catch (error) {
            console.error("Error en logout:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
