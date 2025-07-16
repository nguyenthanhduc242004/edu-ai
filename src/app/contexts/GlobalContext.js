import { createContext, useCallback, useEffect, useState } from 'react';

import mockProducts from '../../mocks/db.json';
import ProductDetailModal from '../components/ProductDetailModal';
import ToastNotification from '../components/ToastNotification/ToastNotification';

const GlobalContext = createContext(null);

export default GlobalContext;

let bpSm = '40rem';
let bpLg = '64rem';
let bpXl = '80rem';

const colNum = {
    base: 1,
    sm: 2,
    lg: 3,
    xl: 4,
};

const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

const getCurrentMediaType = () => {
    if (window.innerWidth < parseFloat(bpSm) * rootFontSize) return 'base';
    else if (window.innerWidth < parseFloat(bpLg) * rootFontSize) return 'sm';
    else if (window.innerWidth < parseFloat(bpXl) * rootFontSize) return 'lg';
    else return 'xl';
};

export const GlobalProvider = ({ children }) => {
    const [products, setProducts] = useState(mockProducts.courses);

    const [favoriteProducts, setFavoriteProducts] = useState(() => {
        // Load favorites from localStorage on initial render
        const savedFavorites = localStorage.getItem('favoriteProducts');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    const isProductFavorite = (productId) => favoriteProducts.some((fav) => fav.id === productId);

    // Toggle favorite status
    const handleToggleFavorite = useCallback((product) => {
        setFavoriteProducts((prevFavorites) => {
            const isCurrentlyFavorite = prevFavorites.some((fav) => fav.id === product.id);
            if (isCurrentlyFavorite) {
                setToast({ message: `Đã bỏ yêu thích: ${product.name}`, type: 'success' });
                return prevFavorites.filter((fav) => fav.id !== product.id);
            } else {
                setToast({ message: `Đã thêm vào yêu thích: ${product.name}`, type: 'success' });
                return [...prevFavorites, product];
            }
        });
    }, []);

    // Handle product detail click
    const handleProductDetailClick = useCallback((product) => {
        setSelectedProduct(product);
        setShowDetailModal(true);

        // Add to viewed products, ensuring no duplicates and limited history size
        setViewedProducts((prevViewed) => {
            const newViewed = [product, ...prevViewed.filter((p) => p.id !== product.id)];
            return newViewed.slice(0, 8); // Keep last 8 viewed products
        });
    }, []);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [showDetailModal, setShowDetailModal] = useState(false);

    const [viewedProducts, setViewedProducts] = useState(() => {
        // Load viewed products from localStorage
        const savedViewed = localStorage.getItem('viewedProducts');
        return savedViewed ? JSON.parse(savedViewed) : [];
    });

    const [currentMediaType, setCurrentMediaType] = useState();

    const [toast, setToast] = useState(null); // { message, type }

    const [currentPage, setCurrentPage] = useState('/');

    useEffect(() => {
        setCurrentMediaType(getCurrentMediaType());

        const handleWindowResize = () => {
            setCurrentMediaType(getCurrentMediaType());
        };
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    // Save favorites to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
    }, [favoriteProducts]);

    // Save viewed products to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
    }, [viewedProducts]);

    useEffect(() => {
        setCurrentMediaType(getCurrentMediaType());
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                products,
                setProducts,
                favoriteProducts,
                setFavoriteProducts,
                isProductFavorite,
                handleToggleFavorite,
                handleProductDetailClick,
                toast,
                setToast,
                selectedProduct,
                setSelectedProduct,
                showDetailModal,
                setShowDetailModal,
                viewedProducts,
                setViewedProducts,
                currentMediaType,
                setCurrentMediaType,
                getCurrentMediaType,
                rootFontSize,
                colNum,
                currentPage,
                setCurrentPage,
            }}
        >
            {children}

            {/* Product Detail Modal */}
            {showDetailModal && (
                <ProductDetailModal product={selectedProduct} onClose={() => setShowDetailModal(false)} />
            )}

            {/* Chatbot Modal */}
            {/* <ChatbotModal show={showChatbot} onClose={() => setShowChatbot(false)} products={products} /> */}

            {/* Toast Notification */}
            {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </GlobalContext.Provider>
    );
};
