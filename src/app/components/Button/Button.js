import './Button.css';

const baseCSS = 'cursor-pointer font-medium text-sm focus:outline-none focus:ring-4 me-2';

const buttonVarients = {
    default: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 rounded-lg px-5 py-2.5 mb-2',
    light: 'text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-gray-100 rounded-lg px-5 py-2.5 mb-2',
    icon: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 rounded-full p-2.5 text-center inline-flex items-center',
    red: 'focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2',
};

export default function Button({ children, onClick, className = '', varient = 'default', ref }) {
    return (
        <button
            type="button"
            ref={ref}
            onClick={onClick}
            className={`${baseCSS} ${buttonVarients[varient]} ${className}`}
        >
            {children}
        </button>
    );
}
