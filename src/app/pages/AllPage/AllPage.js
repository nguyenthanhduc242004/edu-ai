import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import GlobalContext from '../../contexts/GlobalContext';
import Button from '../../components/Button';
import './AllPage.css';
import { getTrackBackground, Range } from 'react-range';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import { removeVietnameseTones } from '../../../lib/removeVietnameseTones';

const MIN = 0;
const MAX = 5000000;

const getPriceFilterString = (priceFilterValues) => {
    if (priceFilterValues[0] == MIN && priceFilterValues[1] == MAX) {
        return 'Tất cả';
    } else if (priceFilterValues[0] == priceFilterValues[1]) {
        return `${priceFilterValues[0].toLocaleString('vi-VN')}₫`;
    } else if (priceFilterValues[0] == 0) {
        return `Dưới ${priceFilterValues[1].toLocaleString('vi-VN')}₫`;
    } else {
        return `${priceFilterValues[0].toLocaleString('vi-VN')}₫ - ${priceFilterValues[1].toLocaleString('vi-VN')}₫`;
    }
};

export default function AllPage() {
    const { products, handleProductDetailClick, handleToggleFavorite, isProductFavorite, setCurrentPage } =
        useContext(GlobalContext);

    const filterPriceButtonWrapperRef = useRef();
    const searchInputRef = useRef();
    const priceFilterWarningRef = useRef();

    const [filteredProducts, setFilteredProducts] = useState(products);

    const [priceFilterValues, setPriceFilterValues] = useState([MIN, MAX]);
    const [tempPriceFilterValues, setTempPriceFilterValues] = useState([MIN, MAX]);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setCurrentPage('/all');
    }, []);

    // Filter products based on search term and price filter
    useEffect(() => {
        let tempProducts = products;

        // Apply search filter
        if (searchTerm) {
            tempProducts = tempProducts.filter((product) =>
                removeVietnameseTones(product.name)
                    .toLowerCase()
                    .includes(removeVietnameseTones(searchTerm).toLowerCase()),
            );
        }

        // Apply price filter
        if (!(priceFilterValues[0] == MIN && priceFilterValues[1] == MAX)) {
            tempProducts = tempProducts.filter((product) => {
                return product.price >= priceFilterValues[0] && product.price <= priceFilterValues[1];
            });
        }

        setFilteredProducts(tempProducts);
    }, [searchTerm, priceFilterValues, products]);

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Tất cả khóa học</h2>

            <div className="flex flex-col md:flex-row md:items-center mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20 my-8">
                <form className="flex-grow mr-6 mb-4 md:mb-0">
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-700"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            className="block w-full p-4 ps-10 text-md text-gray-900 border border-gray-500 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Tìm kiếm khóa học..."
                            ref={searchInputRef}
                            onKeyDown={(e) => {
                                if (e.key == 'Enter') {
                                    e.preventDefault();
                                    setSearchTerm(searchInputRef.current.value);
                                }
                            }}
                        />
                        <Button
                            className="text-white absolute end-2.5 bottom-2 !mb-0 mr-0"
                            onClick={(e) => {
                                setSearchTerm(searchInputRef.current.value);
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </div>
                </form>

                <Tippy
                    theme="light"
                    trigger="click"
                    zIndex={999}
                    content={
                        <div className="flex flex-col bg-white p-4">
                            <span
                                ref={priceFilterWarningRef}
                                className="hidden text-red-600 flex-grow text-center mb-2.5"
                            >
                                Giá trị lọc không hợp lệ!
                            </span>
                            <div className="flex flex-row items-center mb-6">
                                <input
                                    aria-describedby="helper-text-explanation"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    value={`${tempPriceFilterValues[0].toLocaleString('vi-VN')}`}
                                    required
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter') {
                                            if (tempPriceFilterValues[1] >= tempPriceFilterValues[0]) {
                                                setPriceFilterValues(tempPriceFilterValues);
                                                filterPriceButtonWrapperRef.current.dispatchEvent(new Event('click'));
                                                priceFilterWarningRef.current.classList.add('hidden');
                                            } else {
                                                priceFilterWarningRef.current.classList.remove('hidden');
                                            }
                                        }
                                    }}
                                    onInput={(e) => {
                                        let intValue = parseInt(String(e.target.value).replace(/\./g, ''));
                                        if (Number.isNaN(intValue)) intValue = 0;

                                        if (intValue > MAX) intValue = MAX;

                                        // if (intValue > tempPriceFilterValues[1]) intValue = tempPriceFilterValues[1];

                                        setTempPriceFilterValues([intValue, tempPriceFilterValues[1]]);
                                    }}
                                />
                                <span className="font-bold mx-2">-</span>
                                <input
                                    aria-describedby="helper-text-explanation"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    value={`${tempPriceFilterValues[1].toLocaleString('vi-VN')}`}
                                    required
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter') {
                                            if (tempPriceFilterValues[1] >= tempPriceFilterValues[0]) {
                                                setPriceFilterValues(tempPriceFilterValues);
                                                filterPriceButtonWrapperRef.current.dispatchEvent(new Event('click'));
                                                priceFilterWarningRef.current.classList.add('hidden');
                                            } else {
                                                priceFilterWarningRef.current.classList.remove('hidden');
                                            }
                                        }
                                    }}
                                    onInput={(e) => {
                                        let intValue = parseInt(String(e.target.value).replace(/\./g, ''));
                                        if (Number.isNaN(intValue)) intValue = 0;

                                        if (intValue > MAX) intValue = MAX;

                                        setTempPriceFilterValues([tempPriceFilterValues[0], intValue]);
                                    }}
                                />
                            </div>

                            <div className="mx-4">
                                <Range
                                    label="Select your value"
                                    step={100000}
                                    min={MIN}
                                    max={MAX}
                                    values={tempPriceFilterValues}
                                    onChange={(tempPriceFilterValues) =>
                                        setTempPriceFilterValues(tempPriceFilterValues)
                                    }
                                    renderTrack={({ props, children }) => (
                                        <div
                                            {...props}
                                            style={{
                                                ...props.style,
                                                height: '6px',
                                                width: '100%',
                                                background: getTrackBackground({
                                                    values: tempPriceFilterValues,
                                                    colors: ['#ccc', '#0d63fd', '#ccc'],
                                                    min: MIN,
                                                    max: MAX,
                                                }),
                                            }}
                                        >
                                            {children}
                                        </div>
                                    )}
                                    renderThumb={({ props }) => (
                                        <div
                                            {...props}
                                            key={props.key}
                                            style={{
                                                ...props.style,
                                                height: '20px',
                                                width: '20px',
                                                backgroundColor: '#0d63fd',
                                                border: '2px solid white',
                                                borderRadius: '50%',
                                                boxShadow: '0px 2px 6px #aaa',
                                            }}
                                        />
                                    )}
                                />

                                <div className="flex flex-row justify-between text-sm mt-1">
                                    <span>{MIN.toLocaleString('vi-VN')}₫</span>
                                    <span>{MAX.toLocaleString('vi-VN')}₫</span>
                                </div>
                            </div>

                            <div className="flex flex-row mt-6 mx-2">
                                <Button
                                    className="flex flex-row items-center !mb-0"
                                    varient="red"
                                    onClick={() => {
                                        setPriceFilterValues([MIN, MAX]);
                                        filterPriceButtonWrapperRef.current.dispatchEvent(new Event('click'));
                                        priceFilterWarningRef.current.classList.add('hidden');
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#fff"
                                    >
                                        <path d="m592-481-57-57 143-182H353l-80-80h487q25 0 36 22t-4 42L592-481ZM791-56 560-287v87q0 17-11.5 28.5T520-160h-80q-17 0-28.5-11.5T400-200v-247L56-791l56-57 736 736-57 56ZM535-538Z" />
                                    </svg>
                                    <span className="flex-grow ml-2">Bỏ lọc</span>
                                </Button>

                                <Button
                                    className="flex-grow flex flex-row items-center !mb-0"
                                    varient="default"
                                    onClick={() => {
                                        if (tempPriceFilterValues[1] >= tempPriceFilterValues[0]) {
                                            setPriceFilterValues(tempPriceFilterValues);
                                            filterPriceButtonWrapperRef.current.dispatchEvent(new Event('click'));
                                            priceFilterWarningRef.current.classList.add('hidden');
                                        } else {
                                            priceFilterWarningRef.current.classList.remove('hidden');
                                        }
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#fff"
                                    >
                                        <path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z" />
                                    </svg>
                                    <span className="flex-grow">Lọc</span>
                                </Button>
                            </div>
                        </div>
                    }
                    placement="bottom-end"
                    interactive={true}
                >
                    <span className="self-start md:self-auto" tabIndex="0" ref={filterPriceButtonWrapperRef}>
                        <Button id="filterPriceButton" className="!m-0 !text-md" varient="light">
                            {`Lọc giá: ${getPriceFilterString(priceFilterValues)}`}
                        </Button>
                    </span>
                </Tippy>
            </div>

            {filteredProducts.length === 0 && (
                <p className="text-gray-600 text-lg text-center py-10">Không tìm thấy sản phẩm nào phù hợp.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-4">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onDetailClick={handleProductDetailClick}
                        onToggleFavorite={handleToggleFavorite}
                        isFavorite={isProductFavorite(product.id)} // Always true on this page
                    />
                ))}
            </div>
        </>
    );
}
