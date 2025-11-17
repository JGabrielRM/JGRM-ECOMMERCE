import { motion } from 'framer-motion';
import { FaCircleCheck } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import React from 'react';

export default function RegistroExitoso() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-9">
            <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1.2 }} 
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center text-center"
            >
                <motion.div 
                    initial={{ rotate: -10, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaCircleCheck className="w-16 h-16 text-green-500" />
                </motion.div>
                
                <h2 className="text-2xl font-semibold text-gray-800 mt-4">¡Registro Exitoso!</h2>
                <p className="text-gray-600 mt-2">Tu cuenta ha sido creada correctamente.</p>
                
                <Link to="/log-in" className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition">
                    Ir al Inicio de Sesión
                </Link>
            </motion.div>
        </div>
    );
}
