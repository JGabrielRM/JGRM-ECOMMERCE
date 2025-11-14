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
import { NavbarProvider } from './JSX-Components/NavBar/NavbarContext.jsx';
import Footer from './JSX-Components/Footer/Footer.jsx';
import VerifyCode from './JSX-Components/Inicio de Sesión/VerifyCode';
import ForgetPassword from './JSX-Components/Inicio de Sesión/ForgetPassword';
import ResetPassword from './JSX-Components/Inicio de Sesión/ResetPassword';
import { useAuth } from './JSX-Components/Services/AuthContext';
import Checkout from './JSX-Components/Checkout/Checkout';
import LoadingScreen from './JSX-Components/Pantalla de Carga/LoadingScreen';
import ConfigurarPerfil from './JSX-Components/Profile/ConfigurarPerfil.jsx';
import IniciarSesionExitoso from './JSX-Components/Inicio de Sesión/IniciarSesionExitoso.jsx';
import HistorialCompras from './JSX-Components/Profile/HistorialCompras.jsx';



const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <LoadingScreen />;
    }
    
    return isAuthenticated() ? children : <Navigate to="/log-in" />;
};

export default function App() {
    const location = useLocation();

    const showNavBarAndFooter = !['log-in', 'register', 'verify-code', 'forgot-password', 'reset-password', 'registro-exitoso', 'success'].includes(
        location.pathname.split('/').pop()
    );

    // Páginas que tienen su propio footer incluido
    const pagesWithOwnFooter = ['/', '/contacto', '/search', '/product', '/addEmployee', '/checkout', '/profile', '/historial-compras'];

    const hasOwnFooter = pagesWithOwnFooter.some(page => {
        if (page === '/product') {
            return location.pathname.startsWith('/product/');
        }
        return location.pathname === page;
    });

    return (
        <AuthProvider>
            <NavbarProvider>
                <CartProvider>
                    {showNavBarAndFooter && <NavBar />}
                    <Cart />
                    <Routes>
                        <Route path="/" element={<Inicio />} />
                        <Route path="/contacto" element={<Contacto />} />
                        <Route path="/log-in" element={<IniciarSesion />} />
                        <Route path="/login/success" element={<IniciarSesionExitoso />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/verify-code" element={<VerifyCode />} />
                        <Route path="/forgot-password" element={<ForgetPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/registro-exitoso" element={<RegistroExitoso />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                        <Route path="/addEmployee" element={<PrivateRoute><CreateProduct /></PrivateRoute>} />
                        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><ConfigurarPerfil /></PrivateRoute>} />
                        <Route path="/historial-compras" element={<PrivateRoute><HistorialCompras /></PrivateRoute>} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                    {showNavBarAndFooter && !hasOwnFooter && <Footer />}
                </CartProvider>
            </NavbarProvider>
        </AuthProvider>
    );
}