import React from 'react';
import { Link } from 'react-router-dom';



export default function ProductCardInicio({ idProduct, productName, productPrice, productDescription, imageUrl, enOferta }) {
    return (
        <div className="border-none rounded-lg shadow-lg p-4 w-full bg-white relative transform hover:scale-101 ease-in-out duration-300 flex flex-col justify-between">
            <Link to={`/product/${idProduct}`} className="w-full h-full flex flex-col justify-between">
                {enOferta && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Oferta
                    </div>
                )}
                {/* Imagen */}
                <div className="w-full h-40 sm:h-48 md:h-56 flex justify-center items-center bg-white overflow-hidden">
                    <img src={imageUrl} alt={productName} className="max-h-full max-w-full object-contain" />
                </div>
                {/* Contenido */}
                <div className="flex flex-col flex-grow justify-between mt-4">
                    <h2 className="text-base sm:text-lg font-bold text-center">{productName}</h2>
                    <p className="text-gray-600 text-sm text-center mt-2 min-h-[50px]">{productDescription}</p>
                </div>
                {/* Precio */}
                <p className="text-lime-600 text-xl sm:text-2xl font-bold text-center mt-4 mb-2">COP {productPrice}</p>
            </Link>
        </div>
    );
}
