import { useContext, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import GlobalContext from '../../contexts/GlobalContext';

function FavoritePage() {
    const { favoriteProducts, handleToggleFavorite, handleProductDetailClick, setCurrentPage } =
        useContext(GlobalContext);

    useEffect(() => {
        setCurrentPage('/favorite');
    }, []);

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Khóa học yêu thích của bạn</h2>
            {favoriteProducts.length === 0 ? (
                <p className="text-gray-600 text-lg text-center py-10">Bạn chưa có khóa học yêu thích nào.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-4">
                    {favoriteProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onDetailClick={handleProductDetailClick}
                            onToggleFavorite={handleToggleFavorite}
                            isFavorite={true} // Always true on this page
                        />
                    ))}
                </div>
            )}
        </>
    );
}

export default FavoritePage;
