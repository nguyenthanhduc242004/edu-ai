import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import ProductCard from '../../components/ProductCard';
import ChatbotModal from '../../components/ChatbotModal';
import ProductDetailModal from '../../components/ProductDetailModal';
import ToastNotification from '../../components/ToastNotification/ToastNotification';
import LoadingSkeleton from './LoadingSkeleton';
import { ArrowLeftIcon, ArrowRightIcon } from '../../components/Icons';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';
import GlobalContext from '../../contexts/GlobalContext';

const suggestedProductNum = 7;

const suggestedProductColNum = {
    base: 1,
    sm: 1,
    lg: 2,
    xl: 3,
};

const slideChangeTime = 2500;
let slideTimeoutId = undefined;

const Home = () => {
    const {
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
        colNum,
        getCurrentMediaType,
        currentPage,
        setCurrentPage,
    } = useContext(GlobalContext);

    const [latestProducts, setLatestProducts] = useState([]);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [currentSuggestedProduct, setCurrentSuggestedProduct] = useState(1);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [suggestionError, setSuggestionError] = useState(null);
    // const [showChatbot, setShowChatbot] = useState(false); // State for chatbot modal
    const [currentLatestProduct, setCurrentLatestProduct] = useState(1);
    const [showMoreLatestProduct, setShowMoreLatestProduct] = useState(false);

    useEffect(() => {
        // Auto suggest on reset
        fetchAISuggestions();

        setCurrentPage('/');

        return () => {
            clearTimeout(slideTimeoutId);
        };
    }, []);

    // Filter latest products
    useEffect(() => {
        let tempProducts = products;

        tempProducts.sort(function (a, b) {
            return new Date(b.createdDate) - new Date(a.createdDate);
        });

        setLatestProducts(tempProducts);
    }, [products]);

    useEffect(() => {
        document.getElementById('latestProductWrapper').style.transform = `translateX(${
            Math.trunc(-(currentLatestProduct - 1) / colNum[currentMediaType]) * 100
        }%)`;
    }, [currentLatestProduct]);

    useEffect(() => {
        try {
            document.getElementById('suggestedProductWrapper').style.transform = `translateX(${
                Math.trunc(-(currentSuggestedProduct - 1) / suggestedProductColNum[currentMediaType]) * 100
            }%)`;
        } catch {}

        if (slideTimeoutId) {
            slideTimeoutId = setTimeout(() => {
                handleSuggestedProductRightButtonClick();
            }, slideChangeTime);
        }
    }, [currentSuggestedProduct]);

    useEffect(() => {
        slideTimeoutId = setTimeout(() => {
            handleSuggestedProductRightButtonClick();
        }, slideChangeTime);

        return () => {
            clearTimeout(slideTimeoutId);
        };
    }, [suggestedProducts]);

    useEffect(() => {
        setCurrentLatestProduct(1);
    }, [showMoreLatestProduct]);

    const handleSuggestedProductLeftButtonClick = () => {
        if (suggestedProductColNum[currentMediaType] == 1) {
            setCurrentSuggestedProduct(
                currentSuggestedProduct == 1 ? suggestedProducts.length : currentSuggestedProduct - 1,
            );
        } else {
            if (currentSuggestedProduct == 1) {
                setCurrentSuggestedProduct(
                    suggestedProducts.length -
                        ((suggestedProducts.length - 1) % suggestedProductColNum[currentMediaType]),
                );
            } else {
                setCurrentSuggestedProduct(currentSuggestedProduct - suggestedProductColNum[currentMediaType]);
            }
        }
    };

    const handleSuggestedProductRightButtonClick = () => {
        if (currentSuggestedProduct + suggestedProductColNum[currentMediaType] > suggestedProducts.length) {
            setCurrentSuggestedProduct(1);
        } else {
            const mediaType = currentMediaType ? currentMediaType : getCurrentMediaType();
            setCurrentSuggestedProduct(currentSuggestedProduct + suggestedProductColNum[mediaType]);
        }
    };

    // Mock AI Suggestion API call
    const fetchAISuggestions = async () => {
        setIsLoadingSuggestions(true);
        setSuggestionError(null);
        setSuggestedProducts([]); // Clear previous suggestions

        try {
            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Mock API response based on "user behavior" (e.g., viewed products)
            // For simplicity, let's suggest products not in viewed history, or random ones.
            const availableProductsForSuggestions = products.filter(
                (p) => !viewedProducts.some((vp) => vp.id === p.id),
            );

            let suggestions = [];
            if (availableProductsForSuggestions.length > 0) {
                // Get 3 random unique suggestions
                const shuffled = [...availableProductsForSuggestions].sort(() => 0.5 - Math.random());
                suggestions = shuffled.slice(0, suggestedProductNum);
            } else {
                // If all products viewed, just pick 3 random from all products
                const shuffled = [...products].sort(() => 0.5 - Math.random());
                suggestions = shuffled.slice(0, suggestedProductNum);
            }

            // Simulate a potential API error 10% of the time
            // if (Math.random() < 0.1) { // Removed this line to prevent simulated errors
            //   throw new Error('Lỗi khi lấy gợi ý từ AI.');
            // }

            setSuggestedProducts(suggestions);
        } catch (error) {
            console.error('Error fetching AI suggestions:', error);
            setSuggestionError('Không thể lấy gợi ý lúc này. Vui lòng thử lại sau.');
            setSuggestedProducts([]);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    return (
        <>
            {/* <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <input
                    type="text"
                    placeholder="Tìm kiếm khóa học, sản phẩm..."
                    className="p-2 rounded-lg border border-gray-300 w-full md:w-80 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="p-2 rounded-lg border border-gray-300 text-gray-800 w-full md:w-auto focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                >
                    <option value="all">Tất cả giá</option>
                    <option value="<500K">Dưới 500.000 VNĐ</option>
                    <option value="500K-1M">500.000 - 1.000.000 VNĐ</option>
                    <option value=">1M">Trên 1.000.000 VNĐ</option>
                </select>
                <button
                    onClick={fetchAISuggestions}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 w-full md:w-auto"
                    disabled={isLoadingSuggestions}
                >
                    {isLoadingSuggestions ? 'Đang gợi ý...' : 'Gợi ý sản phẩm phù hợp (AI)'}
                </button>
                <button
                    onClick={() => setShowChatbot(true)}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 w-full md:w-auto flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.517 12.118 2 10.536 2 9c0-3.866 3.582-7 8-7s8 3.134 8 7z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Chatbot AI
                </button>
            </div> */}

            {/* Main Content */}
            {/* AI Suggestions Section */}
            {suggestedProducts.length > 0 && (
                <section
                    className="mb-12 p-6 bg-blue-50 rounded-xl shadow-md"
                    onMouseOver={() => {
                        clearTimeout(slideTimeoutId);
                    }}
                    onMouseOut={() => {
                        slideTimeoutId = setTimeout(() => {
                            handleSuggestedProductRightButtonClick();
                        }, slideChangeTime);
                    }}
                >
                    <h2 className="text-2xl font-bold text-blue-700 mb-6">Gợi ý từ AI dành cho bạn</h2>

                    <div className="relative w-full mb-6">
                        {/* <!-- Carousel wrapper --> */}
                        <div className="relative overflow-x-clip scroll-smooth rounded-lg mx-16">
                            <div className="flex flex-nowrap transition" id="suggestedProductWrapper">
                                {suggestedProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onDetailClick={handleProductDetailClick}
                                        onToggleFavorite={handleToggleFavorite}
                                        isFavorite={isProductFavorite(product.id)}
                                        className={`flex-col-${suggestedProductColNum[currentMediaType]} mx-[10px]`}
                                    />
                                ))}
                            </div>
                        </div>
                        {/* <!-- Slider controls --> */}
                        <button
                            type="button"
                            onClick={() => {
                                setTimeout(() => {
                                    clearTimeout(slideTimeoutId);
                                }, 100);
                                handleSuggestedProductLeftButtonClick();
                            }}
                            className="hidden md:flex absolute top-0 start-0 z-30 items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                        >
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/30 group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-gray-800/70 group-focus:outline-none">
                                <svg
                                    className="w-4 h-4 text-gray-800 rtl:rotate-180"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 1 1 5l4 4"
                                    />
                                </svg>
                                <span className="sr-only">Previous</span>
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setTimeout(() => {
                                    clearTimeout(slideTimeoutId);
                                }, 100);
                                handleSuggestedProductRightButtonClick();
                            }}
                            className="hidden md:flex absolute top-0 end-0 z-30 items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                        >
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/30 group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-gray-800/70 group-focus:outline-none">
                                <svg
                                    className="w-4 h-4 text-gray-800 rtl:rotate-180"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                                <span className="sr-only">Next</span>
                            </span>
                        </button>
                    </div>

                    {/* <!-- Slider indicators --> */}
                    <div className="z-30 flex justify-center space-x-3 rtl:space-x-reverse">
                        {console.log(suggestedProducts.length, suggestedProductColNum[currentMediaType])}
                        {Array.from(
                            { length: Math.ceil(suggestedProducts.length / suggestedProductColNum[currentMediaType]) },
                            (_, i) => i,
                        ).map((i) => (
                            <button
                                type="button"
                                className={`cursor-pointer w-3 h-3 ${
                                    i ==
                                    Math.floor((currentSuggestedProduct - 1) / suggestedProductColNum[currentMediaType])
                                        ? 'bg-gray-700'
                                        : 'bg-gray-400'
                                } hover:bg-gray-700 rounded-full`}
                                onClick={() => {
                                    setTimeout(() => {
                                        clearTimeout(slideTimeoutId);
                                    }, 100);
                                    setCurrentSuggestedProduct(i * suggestedProductColNum[currentMediaType] + 1);
                                }}
                                key={i}
                            ></button>
                        ))}
                    </div>
                </section>
            )}

            {isLoadingSuggestions && (
                <section className="mb-8 p-6 bg-white rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Đang tải gợi ý...</h2>
                    <LoadingSkeleton number={suggestedProductColNum[currentMediaType]} />
                </section>
            )}

            {suggestionError && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8"
                    role="alert"
                >
                    <strong className="font-bold">Lỗi!</strong>
                    <span className="block sm:inline"> {suggestionError}</span>
                </div>
            )}

            {/* Latest Products */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-2.5">
                    <h2 className="text-2xl font-bold text-gray-700 p-2">Khóa học mới nhất</h2>

                    <div>
                        {!showMoreLatestProduct && (
                            <>
                                <Button
                                    varient="icon"
                                    className={currentLatestProduct == 1 ? 'disabled' : ''}
                                    onClick={() => {
                                        if (currentLatestProduct == 1) return;
                                        if (currentLatestProduct <= colNum[currentMediaType]) {
                                            setCurrentLatestProduct(1);
                                        } else {
                                            setCurrentLatestProduct(currentLatestProduct - colNum[currentMediaType]);
                                        }
                                    }}
                                >
                                    <ArrowLeftIcon className="w-4 h-4 fill-white" />
                                </Button>
                                <Button
                                    varient="icon"
                                    className={
                                        currentLatestProduct + colNum[currentMediaType] >= latestProducts.length
                                            ? 'disabled'
                                            : ''
                                    }
                                    onClick={() => {
                                        if (currentLatestProduct + colNum[currentMediaType] - 1 >= products.length)
                                            return;
                                        else {
                                            setCurrentLatestProduct(currentLatestProduct + colNum[currentMediaType]);
                                        }
                                    }}
                                >
                                    <ArrowRightIcon className="w-4 h-4 fill-white" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="overflow-x-clip scroll-smooth">
                    <div
                        className={`flex ${showMoreLatestProduct ? 'flex-wrap' : 'flex-nowrap'} transition`}
                        id="latestProductWrapper"
                    >
                        {latestProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onDetailClick={handleProductDetailClick}
                                onToggleFavorite={handleToggleFavorite}
                                isFavorite={isProductFavorite(product.id)}
                                className={`flex-col-${colNum[currentMediaType]} mx-[10px] mb-4`}
                            />
                        ))}
                    </div>
                </div>

                <Button
                    onClick={() => setShowMoreLatestProduct(!showMoreLatestProduct)}
                    varient="light"
                    className="block ml-auto mr-auto mt-5 px-8"
                >
                    {showMoreLatestProduct ? 'Hiển thị bớt' : 'Hiển thị thêm'}
                </Button>
            </section>
        </>
    );
};

export default Home;
