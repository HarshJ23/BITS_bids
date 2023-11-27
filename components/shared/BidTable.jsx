import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BidTable({ bids }) {

const router = useRouter();
    const [bidDetails, setBidDetails] = useState([]);


    useEffect(() => {
        const fetchBidDetails = async () => {
            const fetchedBids = [];

            console.log('Fetching bid details for IDs:', bids); // Debug: Log the bid IDs

            for (const bidId of bids) {
                try {
                    console.log(`Fetching details for bid ID: ${bidId}`); // Debug: Log each bid ID being fetched
                    const response = await fetch(`https://bitsbids.azurewebsites.net/api/bid/${bidId}`,{
                        headers:{
                            'Baby' : '123'
                        }
                    });
                    
                    if (response.ok) {
                        const bidData = await response.json();
                        console.log('Fetched bid data:', bidData); // Debug: Log fetched bid data
                        fetchedBids.push(bidData);
                    } else {
                        console.error('Failed to fetch bid details:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching bid details:', error);
                }
            }

            setBidDetails(fetchedBids);
            console.log('All fetched bid details:', fetchedBids); // Debug: Log all fetched bid details
        };

        fetchBidDetails();
    }, [bids]);


    const onRowClick = (bidId) => {
        router.push(`/bid/contact/${bidId}`);
      };

    return (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg m-8">
            <p className='my-4 mx-8'>All bids placed on this product </p>
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-sm text-gray-700 uppercase bg-gray-100">
                    <tr>
                        <th scope="col" className="py-3 px-6">Bids</th>
                        <th scope="col" className="py-3 px-6">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {bidDetails.map((bid, index) => (
                        <tr key={index} className="bg-white border-b hover:bg-gray-100 cursor-pointer" onClick={() => onRowClick(bid.id)} >
                            <td className="py-4 px-6">{bid.priceOfBid}</td>
                            <td className="py-4 px-6">{new Date(bid.timestamp).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
