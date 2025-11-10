import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaThumbsUp } from 'react-icons/fa';
import { useContext } from 'react';
import AuthContext from '../Services/AuthContext';

export default function ProductReviews({ productId }) {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [reviews, setReviews] = useState([
        {
            id: 1,
            author: 'Juan Pérez',
            rating: 5,
            date: '2024-01-15',
            title: 'Excelente producto',
            comment: 'Las zapatillas son muy cómodas y de buena calidad. La entrega fue rápida y el empaque perfecto.',
            likes: 12,
            liked: false
        },
        {
            id: 2,
            author: 'María García',
            rating: 4,
            date: '2024-01-10',
            title: 'Buena compra',
            comment: 'Me gustó el producto, aunque la talla fue un poco grande. En general, recomiendo.',
            likes: 8,
            liked: false
        },
        {
            id: 3,
            author: 'Carlos López',
            rating: 5,
            date: '2024-01-05',
            title: 'Súper recomendado',
            comment: 'Fantástico. Mejor de lo que esperaba. Definitivamente volveré a comprar.',
            likes: 25,
            liked: false
        }
    ]);

    const [newReview, setNewReview] = useState({
        title: '',
        comment: '',
        rating: 5
    });

    const [showForm, setShowForm] = useState(false);

    const handleSubmitReview = (e) => {
        e.preventDefault();

        if (!newReview.title.trim() || !newReview.comment.trim()) {
            alert('Por favor completa todos los campos');
            return;
        }

        const review = {
            id: reviews.length + 1,
            author: user?.nombre_usuario || 'Anónimo',
            rating: newReview.rating,
            date: new Date().toISOString().split('T')[0],
            title: newReview.title,
            comment: newReview.comment,
            likes: 0,
            liked: false
        };

        setReviews([review, ...reviews]);
        setNewReview({ title: '', comment: '', rating: 5 });
        setShowForm(false);
    };

    const handleLike = (reviewId) => {
        if (!isAuthenticated()) {
            alert('Debes iniciar sesión para dar like a una opinión');
            return;
        }

        setReviews(reviews.map(review => {
            if (review.id === reviewId) {
                return {
                    ...review,
                    liked: !review.liked,
                    likes: review.liked ? review.likes - 1 : review.likes + 1
                };
            }
            return review;
        }));
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const StarRating = ({ rating, onChange, interactive = false }) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type={interactive ? 'button' : 'button'}
                        disabled={!interactive}
                        onClick={() => interactive && onChange(star)}
                        className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-colors`}
                    >
                        <FaStar
                            size={interactive ? 24 : 20}
                            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="mt-20 max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            {/* Encabezado */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Opiniones de clientes</h2>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <StarRating rating={Math.round(averageRating)} />
                        <span className="text-2xl font-bold text-gray-800">{averageRating}</span>
                        <span className="text-gray-600">({reviews.length} opiniones)</span>
                    </div>
                </div>
            </div>

            {/* Botón para agregar reseña */}
            {isAuthenticated() ? (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowForm(!showForm)}
                    className="mb-8 bg-lime-600 text-white py-2 px-6 rounded-md hover:bg-lime-700 transition-colors duration-200 font-semibold"
                >
                    {showForm ? 'Cancelar' : 'Compartir tu opinión'}
                </motion.button>
            ) : (
                <div className="mb-8 p-4 bg-yellow-100 border border-yellow-400 rounded-md">
                    <p className="text-yellow-800">
                        Debes <span className="font-semibold">iniciar sesión</span> para dejar una opinión.
                    </p>
                </div>
            )}

            {/* Formulario para nueva reseña */}
            {showForm && isAuthenticated() && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-300"
                >
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Dejar una opinión</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        {/* Calificación */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Calificación
                            </label>
                            <StarRating
                                rating={newReview.rating}
                                onChange={(rating) => setNewReview({ ...newReview, rating })}
                                interactive={true}
                            />
                        </div>

                        {/* Título */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                                Título de la opinión
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={newReview.title}
                                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                                placeholder="Ej: Excelente producto"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-600"
                                maxLength="100"
                            />
                        </div>

                        {/* Comentario */}
                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-900 mb-2">
                                Tu opinión
                            </label>
                            <textarea
                                id="comment"
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                placeholder="Cuéntanos tu experiencia con este producto..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-600"
                                rows="4"
                                maxLength="500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {newReview.comment.length}/500 caracteres
                            </p>
                        </div>

                        {/* Botones */}
                        <div className="flex space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="bg-lime-600 text-white py-2 px-6 rounded-md hover:bg-lime-700 transition-colors duration-200 font-semibold"
                            >
                                Publicar opinión
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Lista de reseñas */}
            <div className="space-y-6">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                        >
                            {/* Encabezado de la reseña */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <StarRating rating={review.rating} />
                                        <span className="text-sm text-gray-500">{review.date}</span>
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-800">{review.title}</h4>
                                    <p className="text-sm text-gray-600">
                                        Por <span className="font-medium">{review.author}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Contenido de la reseña */}
                            <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

                            {/* Botón de like */}
                            <div className="flex items-center space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleLike(review.id)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 ${
                                        review.liked
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                >
                                    <FaThumbsUp size={16} />
                                    <span className="text-sm font-medium">{review.likes}</span>
                                </motion.button>
                                <span className="text-xs text-gray-500">
                                    {review.likes === 1 ? 'persona encontró útil' : 'personas encontraron útil'}
                                </span>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">
                            No hay opiniones aún. ¡Sé el primero en dejar tu opinión!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}