import React, { useState, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CreateProductPrice from './CreateProductPrice';
import ProductServices from '../Services/ProductServices';
import AuthContext from '../Services/AuthContext';
import Footer from '../Footer/Footer.jsx';

export default function CreateProduct() {

    const { user } = useContext(AuthContext); // Obtiene el usuario autenticado
    const navigate = useNavigate(); // Para redireccionar
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [imageProduct, setImageProduct] = useState(null);
    const [enOferta, setEnOferta] = useState(false);
    const [categoriaProduct, setCategoriaProduct] = useState('');
    const [subCategoriaProduct, setSubCategoriaProduct] = useState('');
    const [selectedSubCategoria, setSelectedSubCategoria] = useState(''); // Nuevo estado para la subcategoría seleccionada
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [errors, setErrors] = useState({});
    const [fileName, setFileName] = useState('Sin archivos seleccionados');
    const fileInputRef = useRef(null); // Crear una referencia para el input de archivo

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
                <p className="text-red-500 font-semibold text-2xl mb-4">
                    ⚠️ Debes iniciar sesión para agregar un producto.
                </p>
                <button
                    onClick={() => navigate('/log-in')}
                    className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 text-xl"
                >
                    Ir a Iniciar Sesión
                </button>
            </div>
        );
    }
    
    

    const validateForm = () => {
        const newErrors = {};
        if (!productName.trim()) newErrors.productName = 'El nombre del producto es obligatorio';
        else if (productName.trim().length < 3) newErrors.productName = 'El nombre del producto debe tener al menos 3 caracteres';

        if (!productDescription.trim()) newErrors.productDescription = 'La descripción es obligatoria';
        else if (productDescription.trim().length < 10 || productDescription.trim().length > 100) {
            newErrors.productDescription = 'La descripción debe tener al menos 10 caracteres y no debe pasar los 100 caracteres';
        }

        if (!productPrice.trim()) newErrors.productPrice = 'El precio es obligatorio';

        if (!imageProduct) newErrors.imageProduct = 'La URL de la imagen es obligatoria';

        if (!categoriaProduct || categoriaProduct === '') {
            newErrors.category = 'Debes seleccionar una categoría válida';
        }

        return newErrors;
    };

    const saveProduct = (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        const product = { 
            productName, 
            productDescription, 
            productPrice, 
            imageProduct, 
            enOferta, 
            categoriaProduct, 
            subCategoriaProduct: selectedSubCategoria // Guardar solo la subcategoría seleccionada
        };
        ProductServices.saveProduct(product).then(response => {
            console.log(response.data);
            setSuccessMessage('Producto guardado exitosamente!');
            setShowSuccessMessage(true);
            // Limpiar el formulario después de guardar
            setProductName('');
            setProductDescription('');
            setProductPrice('');
            setImageProduct('');
            setCategoriaProduct('');
            setSubCategoriaProduct('');
            setSelectedSubCategoria(''); // Reiniciar la subcategoría seleccionada
            setEnOferta(false);
            setErrors({});
            setFileName('Sin archivos seleccionados');
            // Ocultar el mensaje de éxito después de 3 segundos
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        })
        .catch(error => {
            console.log("Error al guardar el producto:", error);
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox') {
            setEnOferta(checked);
        } else if (type === 'file') {
            setImageProduct(files[0]);
            setFileName(files[0].name);
        } else {
            switch (name) {
                case 'name':
                    setProductName(value);
                    break;
                case 'description':
                    setProductDescription(value);
                    break;
                case 'price':
                    setProductPrice(value);
                    break;
                case 'imageUrl':
                    setImageProduct(value);
                    break;
                case 'category':
                    setCategoriaProduct(value);

                    // Actualizar las subcategorías según la categoría seleccionada
                    switch (value) {
                        case 'Zapatillas':
                            setSubCategoriaProduct(['Running', 'Casual', 'Deportivo']);
                            break;
                        case 'Ropa':
                            setSubCategoriaProduct(['Camisetas', 'Pantalones', 'Chaquetas']);
                            break;
                        case 'Accesorios':
                            setSubCategoriaProduct(['Relojes', 'Gafas de Sol', 'Bolsos']);
                            break;
                        case 'Tecnologia':
                            setSubCategoriaProduct(['Computadoras', 'Celulares', 'Electrodomésticos']);
                            break;
                        case 'Hogar':
                            setSubCategoriaProduct(['Muebles', 'Decoración', 'Menaje de Cocina']);
                            break;
                        case 'Deportes':
                            setSubCategoriaProduct(['Balones', 'Accesorios de Deporte', 'Ropa Deportiva']);
                            break;
                        case 'Otro':
                            setSubCategoriaProduct(['Otro']);
                            break;
                        default:
                            setSubCategoriaProduct([]);
                            break;
                    }

                    // Reiniciar la subcategoría seleccionada
                    setSelectedSubCategoria('');
                    break;

                case 'subcategory':
                    setSelectedSubCategoria(value); // Actualizar la subcategoría seleccionada
                    break;

                default:
                    break;
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            setImageProduct(files[0]);
            setFileName(files[0].name);
        } else {
            setErrors({ ...errors, imageProduct: 'Solo se permiten archivos de imagen' });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleRemoveFile = () => {
        setImageProduct(null); // Restablecer el archivo de imagen
        setFileName('Sin archivos seleccionados'); // Restablecer el nombre del archivo
        setErrors({ ...errors, imageProduct: null }); // Limpiar errores si los hay

        // Restablecer el valor del input de archivo
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveProduct(e);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setImageProduct(file); // Almacenar el archivo en el estado
                setFileName(file.name); // Actualizar el nombre del archivo
                setErrors({ ...errors, imageProduct: '' }); // Limpiar errores si los hay
            } else {
                setErrors({ ...errors, imageProduct: 'Solo se permiten archivos de imagen' });
            }
        } else {
            setFileName('Sin archivos seleccionados'); // Restablecer el nombre del archivo si no se selecciona nada
        }
    };

    return (
        <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 80px)' }}>
            <div className="w-full max-w-2xl mx-auto py-10 flex-grow">
                <h2 className="text-2xl font-bold text-center mb-6">Agregar Producto</h2>
                
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-1 font-medium text-gray-900">
                            Nombre del Producto
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="name"
                                value={productName}
                                onChange={handleChange}
                                placeholder="Nike Air Max 270"
                                className="block w-full rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 pl-3 pr-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                required
                            />
                            {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-1 font-medium text-gray-900">
                            Descripción del Producto
                        </label>
                        <div className="mt-2">
                            <textarea
                                name="description"
                                value={productDescription}
                                onChange={handleChange}
                                placeholder="Zapatillas deportivas ultraligeras, transpirables y cómodas. Ideales para running y gym. "
                                className="block w-full rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 pl-3 pr-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                rows="3"
                                required
                            />
                            {errors.productDescription && <p className="text-red-500 text-sm mt-1">{errors.productDescription}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-1 font-medium text-gray-900">
                            Categorías a las que pertenece el Producto
                        </label>
                        <div className="mt-2">
                            <select
                                name="category"
                                value={categoriaProduct}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 pl-3 pr-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                <option value="Zapatillas">Zapatillas</option>
                                <option value="Ropa">Ropa</option>
                                <option value="Accesorios">Accesorios</option>
                                <option value="Tecnologia">Tecnología</option>
                                <option value="Hogar">Hogar</option>
                                <option value="Deportes">Deportes</option>
                                <option value="Otro">Otro</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                        </div>
                    </div>

                    {/* Campo de subcategorías dinámico */}
                    {categoriaProduct && subCategoriaProduct.length > 0 && (
                        <div>
                            <label htmlFor="subcategory" className="block text-1 font-medium text-gray-900">
                                Subcategoría
                            </label>
                            <div className="mt-2">
                                <select
                                    name="subcategory"
                                    value={selectedSubCategoria} // Usar el estado de la subcategoría seleccionada
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 pl-3 pr-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                    required
                                >
                                    <option value="">Selecciona una subcategoría</option>
                                    {subCategoriaProduct.map((subCategoria, index) => (
                                        <option key={index} value={subCategoria}>
                                            {subCategoria}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div>
                        <CreateProductPrice value={productPrice} onChange={handleChange} />
                        {errors.productPrice && <p className="text-red-500 text-sm mt-1">{errors.productPrice}</p>}
                    </div>

                    <div>
                        <label htmlFor="imageUrl" className="block text-1 font-medium text-gray-900">
                            Sube la imagen de tú producto SIN FONDO (JPG, JPEG, PNG)
                        </label>
                        <div 
                            className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 text-center cursor-pointer"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <label className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer">
                                Seleccionar archivo
                                <input
                                    type="file"
                                    name="imageUrl"
                                    ref={fileInputRef} // Asignar la referencia al input
                                    onChange={handleFileChange}
                                    accept='image/png, image/jpeg, image/jpg, image/webp'
                                    className="hidden"
                                />
                            </label>
                            <div className="mt-2 flex items-center justify-center">
                                <p className="text-base text-gray-900">{fileName}</p>
                                {fileName !== 'Sin archivos seleccionados' && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="ml-2 text-3xl text-red-500 hover:text-red-700 focus:outline-none"
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">o arrastra y suelta el archivo aquí</p>
                        </div>
                        {errors.imageProduct && <p className="text-red-500 text-sm mt-1">{errors.imageProduct}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="enOferta"
                            checked={enOferta}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-gray-600"
                        />
                        <label htmlFor="enOferta" className="ml-2 block text-1 text-gray-900">
                            En Oferta
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        Agregar Producto
                    </button>
                </form>
                {successMessage && (
                    <div className={`bg-green-100 border mt-8 border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 text-center transition-opacity duration-1000 ${showSuccessMessage ? 'opacity-100' : 'opacity-0'}`}>
                        {successMessage}
                    </div>
                )}
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
}
