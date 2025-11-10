import React from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { Inicio } from "./JSX-Components/Pagina-inicio/Inicio.jsx";
import { Contacto } from './JSX-Components/Contacto/Contacto.jsx';
import { NavBar } from './JSX-Components/navbar.jsx';
import IniciarSesion from './JSX-Components/Inicio de Sesión/IniciarSesion.jsx';
import Register from './JSX-Components/Inicio de Sesión/Register.jsx';
import Cart from './JSX-Components/Cart.jsx';
import './index.css';
import CreateProduct from './JSX-Components/Crear-Producto/CreateProduct.jsx';
import Search from './JSX-Components/Search/Search.jsx';
import RegistroExitoso from './JSX-Components/Inicio de Sesión/RegistroExitoso.jsx';
import { AuthProvider } from './JSX-Components/Services/AuthContext.jsx';
import PageNotFound from './JSX-Components/Page not Found/PageNotFound.jsx';
import ProductPage from './JSX-Components/Product Page/ProductPage.jsx';
import { CartProvider } from './JSX-Components/Services/CartContext.jsx';
import Footer from './JSX-Components/Footer/Footer.jsx';
import VerifyCode from './JSX-Components/Inicio de Sesión/VerifyCode';
import ForgetPassword from './JSX-Components/Inicio de Sesión/ForgetPassword';
import ResetPassword from './JSX-Components/Inicio de Sesión/ResetPassword';
import { useAuth } from './JSX-Components/Services/AuthContext';
import Checkout from './JSX-Components/Checkout/Checkout';
import LoadingScreen from './JSX-Components/Pantalla de Carga/LoadingScreen';


const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <LoadingScreen />;
    }
    
    return isAuthenticated() ? children : <Navigate to="/log-in" />;
};

export default function App() {
    const location = useLocation();

    // Función para verificar si la ruta actual debe mostrar el NavBar y el Footer
    const isValidRoute = (pathname) => {

        const excludedRoutes = [
            '/log-in',
            '/register',
            '/forgot-password',
            '/verify-code',
            '/reset-password'
        ];

        const validRoutes = [
            '/', 
            '/contacto', 
            '/cart', 
            '/addEmployee', 
            '/search', 
            '/register/exito', 
            '/producto/:id',
            '/reset-password',
        ];

        if (excludedRoutes.includes(pathname)) {
            return false;
        }
        // Verificar rutas exactas
        if (validRoutes.includes(pathname)) {
            return true;
        }
        const resetPasswordPattern = /^\/reset-password(?:\?token=[\w-]+)?$/;
        if (resetPasswordPattern.test(pathname)) {
            return true;
        }
        if (pathname.startsWith('/reset-password')) {
            return false;
        }

        // Verificar rutas dinámicas como /producto/:id
        const dynamicRoutes = [/^\/producto\/\d+$/]; // Expresión regular para /producto/:id
        return dynamicRoutes.some((regex) => regex.test(pathname));
    };

    const showNavBar = isValidRoute(location.pathname);

    return (
        <div>
            <CartProvider>
                <AuthProvider>
                    {showNavBar && <NavBar />} {/* Mostrar NavBar solo en rutas válidas */}
                    <Routes>
                        <Route path='/' element={<Inicio />} />
                        <Route path='/contacto' element={<Contacto />} />
                        <Route path='/log-in' element={<IniciarSesion />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/cart' element={<Cart />} />
                        <Route path='/addEmployee' element={<CreateProduct />} />
                        <Route path='/search' element={<Search />} />
                        <Route path='/register/exito' element={<RegistroExitoso />} />
                        <Route path='/producto/:id' element={<ProductPage />} />
                        <Route path="/verify-code" element={<VerifyCode />} />
                        <Route path='/forgot-password' element={<ForgetPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                        <Route path='*' element={<PageNotFound />} />
                        
                    </Routes>
                    <Cart />
                    {showNavBar && <Footer />} {/* Mostrar Footer solo en rutas válidas */}
                     {/* Componente del carrito */}
                </AuthProvider>
            </CartProvider>
        </div>
    );
}