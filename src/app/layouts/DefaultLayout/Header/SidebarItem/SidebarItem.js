import { Link } from 'react-router-dom';

export default function SidebarItem({ name, to, className, number, Icon, onClick }) {
    return (
        <li>
            <Link
                onClick={onClick}
                to={to}
                className={`flex items-center p-4 text-gray-900 rounded-lg hover:bg-gray-200 group ${className}`}
            >
                {Icon}
                <span className="flex-1 ms-3 whitespace-nowrap">{name}</span>
                {number && (
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                        {number}
                    </span>
                )}
            </Link>
        </li>
    );
}
