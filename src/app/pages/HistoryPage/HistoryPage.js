import { useContext, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import GlobalContext from '../../contexts/GlobalContext';

export default function HistoryPage() {
    const { viewedProducts, handleProductDetailClick, handleToggleFavorite, isProductFavorite, setCurrentPage } =
        useContext(GlobalContext);

    useEffect(() => {
        setCurrentPage('/history');
    }, []);

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Lịch sử xem gần đây</h2>
            {viewedProducts.length === 0 ? (
                <p className="text-gray-600 text-lg text-center py-10">Bạn chưa xem khóa học nào.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-4">
                    {viewedProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onDetailClick={handleProductDetailClick}
                            onToggleFavorite={handleToggleFavorite}
                            isFavorite={isProductFavorite(product.id)} // Always true on this page
                        />
                    ))}
                </div>
            )}
        </>
    );
}
