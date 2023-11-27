// TabularSkeletonLoader.js
export function TabularSkeletonLoader() {
    return (
        <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-8 bg-gray-300 rounded"></div> {/* Header Placeholder */}
            {[...Array(5)].map((_, i) => ( // Row Placeholders
                <div key={i} className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 h-8 bg-gray-300 rounded"></div>
                    <div className="col-span-2 h-8 bg-gray-300 rounded"></div>
                </div>
            ))}
        </div>
    );
}
