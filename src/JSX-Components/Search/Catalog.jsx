import React, { useState } from 'react';
import ListProducts from '../Services/ListProducts';
import ProductsFilter from './ProductsFilter';
import Footer from '../Footer/Footer.jsx';

export default function Catalog() {
    const [filters, setFilters] = useState({
        category: '',
        priceRange: [0, 1000000],
        onSale: false,
    });

    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 80px)' }}>
            <div className="flex justify-center py-10 flex-grow">
                <div className="flex flex-col lg:flex-row max-w-[90%] lg:max-w-[75%] w-full gap-6">
                    {/* Barra lateral de filtros */}
                    <div className="w-full lg:w-1/4">
                        <ProductsFilter onFilterChange={handleFilterChange} />
                    </div>
                    {/* Contenido principal */}
                    <div className="w-full lg:w-3/4">
                        {/* Lista de productos */}
                        <ListProducts 
                            filters={filters} 
                            searchTerm={searchTerm} 
                            setSearchTerm={setSearchTerm} // Se pasa la función para actualizar el searchTerm
                        />
                    </div>
                </div>
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
}
