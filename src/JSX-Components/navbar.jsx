import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../assets/logo behance.png";
import { CiShoppingBasket, CiSearch, CiLogin } from "react-icons/ci";
import { BsHouseDoor } from "react-icons/bs";
import { TiMessages } from "react-icons/ti";
import { IoMdAdd } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FaCog, FaStore, FaHistory } from "react-icons/fa";
import AuthContext from './Services/AuthContext';
import { useCart } from './Services/CartContext.jsx';
import { NavbarContext } from './NavBar/NavbarContext';

const PascalCase = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export function NavBar() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, loading } = useContext(AuthContext);
    const { getTotalItems, isOpen, setIsOpen } = useCart();
    const { isSticky } = useContext(NavbarContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/log-in');
    };

    const handleNavigate = (path) => {
        navigate(path);
        setMenuOpen(false);
    };

    // Cerrar menú al hacer clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    if (loading) {
        return null;
    }

    const isAuth = isAuthenticated();

    return (
        <>
            {/* Overlay oscuro - cubre TODO incluyendo navbar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40"
                        style={{ top: 0, left: 0 }}
                    />
                )}
            </AnimatePresence>

            {/* Navbar - sticky o no depende del contexto */}
            <motion.nav 
                className={`bg-white p-4 shadow-md ${isSticky ? 'sticky' : 'relative'} top-0 z-30 w-full`}
            >
                <div className='container mx-auto flex justify-between items-center'>
                    {/* Menú de navegación izquierda */}
                    <ul className='flex space-x-4'>
                        <li className='px-5 shadow rounded-2xl flex items-center space-x-2 transform active:scale-95 hover:scale-105 ease-in-out duration-300'>
                            <Link to="/" className='text-zinc-800 flex items-center space-x-2'>
                                <BsHouseDoor className='h-10 w-auto px-2' />
                                <span>Inicio</span>
                            </Link>
                        </li>
                        <li className='px-5 shadow rounded-2xl flex items-center space-x-2 transform active:scale-95 hover:scale-105 ease-in-out duration-300'>
                            <Link to="/contacto" className='text-zinc-800 flex items-center space-x-2'>
                                <TiMessages className='h-10 w-auto px-2' />
                                <span>Contáctanos</span>
                            </Link>
                        </li>
                        <li className='px-5 shadow rounded-2xl flex items-center space-x-2 transform active:scale-95 hover:scale-105 ease-in-out duration-300'>
                            <Link to="/addEmployee" className='text-zinc-800 flex items-center space-x-2'>
                                <IoMdAdd className='h-10 w-auto px-2' />
                            </Link>
                        </li>
                    </ul>

                    {/* Logo central */}
                    <div className='absolute left-1/2 transform -translate-x-1/2'>
                        <Link to="/">
                            <img src={logo} alt='logo' className='h-12 w-10'></img>
                        </Link>
                    </div>

                    {/* Menú de navegación derecha */}
                    <ul className="flex space-x-4">
                        <li className='px-5 shadow rounded-2xl flex items-center space-x-2 transform active:scale-95 hover:scale-105 ease-in-out duration-300'>
                            <Link to="/search" className='text-zinc-800 flex items-center space-x-2'>
                                <CiSearch className='h-10 w-auto' />
                                <span>Buscar</span>
                            </Link>
                        </li>
                        <li className='px-5 shadow rounded-2xl transform active:scale-95 hover:scale-105 ease-in-out duration-300'>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsOpen(!isOpen)}
                                className='text-zinc-800 flex items-center space-x-2 transition-all duration-300'
                                disabled={isOpen}
                            >
                                <CiShoppingBasket className='h-10 w-auto' />
                                <motion.span 
                                    animate={isOpen ? { scale: 0.8 } : { scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {getTotalItems()}
                                </motion.span>
                            </motion.button>
                        </li>
                        {isAuth ? (
                            <li className='relative px-5 shadow rounded-2xl flex items-center space-x-2 transform active:scale-95 hover:scale-105 ease-in-out duration-300' ref={menuRef}>
                                <FaUserCircle className='h-10 w-auto text-zinc-800' />
                                <span className='text-zinc-800 font-medium'>
                                    {PascalCase(user?.nombre_usuario || 'Usuario')}
                                </span>
                                <motion.button
                                    animate={{ rotate: menuOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={toggleMenu}
                                    className="flex items-center text-zinc-800 focus:outline-none"
                                >
                                    <IoIosArrowDown className="h-5 w-5 ml-2" />
                                </motion.button>
                                
                                <AnimatePresence>
                                    {menuOpen && (
                                        <motion.ul 
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50"
                                        >
                                            {/* Configurar perfil */}
                                            <motion.li
                                                whileHover={{ backgroundColor: '#f3f4f6' }}
                                                className="px-4 py-3 cursor-pointer text-gray-700 font-medium transition-colors duration-200 flex items-center space-x-2 border-b border-gray-200"
                                                onClick={() => handleNavigate('/profile')}
                                            >
                                                <FaCog className="h-4 w-4" />
                                                <span>Configurar perfil</span>
                                            </motion.li>

                                            {/* Historial de compras */}
                                            <motion.li
                                                whileHover={{ backgroundColor: '#f3f4f6' }}
                                                className="px-4 py-3 cursor-pointer text-gray-700 font-medium transition-colors duration-200 flex items-center space-x-2 border-b border-gray-200"
                                                onClick={() => handleNavigate('/historial-compras')}
                                            >
                                                <FaHistory className="h-4 w-4" />
                                                <span>Historial de compras</span>
                                            </motion.li>

                                            {/* Vender */}
                                            <motion.li
                                                whileHover={{ backgroundColor: '#f3f4f6' }}
                                                className="px-4 py-3 cursor-pointer text-gray-700 font-medium transition-colors duration-200 flex items-center space-x-2 border-b border-gray-200"
                                                onClick={() => handleNavigate('/addEmployee')}
                                            >
                                                <FaStore className="h-4 w-4" />
                                                <span>Vender</span>
                                            </motion.li>

                                            {/* Cerrar sesión */}
                                            <motion.li
                                                whileHover={{ backgroundColor: '#fef2f2' }}
                                                className="px-4 py-3 cursor-pointer text-red-500 font-medium transition-colors duration-200"
                                                onClick={handleLogout}
                                            >
                                                Cerrar sesión
                                            </motion.li>
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </li>
                        ) : (
                            <li className='px-5 shadow rounded-2xl flex items-center space-x-2 transform active:scale-95 hover:scale-105 ease-in-out duration-300'>
                                <Link to="/log-in" className='text-zinc-800 flex items-center space-x-2'>
                                    <CiLogin className='h-10 w-auto' />
                                    <span>Inicia Sesión</span>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </motion.nav>
        </>
    );
}