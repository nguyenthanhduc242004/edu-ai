import { useContext, useEffect, useState } from 'react';
import NavigationItem from './NavigationItem';
import GlobalContext from '../../../contexts/GlobalContext';
import Button from '../../../components/Button';
import { AllIcon, BarsIcon, FavoriteIcon, HistoryIcon, HomeIcon } from '../../../components/Icons';
import SidebarItem from './SidebarItem';
import { Link } from 'react-router-dom';

export default function Header() {
    const { currentPage, favoriteProducts } = useContext(GlobalContext);
    const [showMenu, setShowMenu] = useState(false);
    const [navbarItemHovering, setNavbarItemHovering] = useState('');

    const handleWindowClick = () => {
        setShowMenu(false);
    };

    useEffect(() => {
        window.addEventListener('click', handleWindowClick);

        return () => {
            window.removeEventListener('click', handleWindowClick);
        };
    }, []);

    return (
        <header className="flex bg-white h-18 text-black shadow-lg sticky top-0 z-9999">
            <div className="container mx-auto flex flex-row items-center justify-between gap-4">
                <Link to="/">
                    <h1 className="text-3xl font-extrabold cursor-pointer hover:opacity-90 transition-opacity text-main ml-4">
                        EduAI
                    </h1>
                </Link>
                <nav className="hidden md:block">
                    <ul className="list-none flex">
                        <NavigationItem
                            onMouseOver={() => {
                                setNavbarItemHovering('/');
                            }}
                            onMouseOut={() => {
                                setNavbarItemHovering('');
                            }}
                            isHovered={navbarItemHovering == '/'}
                            className={currentPage == '/' ? 'text-main' : ''}
                            name="Trang chủ"
                            to="/"
                            Icon={<HomeIcon className="fill-main" />}
                        />
                        <NavigationItem
                            onMouseOver={() => {
                                setNavbarItemHovering('/all');
                            }}
                            onMouseOut={() => {
                                setNavbarItemHovering('');
                            }}
                            isHovered={navbarItemHovering == '/all'}
                            className={currentPage == '/all' ? 'text-main' : ''}
                            name="Tất cả"
                            to="/all"
                            Icon={<AllIcon className="fill-main" />}
                        />
                        <NavigationItem
                            onMouseOver={() => {
                                setNavbarItemHovering('/favorite');
                            }}
                            onMouseOut={() => {
                                setNavbarItemHovering('');
                            }}
                            isHovered={navbarItemHovering == '/favorite'}
                            className={currentPage == '/favorite' ? 'text-main' : ''}
                            name="Yêu thích"
                            to="/favorite"
                            Icon={<FavoriteIcon className="fill-main" />}
                        />
                        <NavigationItem
                            onMouseOver={() => {
                                setNavbarItemHovering('/history');
                            }}
                            onMouseOut={() => {
                                setNavbarItemHovering('');
                            }}
                            isHovered={navbarItemHovering == '/history'}
                            className={currentPage == '/history' ? 'text-main' : ''}
                            name="Lịch sử"
                            to="/history"
                            Icon={<HistoryIcon className="fill-main" />}
                        />
                    </ul>
                </nav>

                <Button
                    varient="light"
                    className="md:hidden !mb-0 mr-4"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu((prev) => !prev);
                    }}
                >
                    <BarsIcon />
                </Button>

                {showMenu && <div className="md:hidden fixed top-0 bottom-0 right-0 left-0 bg-black opacity-50"></div>}

                <aside
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    id="logo-sidebar"
                    className={`fixed top-0 right-0 z-40 w-80 h-screen shadow-2xl transition-transform ${
                        showMenu ? 'translatex-x-0' : 'translate-x-full'
                    } md:hidden`}
                    aria-label="Sidebar"
                >
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
                        <div className="flex flex-row justify-between items-center mb-2 h-[40px]">
                            <h2 className="text-2xl font-extrabold transition-opacity text-main ml-4">EduAI</h2>

                            <Button
                                varient="light"
                                className="!mb-0 mr-4"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu((prev) => !prev);
                                }}
                            >
                                <BarsIcon />
                            </Button>
                        </div>

                        <ul className="space-y-2 font-medium">
                            <SidebarItem
                                onClick={() => {
                                    setShowMenu(false);
                                }}
                                name="Trang chủ"
                                to="/"
                                Icon={<HomeIcon />}
                            />
                            <SidebarItem
                                onClick={() => {
                                    setShowMenu(false);
                                }}
                                name="Tất cả"
                                to="/all"
                                Icon={<AllIcon />}
                            />
                            <SidebarItem
                                onClick={() => {
                                    setShowMenu(false);
                                }}
                                name="Yêu thích"
                                to="/favorite"
                                number={favoriteProducts.length}
                                Icon={<FavoriteIcon />}
                            />
                            <SidebarItem
                                onClick={() => {
                                    setShowMenu(false);
                                }}
                                name="Lịch sủ"
                                to="/history"
                                Icon={<HistoryIcon />}
                            />
                        </ul>
                    </div>
                </aside>
            </div>
        </header>
    );
}
