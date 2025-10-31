import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

export default function LoadingScreen({ 
    message = "Cargando...", 
    isFullScreen = true,
    color = "lime",
    size = "default",
    isComplete = false,
    onComplete
}) {
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (isComplete) {
            setShowSuccess(true);
            if (onComplete) {
                setTimeout(onComplete, 1000);
            }
        }
    }, [isComplete, onComplete]);

    const fadeVariants = {
        hidden: { 
            opacity: 0,
            transition: { duration: 0.1 }
        },
        visible: { 
            opacity: 1,
            transition: { duration: 0.2 }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.1 }
        }
    };

    const containerVariants = {
        hidden: { 
            opacity: 0,
            scale: 0.9
        },
        visible: { 
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div 
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeVariants}
                className={`${isFullScreen ? 'fixed inset-0 z-50' : 'relative'}`}
            >
                {/* Overlay with fade */}
                <motion.div 
                    variants={fadeVariants}
                    className="absolute inset-0 backdrop-blur-sm"
                />
                
                {/* Container with fade and scale */}
                <div className="relative flex items-center justify-center min-h-full">
                    <motion.div 
                        variants={containerVariants}
                        className=" p-8 rounded-lg flex flex-col items-center"
                    >
                        {!showSuccess ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className={`
                                    ${size === 'small' ? 'w-8 h-8 border-2' : 
                                      size === 'large' ? 'w-24 h-24 border-6' : 
                                      'w-20 h-20 border-4'}
                                    ${color === 'lime' ? 'border-lime-600' :
                                      color === 'blue' ? 'border-blue-600' :
                                      color === 'red' ? 'border-red-600' :
                                      'border-purple-600'}
                                    border-t-transparent 
                                    rounded-full
                                `}
                            />
                        ) : (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="text-lime-600"
                            >
                                <svg 
                                    className="w-24 h-24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </motion.div>
                        )}
                        <motion.p 
                            variants={fadeVariants}
                            className="mt-4 text-gray-600 text-xl font-bold"
                        >
                            {message}
                        </motion.p>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

LoadingScreen.propTypes = {
    message: PropTypes.string,
    isFullScreen: PropTypes.bool,
    color: PropTypes.oneOf(['lime', 'blue', 'red', 'purple']),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    isComplete: PropTypes.bool,
    onComplete: PropTypes.func
};