'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'; // Corrected the import statement
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '@/components/shared/Navbar';

export default function page({params}) {

    const router = useRouter();
    const { data: session , status } = useSession();
    // const isLoad = stat === "loading";
    const [userBids, setAllUserBids] = useState([]);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            toast.error('You must be signed in to access the register page.');
            router.push('/signin');
            return;
        }
    }, [session, status, router]);
    useEffect(()=>{
        const getBidsOfUser = async ()=>{
            try {
                const response = await fetch(`https://bitsbids.azurewebsites.net/api/bid/getBidsOfUserFromEmail?email=${params.id}`,{
                    method : 'GET',
                    headers : {
                        'Baby' : '123',
                    }
                });
                if(!response.ok){
                    throw new Error('Error occured');
                }
                const bids = await response.json();
                setAllUserBids(bids);
            } catch (error) {
                console.error('Error while fetching data',error);
            }
        }
        getBidsOfUser();
    },[params.id]);
  
    useEffect(()=>{
        console.log(userBids);
    },[userBids]);


    const onRowClick = (bidId) => {
        router.push(`/bid/contact/${bidId}`);
      };

    return (
        <div>
            <Navbar/>
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg m-8">
    <p className='my-4 mx-8 font-extrabold text-2xl lg:text-4xl tracking-tight'>All bids placed by you!</p>
    <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-sm text-gray-700 uppercase bg-gray-100">
            <tr>
                <th scope="col" className="py-3 px-6">Product ID</th>
                <th scope="col" className="py-3 px-6">Bid Price</th>
                {/* <th scope="col" className="py-3 px-6">Date</th> */}
            </tr>
        </thead>
        <tbody>
            {userBids.map((bid, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-100 cursor-pointer" onClick={() => onRowClick(bid.id)} >
                    <td className="py-4 px-6">{bid.forWhichProductId}</td>
                    <td className="py-4 px-6">{bid.priceOfBid}</td>
                    {/* <td className="py-4 px-6">{bid.timestampOfCreation ? new Date(bid.timestampOfCreation).toLocaleDateString() : "2/12/2023"}</td> */}
                </tr>
            ))}
        </tbody>
    </table>
</div>
        </div>
    )
}