// Loading Skeleton for AI Suggestions
export default function LoadingSkeleton({ number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
            {[...Array(number)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-4">
                        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6 mt-2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
