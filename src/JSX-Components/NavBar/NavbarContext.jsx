import React, { createContext, useState } from 'react';

export const NavbarContext = createContext();

export const NavbarProvider = ({ children }) => {
    const [isSticky, setIsSticky] = useState(true);

    return (
        <NavbarContext.Provider value={{ isSticky, setIsSticky }}>
            {children}
        </NavbarContext.Provider>
    );
};