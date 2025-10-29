import React from 'react';

export default function PromocionInicio() {
    return (
        <div className="w-full bg-gray-100 py-10">
            <div className="container mx-auto flex flex-col items-center">
                <h2 className="text-4xl font-bold text-center mb-10">¡Promociones de la Semana!</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white shadow-lg p-4">
                        <img src="/carrusel-images/promocion1.png" alt="Promoción 1" className="w-full h-auto" />
                    </div>
                    <div className="bg-white shadow-lg p-4">
                        <img src="/carrusel-images/promocion2.png" alt="Promoción 2" className="w-full h-auto" />
                    </div>
                    <div className="bg-white shadow-lg p-4">
                        <img src="/carrusel-images/promocion3.png" alt="Promoción 3" className="w-full h-auto" />
                    </div>
                </div>
            </div>
        </div>
    )
}