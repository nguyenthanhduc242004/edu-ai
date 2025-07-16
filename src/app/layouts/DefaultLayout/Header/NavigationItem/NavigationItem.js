import { useContext } from 'react';
import { Link } from 'react-router-dom';
import GlobalContext from '../../../../contexts/GlobalContext';

export default function NavigationItem({ name, to, className, Icon, onMouseOver, onMouseOut, isHovered }) {
    const { currentPage } = useContext(GlobalContext);

    return (
        <li className="text-lg pl-2 pr-4  md:pl-3 md:pr-6 xl:pl-4 xl:pr-8">
            <Link
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                className={`transition flex flex-row items-center justify-center hover:text-main font-bold ${className}`}
                to={to}
            >
                <span
                    className={`transition relative ${
                        currentPage == to || isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                >
                    {Icon}
                </span>
                <span className="ml-1">{name}</span>
            </Link>
        </li>
    );
}
