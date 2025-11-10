import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/logo behance.png";
import { CiShoppingBasket, CiSearch, CiLogin } from "react-icons/ci";
import { BsHouseDoor } from "react-icons/bs";
import { TiMessages } from "react-icons/ti";
import { IoMdAdd } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import AuthContext from './Services/AuthContext';
import { useCart } from './Services/CartContext.jsx'; // Importar el contexto del carrito

const PascalCase = (str) => {
    if (!str) return ''; // Manejar el caso cuando str es undefined o null
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export function NavBar() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const { getTotalItems, openCart } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/log-in');
    };

    return (
        <nav className="bg-white p-4 shadow-md sticky top-0 z-50 w-full">
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
                        <button
                            onClick={openCart} // Llama a la función para abrir el carrito
                            className='text-zinc-800 flex items-center space-x-2'
                        >
                            <CiShoppingBasket className='h-10 w-auto' />
                            <span>{getTotalItems()}</span> {/* Mostrar la cantidad de productos en el carrito */}
                        </button>
                    </li>
                    {isAuthenticated ? (
                        // Mostrar ícono de usuario y menú personalizado si está autenticado
                        <li className='relative px-5 shadow rounded-2xl flex items-center space-x-2 transform active:scale-95 hover:scale-105 ease-in-out duration-300'>
                            <FaUserCircle className='h-10 w-auto text-zinc-800' />
                            <span className='text-zinc-800'>{PascalCase(user?.nombre_usuario || '')}</span>
                            <button
                                onClick={toggleMenu}
                                className="flex items-center text-zinc-800 focus:outline-none"
                            >
                                <IoIosArrowDown className="h-5 w-5 ml-2" />
                            </button>
                            {menuOpen && (
                                <ul className="absolute right-0 mt-20 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                                    <li
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                                        onClick={handleLogout}
                                    >
                                        Cerrar sesión
                                    </li>
                                </ul>
                            )}
                        </li>
                    ) : (
                        // Mostrar botón de iniciar sesión si no está autenticado
                        <li className='px-5 shadow rounded-2xl flex items-center space-x-2 transform active:scale-95 hover:scale-105 ease-in-out duration-300'>
                            <Link to="/log-in" className='text-zinc-800 flex items-center space-x-2'>
                                <CiLogin className='h-10 w-auto' />
                                <span>Inicia Sesión</span>
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}
