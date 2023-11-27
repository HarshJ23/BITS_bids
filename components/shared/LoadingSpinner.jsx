// LoadingSpinner.js
export function LoadingSpinner() {
    return (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 z-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-900"></div>
    </div>
    );
}
