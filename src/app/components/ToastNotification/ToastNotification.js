import { useEffect } from 'react';

export default function ToastNotification({ message, type, onClose }) {
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const textColor = 'text-white';

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg ${bgColor} ${textColor} z-50 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100`}
        >
            {message}
        </div>
    );
}
