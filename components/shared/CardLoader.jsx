const CardLoader = () => {
    return (
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 w-full max-w-7xl px-4 py-6">
        {Array.from({ length: 10 }).map((_, index) => (
         <div key={index} className="animate-pulse flex flex-col items-center space-y-4 p-4 border border-gray-200 rounded-lg">
         <div className="bg-gray-300 h-20 w-full rounded"></div>
         <div className="h-4 bg-gray-300 rounded w-3/4"></div>
         <div className="h-4 bg-gray-300 rounded w-1/2"></div>
       </div>
        ))}
      </div>
    );
  };
  
  export default CardLoader;