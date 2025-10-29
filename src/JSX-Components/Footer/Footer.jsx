import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer () {
    return (
        <footer className="footer-inicio bg-white text-gray-900 py-6 mt-10 w-full shadow-lg">
            <div className="container mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {/* Sección de enlaces */}
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-3">Enlaces</h2>
                    <ul className="space-y-2 text-left w-18">
                        <li><a href="/" className="hover:text-gray-400">Inicio</a></li>
                        <li><a href="/search" className="hover:text-gray-400">Tienda</a></li>
                        <li><a href="/contacto" className="hover:text-gray-400">Contacto</a></li>
                    </ul>
                </div>

                {/* Sección de redes sociales */}
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-3">Síguenos</h2>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-gray-400">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://www.instagram.com/jos_erojas1/" 
                           target="_blank" 
                           className="hover:text-gray-400">
                            <FaInstagram size={24} />
                        </a>
                        <a href="#" className="hover:text-gray-400">
                            <FaTwitter size={24} />
                        </a>
                    </div>
                </div>

                {/* Sección de derechos de autor */}
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-3">Contacto</h2>
                    <div className="text-left w-60">
                        <p className="text-sm">Email: josegrmog@gmail.com</p>
                        <p className="text-sm">Teléfono: +57 323 2465878</p>
                        <p className="text-sm mt-3">&copy; {new Date().getFullYear()} JGRM Project. 
                            <br /> Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}