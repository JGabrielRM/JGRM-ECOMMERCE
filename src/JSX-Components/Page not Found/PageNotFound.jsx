import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
    const navigate = useNavigate();

    return (
        <main className="h-screen flex flex-col items-center justify-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-gray-600">404</p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                    Página no encontrada
                </h1>
                <p className="mt-6 text-lg text-gray-500">
                    Lo sentimos, no pudimos encontrar la página que estás buscando.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <button
                        onClick={() => navigate('/')}
                        className="rounded-md bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Volver al inicio
                    </button>
                    <button
                        onClick={() => navigate('/contacto')}
                        className="text-sm font-semibold text-gray-900"
                    >
                        Contactar soporte <span aria-hidden="true">&rarr;</span>
                    </button>
                </div>
            </div>
        </main>
    );
}