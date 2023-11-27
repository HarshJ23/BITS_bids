import React from 'react';
// import { useNavigate } from 'react-router-dom'; // assuming you're using react-router for navigation
import { useRouter } from 'next/navigation';

const DataTable = ({ data, buyerSellerName }) => {
    const router = useRouter();
//   const navigate = useNavigate();

  const onRowClick = (itemId) => {
    router.push(`/listings/product/${itemId}`);
  };

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-3  z-0">
    <table className="w-full text-sm text-left text-gray-500">
      <thead className="text-sm text-gray-700 uppercase bg-gray-100">
        <tr>
          <th scope="col" className="py-3 px-6">Item Name</th>
          <th scope="col" className="py-3 px-6">Price</th>
          <th scope="col" className="py-3 px-6">{buyerSellerName}</th>
          <th scope="col" className="py-3 px-6">Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} onClick={() => onRowClick(row.id)} className="bg-white border-b hover:bg-gray-100 cursor-pointer">
            <td className="py-4 px-6">{row.name}</td>
            {row.isSold == 1 ? (<td className="py-4 px-6">{row.sellingPrice}</td>):( <td className="py-4 px-6">{row.price}</td>)}
           
            {buyerSellerName == "Seller" ? (<td className="py-4 px-6">{row.userCreatedEmailId || 'Not sold'}</td>):(<td className="py-4 px-6">{row.soldToUserName || 'Not sold'}</td>)}
            <td className="py-4 px-6">{new Date(row.createdOn).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default DataTable;
