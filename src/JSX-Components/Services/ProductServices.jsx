import axios from 'axios';
import React from 'react';

const PRODUCTS_BASE_REST_API_URL = "http://localhost:8080/catalog/products";

const ProductServices = {
    getAllProducts: () => { return axios.get(PRODUCTS_BASE_REST_API_URL);},

    saveProduct: (productData) => {
        const formData = new FormData();
        formData.append("productName", productData.productName);
        formData.append("productDescription", productData.productDescription);
        formData.append("productPrice", productData.productPrice);
        formData.append("categoriaProduct", productData.categoriaProduct);
        formData.append("subCategoriaProduct", productData.subCategoriaProduct);
        formData.append("enOferta", productData.enOferta);

        if (productData.imageProduct) {
            formData.append("imageProduct", productData.imageProduct); // Agrega la imagen solo si existe
        }

        return axios.post(PRODUCTS_BASE_REST_API_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};

export default ProductServices;