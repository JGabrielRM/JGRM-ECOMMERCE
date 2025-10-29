import React from "react";
import { motion } from "framer-motion";

export default function ScrollDescuento() {
    return (
        <div className="w-full overflow-hidden bg-transparent relative flex items-center shadow-lg mt-20 mb-10">
            <motion.div
                className="flex min-w-[200%] h-full items-center"
                animate={{ x: ["0%", "-100%"] }}
                transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
            >
                <div className="flex w-full h-full">
                    <img
                        src="/tirilla-descuento-inicio/tirilla-descuento.png"
                        alt="Descuento"
                        className="h-full w-auto"
                    />
                    <img
                        src="/tirilla-descuento-inicio/tirilla-descuento.png"
                        alt="Descuento"
                        className="h-full w-auto"
                    />
                </div>
                <div className="flex w-full h-full">
                    <img
                        src="/tirilla-descuento-inicio/tirilla-descuento.png"
                        alt="Descuento"
                        className="h-full w-auto"
                    />
                    <img
                        src="/tirilla-descuento-inicio/tirilla-descuento.png"
                        alt="Descuento"
                        className="h-full w-auto"
                    />
                </div>
            </motion.div>
        </div>
    );
}
