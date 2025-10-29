import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
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

export default function App() {
    const location = useLocation();

    // Función para verificar si la ruta actual debe mostrar el NavBar y el Footer
    const isValidRoute = (pathname) => {
        const validRoutes = [
            '/', 
            '/contacto', 
            '/cart', 
            '/addEmployee', 
            '/search', 
            '/register/exito', 
            '/producto/:id'
        ];

        // Verificar rutas exactas
        if (validRoutes.includes(pathname)) {
            return true;
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