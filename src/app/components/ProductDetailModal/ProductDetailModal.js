export default function ProductDetailModal({ product, onClose }) {
    if (!product) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-9999" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <div className="relative">
                    <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-t-xl" />
                    <button
                        onClick={onClose}
                        className="cursor-pointer absolute top-4 right-4 bg-gray-500 text-white rounded-full p-2 hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                        aria-label="Đóng"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h2>
                    <p className="text-blue-600 font-extrabold text-2xl mb-4">
                        {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </p>
                    <div className="flex items-center text-yellow-500 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-gray-700 font-semibold mr-2">{product.rating}</span>
                        <span className="text-gray-500">({product.reviews} đánh giá)</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">{product.longDescription}</p>
                </div>
            </div>
        </div>
    );
}
