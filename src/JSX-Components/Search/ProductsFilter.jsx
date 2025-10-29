import React, { useState, useEffect } from 'react';

export default function ProductsFilter({ onFilterChange }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [onSale, setOnSale] = useState(false);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
        }).format(value);
    };

    const categoriesWithSubcategories = {
        Zapatillas: ['Running', 'Casual', 'Deportivo'],
        Ropa: ['Camisetas', 'Pantalones', 'Chaquetas'],
        Accesorios: ['Relojes', 'Gafas de Sol', 'Bolsos'],
        Tecnologia: ['Celulares', 'Computadoras', 'Electrodomésticos'],
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setSelectedSubcategory(''); // Reiniciar la subcategoría seleccionada
        onFilterChange({ category, subcategory: '', priceRange, onSale });
        console.log("filtros aplicados", category)
    };

    const handleSubcategoryChange = (subcategory) => {
        setSelectedSubcategory(subcategory);
        onFilterChange({ category: selectedCategory, subcategory, priceRange, onSale });
    };

    const handlePriceChange = (e, index) => {
        const newPriceRange = [...priceRange];
        newPriceRange[index] = Number(e.target.value);
        setPriceRange(newPriceRange);
        onFilterChange({ category: selectedCategory, subcategory: selectedSubcategory, priceRange: newPriceRange, onSale });
    };

    const handleOnSaleChange = (e) => {
        setOnSale(e.target.checked);
        onFilterChange({ category: selectedCategory, subcategory: selectedSubcategory, priceRange, onSale: e.target.checked });
    };

    useEffect(() => {
        onFilterChange({ category: selectedCategory, subcategory: selectedSubcategory, priceRange, onSale });
    }, []); // Ejecutar solo al montar el componente

    return (
        <div className="w-64 p-4 rounded-lg top-4 h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Filtros</h2>

            {/* Filtro por categoría */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Categoría</h3>
                <ul className="space-y-2">
                    <li>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="category"
                                value=""
                                checked={selectedCategory === ''}
                                onChange={handleCategoryChange}
                                className="h-4 w-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Todas</span>
                        </label>
                    </li>
                    <li>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="category"
                                value="Zapatillas"
                                checked={selectedCategory === 'Zapatillas'}
                                onChange={handleCategoryChange}
                                className="h-4 w-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Zapatillas</span>
                        </label>
                    </li>
                    <li>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="category"
                                value="Ropa"
                                checked={selectedCategory === 'Ropa'}
                                onChange={handleCategoryChange}
                                className="h-4 w-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Ropa</span>
                        </label>
                    </li>
                    <li>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="category"
                                value="Accesorios"
                                checked={selectedCategory === 'Accesorios'}
                                onChange={handleCategoryChange}
                                className="h-4 w-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Accesorios</span>
                        </label>
                    </li>
                    <li>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="category"
                                value="Tecnologia"
                                checked={selectedCategory === 'Tecnologia'}
                                onChange={handleCategoryChange}
                                className="h-4 w-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Tecnología</span>
                        </label>
                    </li>
                </ul>
            </div>

            {/* Filtro por subcategoría */}
            {selectedCategory && categoriesWithSubcategories[selectedCategory] && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Subcategoría</h3>
                    <ul className="space-y-2">
                        {categoriesWithSubcategories[selectedCategory].map((subcategory) => (
                            <li key={subcategory}>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="subcategory"
                                        value={subcategory}
                                        checked={selectedSubcategory === subcategory}
                                        onChange={() => handleSubcategoryChange(subcategory)}
                                        className="h-4 w-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{subcategory}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Filtro por rango de precios */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Rango de precios</h3>
                <div className="flex flex-col space-y-4">
                    {/* Mostrar rango formateado */}
                    <div className="flex justify-between text-sm text-gray-700">
                        <span>{formatCurrency(priceRange[0])}</span>
                        <span>{formatCurrency(priceRange[1])}</span>
                    </div>
                    {/* Control deslizante para precio mínimo */}
                    <input
                        type="range"
                        min="0"
                        max="1000000"
                        step="100000" // Incremento de 100,000
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full"
                    />
                    {/* Control deslizante para precio máximo */}
                    <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="1000000" // Incremento de 100,000
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Filtro por oferta */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">En oferta</h3>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={onSale}
                        onChange={handleOnSaleChange}
                        className="h-4 w-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mostrar solo productos en oferta</span>
                </label>
            </div>
        </div>
    );
}