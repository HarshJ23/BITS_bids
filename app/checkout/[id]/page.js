'use client'
import Navbar from "@/components/shared/Navbar";
import { useState , useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react'
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function page({params}) {

let bidId = params.id;
const { data: session } = useSession();
const router = useRouter();
// const [isLoading, setIsLoading] = useState(true);
const [hasAccess, setHasAccess] = useState(false);

const [individualBid , setIndividualBid] = useState({
    id: null,
    userCreatedEmailId: '',
    forWhichProductId: null,
    priceOfBid: 0.0,
    timestamp: '',
    isExpired: 0
});

const [individualListing, setIndividualListing] = useState({
    id: null,
    userCreatedEmailId: '',
    photosUrls: '',
    name: '',
    price: 0.0,
    createdOn: '',
    deadline: '',
    quantity: 1,
    details: '',
    isSold: 0,
    soldDate: '',
    soldToUserName: '',
    bidsOnThisProduct: [],
    photoUrlsOnThisProduct: [],
    finalBidId : null
  });

  //storing buyers data to cancel double blind
  const [buyerData, setBuyerData] = useState({
    id: null,
    name: '',
    email: '',
    address: '',
    phoneNumber: '',
    moneyLeft: 0,
    itemsPurchased: [], 
    // id store hoga of pdt
    itemsListed: [],
    //    // id store hoga of pdt
    visibleTo: [],
    itemsSold: [],
    //past listings.
    currentBids: [],
    pastBids: '',
    moneySpent: 0,
    password: ''
  });


    //storing buyers data to cancel double blind
    const [sellerData, setSellerData] = useState({
        id: null,
        name: '',
        email: '',
        address: '',
        phoneNumber: '',
        moneyLeft: 0,
        itemsPurchased: [], 
        // id store hoga of pdt
        itemsListed: [],
        //    // id store hoga of pdt
        visibleTo: [],
        itemsSold: [],
        //past listings.
        currentBids: [],
        pastBids: '',
        moneySpent: 0,
        password: ''
      });


    


  

// fetching individual bid detail
useEffect(()=>{
    const getDetails = async ()=>{
    try {
        const response = await fetch(`https://bitsbids.azurewebsites.net/api/bid/${bidId}`,{
            method : 'GET',
            headers:{
                'Baby' : '123'
            }
        });
        if(!response.ok){
            throw new Error('Error occured');
          }
          const bidDetail = await response.json();
          setIndividualBid(bidDetail);
        //   console.log(bidDetail);
    } catch (error) {
        console.error('Error while fetching data',error);
    }}
    getDetails();
    },[bidId]);

useEffect(()=>{
console.log(individualBid);
},[individualBid])

// fetching product details by id from bid details
useEffect(()=>{
    const getListingbyId = async ()=>{
        try {
          const response = await fetch(`https://bitsbids.azurewebsites.net/api/product/${individualBid.forWhichProductId}`,{
            method : 'GET',
            headers : {
              'Baby' : '123',
            }
          });
          if(!response.ok){
            throw new Error('Error occured');
          }
          const listing = await response.json();
          setIndividualListing(listing);
        //   console.log(listing);
        } catch (error) {
          console.error('Error while fetching data',error);
        }
    }
    getListingbyId();
  },[individualBid.forWhichProductId]);

  useEffect(()=>{
    console.log(individualListing);
    },[individualListing])


    //fetch buyer details
    useEffect(()=>{
        const getBuyer = async ()=>{
            try {
                const response = await fetch(`https://bitsbids.azurewebsites.net/api/users/getUserFromEmail?email=${individualBid.userCreatedEmailId}` , {
                    method : 'GET',
                    headers:{
                        'Baby' : '123',
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  const getBuyerData = await response.json();
                  setBuyerData(getBuyerData);
                //   console.log(buyerData);
            } catch (error) {
                console.error('Error fetching data:', error)
          }
        }
    getBuyer();
    },[individualBid.userCreatedEmailId]);

    useEffect(()=>{
        const getSeller = async ()=>{
            try {
                const response = await fetch(`https://bitsbids.azurewebsites.net/api/users/getUserFromEmail?email=${individualListing.userCreatedEmailId}` , {
                    method : 'GET',
                    headers:{
                        'Baby' : '123',
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  const getSellerData = await response.json();
                  setSellerData(getSellerData);
                //   console.log(buyerData);
            } catch (error) {
                console.error('Error fetching data:', error)
          }
        }
    getSeller();
    },[individualListing.userCreatedEmailId]);


    useEffect(() => {
        if (session?.user?.email) {
          if (session.user.email === individualBid.userCreatedEmailId || session.user.email === individualListing.userCreatedEmailId) {
            setHasAccess(true);
          } else {
            setHasAccess(false);
            // Optional: Redirect or show an error message
            // router.push('/');
          }
        }
      }, [session?.user?.email, individualBid.userCreatedEmailId, individualListing.userCreatedEmailId]);
    
    //   if (hasAccess) {
    //     // Render an error message or a redirect component
    //     router.push("/");
    //     // return <div>Access Denied</div>;
    //   }



  return (
    <div>
    <Navbar/>

    {hasAccess ? (<><section className='grid grid-cols-1 gap-7 sm:grid-cols-3 my-4 mx-4'>
        <div>
            <Image
            src={individualListing.photosUrls}
            width={400}
            height={400}
            alt="Picture of the author"
            className="object-cover h-80 w-80 mx-4 my-4 rounded-lg"
            />
        </div>

        <div className='col-span-2 mx-3'>
            <h1 className='font-bold text-4xl tracking-tight'>{individualListing.name}</h1>
            <p className="text-xl mt-3">{individualListing.details}</p>

            {/* price and bid subsection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 mt-4">
                <div className="flex flex-row gap-6">
                    <div className="flex flex-col">
                        <p className="text-xl">Asking Price:</p>
                        <h1 className='font-bold text-4xl tracking-tight'>{individualListing.price}</h1>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-xl">Item sold for:</p>
                        <h1 className='font-bold text-4xl tracking-tight'>{individualBid.priceOfBid}</h1>
                    </div>
                </div>

                <div className="flex flex-col">
                    <p>Listed on : {new Date(individualListing.createdOn).toLocaleDateString()}</p>
                    <p className="text-red-500">Bid deadline : {new Date(individualListing.deadline).toLocaleDateString()}</p>
                </div>
            </div>
            
            {session?.user?.email === individualBid.userCreatedEmailId || session?.user?.email === individualListing.userCreatedEmailId ? 
            (<>
            <div className="mt-8">
                <div className="mt-4">
                <p className="font-bold">Seller:  <span className='font-bold text-sm tracking-tight'>{sellerData.name}</span></p>
                <p>Email  : {sellerData.email}</p>
                <p>Hostel : {sellerData.address}</p>
                <p>Contact: {sellerData.phoneNumber}</p>
                </div>

                <div className="mt-4">
                <p className="font-bold">Buyer:  <span className='font-bold text-sm tracking-tight'>{individualListing.soldToUserName}</span></p>
                <p>Email  : {individualBid.userCreatedEmailId}</p>
                <p>Hostel : {buyerData.address}</p>
                <p>Contact: {buyerData.phoneNumber}</p>
                </div>

        <Link href={`/profile/userProfile/${session?.user?.email}`}><Button className="mt-6">Back to Profile</Button></Link>
            </div>
            </>):
            
            (<>
             <p className="text-xl font-semibold my-5 text-red-600"> This item has been sold !</p>
        <p className="text-muted-foreground mt-3">Sold to : <span className="font-medium text-black ">{individualListing.soldToUserName}</span></p>
        {/* <p>({individualListing.soldToUserEmail})</p> */}
       
        <p className="text-muted-foreground mt-3">Seller : <span className="font-medium text-black ">{sellerData.name}</span></p>
        <p className="text-muted-foreground mt-3">Sold for (Rupees) : <span className="font-bold text-black ">{individualListing.sellingPrice}</span></p>
            <Link href="/"><Button className="mt-4">Check more items</Button></Link></>)}
            
        </div>
    </section></>):(<><div className="flex justify-center items-center h-screen"><Link href="/"><Button>Check more items</Button></Link></div></>)}
    {/* this bid is accepted. item sold . bid id : {bidId} */}
    
</div>


  )
}
