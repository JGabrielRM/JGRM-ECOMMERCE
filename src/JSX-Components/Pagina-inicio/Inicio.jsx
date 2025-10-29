import React from "react";
import { Carousel } from "./Carousel.jsx";
import CatalogoOfertas from "./CatalogoOfertas.jsx";
import ScrollDescuento from "./ScrollDescuento.jsx";
import PromocionInicio from "./PromocionInicio.jsx";


export function Inicio () {
    let slides = [
        {
            image: '/carrusel-images/1.png',
            alt: 'Imagen 1'
        },
        {
            image: '/carrusel-images/2.png',
            alt: 'Imagen 2'
        },
        {
            image: '/carrusel-images/3.png',
            alt: 'Imagen 3'
        }
    ]
    return (
        <div className='w-full flex flex-col items-center'>
        <Carousel slides={slides} />
        <PromocionInicio />
        <ScrollDescuento />
        <CatalogoOfertas />
        </div>
    );
}

export default Inicio;