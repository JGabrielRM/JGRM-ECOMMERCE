import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingScreen from '../Pantalla de Carga/LoadingScreen';
import AuthContext from '../Services/AuthContext';

export default function IniciarSesionExitoso() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);
    const [isComplete, setIsComplete] = useState(false);
    
    useEffect(() => {
        const token = searchParams.get('token');
        
        if (token) {
            // Guardar el token
            localStorage.setItem('token', token);
            
            // Actualizar el contexto de autenticación si existe
            if (setIsAuthenticated) {
                setIsAuthenticated(true);
            }
            
            // Marcar como completado para mostrar el checkmark
            setIsComplete(true);
            
            // Redirigir al home después de 1.5 segundos (para que se vea el checkmark)
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } else {
            // Si no hay token, redirigir al login
            navigate('/log-in');
        }
    }, [searchParams, navigate, setIsAuthenticated]);
    
    return (
        <LoadingScreen 
            message={isComplete ? "¡Inicio de sesión exitoso!" : "Iniciando sesión con Google..."}
            color="lime"
            size="default"
            isComplete={isComplete}
        />
    );
}