import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import PropTypes from 'prop-types';

export default function StatusMessage({ type, message }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mt-4 p-4 rounded-lg shadow-lg flex items-center justify-center space-x-3 w-full ${
                    type === 'success' ? 'bg-green-100' : 
                    type === 'error' ? 'bg-red-100' : 
                    type === 'warning' ? 'bg-yellow-100' : 
                    'bg-blue-100'
                }`}
            >
                {type === 'success' ? (
                    <FaCheckCircle className="text-green-500 text-xl" />
                ) : type === 'error' ? (
                    <FaTimesCircle className="text-red-500 text-xl" />
                ) : null}
                <span className={`font-medium ${
                    type === 'success' ? 'text-green-700' : 
                    type === 'error' ? 'text-red-700' : 
                    type === 'warning' ? 'text-yellow-700' : 
                    'text-blue-700'
                }`}>
                    {message}
                </span>
            </motion.div>
        </AnimatePresence>
    );
}

StatusMessage.propTypes = {
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
    message: PropTypes.string.isRequired
};