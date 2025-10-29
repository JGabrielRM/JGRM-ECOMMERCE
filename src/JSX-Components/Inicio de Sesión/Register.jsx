import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsHouseDoor } from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";
import UserService from '../Services/UserService';
import RegistroExitoso from './RegistroExitoso';

export default function Register() {
    const [user, setUser] = useState({
        nombre_usuario: '',
        email_usuario: '',
        password_usuario: ''
    });

 // Estado para controlar el modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await UserService.registerUser(user);
            setIsModalOpen(true); // Mostrar el modal al completar el registro
        } catch (error) {
            alert(`Error: ${error}`);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false); // Cerrar el modal
    };

    return (
        
        <div className="relative min-h-screen">
            {/* Contenedor principal con efecto blur */}
            <div className={`transition-all duration-300 ${isModalOpen ? 'opacity-30' : ''}`}>
                {/* Botón de inicio */}

                {/* Formulario de registro */}
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-full max-w-lg space-y-8 bg-white p-10 rounded-xl shadow-lg">
                        <div className="flex items-center space-x-2 mb-4">
                                  <Link to="/" className="flex items-center text-zinc-800 hover:text-zinc-600">
                                    <IoArrowBack className="h-6 w-6" />
                                    <span className="ml-2">Inicio</span>
                                  </Link>
                                </div>
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <Link to='/'><img alt="Your Company" src="/logo behance.png" className="mx-auto h-25 w-auto"/></Link>
                            <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">Crea tu cuenta!</h2>
                        </div>

                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="nombre_usuario" className="block text-sm font-medium text-gray-900">Nombre de usuario</label>
                                    <input
                                        id="nombre_usuario"
                                        name="nombre_usuario"
                                        type="text"
                                        value={user.nombre_usuario}
                                        onChange={handleChange}
                                        required
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-900 sm:text-sm mb-4"
                                    />

                                    <label htmlFor="email_usuario" className="block text-sm font-medium text-gray-900">Correo electrónico</label>
                                    <input
                                        id="email_usuario"
                                        name="email_usuario"
                                        type="email"
                                        value={user.email_usuario}
                                        onChange={handleChange}
                                        required
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-900 sm:text-sm mb-4"
                                    />

                                    <label htmlFor="password_usuario" className="block text-sm font-medium text-gray-900">Contraseña</label>
                                    <input
                                        id="password_usuario"
                                        name="password_usuario"
                                        type="password"
                                        value={user.password_usuario}
                                        onChange={handleChange}
                                        required
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-900 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <button type="submit" className="flex w-full justify-center rounded-md bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900">
                                        Crear cuenta
                                    </button>
                                </div>
                            </form>

                            <p className="mt-10 text-center text-sm text-gray-500">
                                ¿Ya tienes una Cuenta?{' '}
                                <Link to='/log-in' className="font-semibold text-gray-900 hover:text-gray-600">Inicia Sesión!</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de registro exitoso */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className=" p-8 rounded-xl  max-w-md w-full mx-4">
                        <RegistroExitoso />
                        
                    </div>
                </div>
            )}
        </div>
    );
}
