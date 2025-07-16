import Button from '../Button';

export default function ProductCard({ product, onDetailClick, onToggleFavorite, isFavorite, className }) {
    return (
        <div
            className={
                className +
                ' bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col relative'
            }
        >
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-xl" />
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-blue-600 font-bold text-lg mb-2">
                    {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </p>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{product.shortDescription}</p>
                <div className="flex items-center justify-between mt-auto">
                    <Button onClick={() => onDetailClick(product)}>Xem chi tiết</Button>
                    <button
                        onClick={() => onToggleFavorite(product)}
                        className={`cursor-pointer p-2 rounded-full transition-colors duration-200 ${
                            isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-400'
                        }`}
                        aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 fill-current"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill={isFavorite ? 'currentColor' : 'none'}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
