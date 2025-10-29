import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import '../../index.css';

export default function NavigationSlide({ slides, currentIndex, setCurrentIndex }) {
    return (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {slides.map((_, index) => (
                <div
                    key={index}
                    className="relative h-2 w-20 rounded-full bg-gray-500 cursor-pointer"
                    onClick={() => setCurrentIndex(index)}
                >
                    {currentIndex === index && (
                        <div className="absolute top-0 left-0 h-full w-full rounded-full  ">
                            <div className="h-full rounded-full bg-white " 
                                style={{
                                    animation: "progressBar 10s ease-in-out forwards"
                                }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export function Carousel({ slides }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const extendedSlides = [...slides, ...slides.slice(0, 1)];

    const goToPrevious = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        
        setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
        
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };

    const goToNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        
        setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
        
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };

    // Cambiar imagen cada cierto tiempo
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 10000);
    
        return () => clearInterval(slideInterval);
    }, []);

    return (
        <div className="relative w-full h-170 overflow-hidden">
            <div 
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="w-full h-full flex-shrink-0 flex items-center"
                    >
                        <img 
                            src={slide.image} 
                            alt={slide.alt}
                            className="w-full h-full object-cover" 
                        />
                    </div>
                ))}
            </div>
        
            <NavigationSlide slides={slides} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />

            <div className="absolute top-0 h-full w-full flex justify-between items-center px-10">
                <button onClick={goToPrevious} disabled={isTransitioning} className="bg-gray-400/40 backdrop-blur-md text-white p-2 rounded-full transform active:scale-90 duration-300 hover:scale-110">
                    <IoIosArrowBack className="h-12 w-12" />
                </button>
                <button onClick={goToNext} disabled={isTransitioning} className="bg-gray-400/40 backdrop-blur-md text-white p-2 rounded-full transform active:scale-90 duration-300 hover:scale-110">
                    <IoIosArrowForward className="h-12 w-12" />
                </button>
            </div>
        </div>
    );
}
