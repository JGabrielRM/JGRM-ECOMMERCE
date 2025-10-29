import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Función para abrir el carrito
    const openCart = () => {
        setIsCartOpen(true);
    };

    // Función para cerrar el carrito
    const closeCart = () => {
        setIsCartOpen(false);
    };

    // Función para agregar un producto al carrito
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.idProduct === product.idProduct);
            if (existingProduct) {
                return prevCart.map((item) =>
                    item.idProduct === product.idProduct
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
        setIsCartOpen(true);
    };

    // Función para eliminar un producto del carrito
    const removeFromCart = (idProduct) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.idProduct === idProduct);
            if (existingProduct.quantity > 1) {
                return prevCart.map((item) =>
                    item.idProduct === idProduct
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                return prevCart.filter((item) => item.idProduct !== idProduct);
            }
        });
    };

    // Función para limpiar el carrito
    const clearCart = (idProduct = null) => {
        if (idProduct) {
            // Eliminar solo los productos que coincidan con el idProduct
            setCart((prevCart) => prevCart.filter((item) => item.idProduct !== idProduct));
        } else {
            // Si no se pasa idProduct, limpiar todo el carrito
            setCart([]);
        }
    };

    // Función para obtener la cantidad total de productos en el carrito
    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    // Guardar el carrito en localStorage cada vez que cambie
    const authContext = useContext(AuthContext);

    useEffect(() => {
        if (authContext?.user) {
            localStorage.setItem(`cart_${authContext.user.name}`, JSON.stringify(cart));
        }
    }, [cart, authContext?.user]);

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart, // Exponer setCart para sincronización
                addToCart,
                removeFromCart,
                clearCart,
                getTotalItems,
                isCartOpen,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);