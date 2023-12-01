'use client'
import BidForm from "@/components/shared/BidForm";
import Image from "next/image"
import { useEffect , useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { useSession } from 'next-auth/react'
import BidTable from "@/components/shared/BidTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ChatModal from "@/components/shared/ChatModal";



export default function page({params}) {

    const [individualListing, setIndividualListing] = useState({
        id: null,
        userCreatedEmailId: '',
        photosUrls: '',
        name: '',
        price: 0.0,
        sellingPrice : 0.0,
        createdOn: '',
        deadline: '',
        quantity: 1,
        details: '',
        isSold: 0,
        soldDate: '',
        soldToUserName: '',
        soldToUserEmail:'',
        bidsOnThisProduct: [],
        // photoUrlsOnThisProduct: []
        finalBidId : null

      });

      const [userData, setUserData] = useState({
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
      const { data: session, status } = useSession();

      const [highestBid, setHighestBid] = useState(0);

    useEffect(()=>{
      const getListingbyId = async ()=>{
            try {
              const response = await fetch(`https://bitsbids.azurewebsites.net/api/product/${params.id}`,{
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
      },[params.id]);

      useEffect(()=>{
        console.log(individualListing);
      },[individualListing]);


      useEffect(()=>{
        const getUser = async ()=>{
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
                  const getUserData = await response.json();
                  setUserData(getUserData);
                  console.log(userData);
            } catch (error) {
                console.error('Error fetching data:', error)
          }
        }
    getUser();
    },[individualListing.userCreatedEmailId]);
    

    // for getting bids and sorting highest bid 
    //gpt code
    useEffect(() => {
      const fetchBids = async () => {
          try {
              const response = await fetch(`https://bitsbids.azurewebsites.net/api/bid/getBidsOnProduct?productId=${params.id}` ,{
                headers:{
                  "Baby" : "123",
                }
              });
              if (!response.ok) {
                  throw new Error('Failed to fetch bids');
              }
              const bidsData = await response.json();
              if (bidsData && bidsData.length > 0) {
                  const maxBid = Math.max(...bidsData.map(bid => bid.priceOfBid));
                  setHighestBid(maxBid);
              }
          } catch (error) {
              console.error('Error while fetching bids', error);
          }
      };
  fetchBids();
  }, [params.id]);


  //chatModal handling 
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChatModal = () => setIsChatOpen(!isChatOpen);
  
  //shouldShowChat logic different for /bid/contact and /product/[id] page.
  const shouldShowChat = session?.user ? true : false;

  return (
    <div>
      {/* <p>This product has id : {params.id}</p> */}
<Navbar/>
        <section className='grid grid-cols-1 gap-7 sm:grid-cols-3 my-4 mx-4'>
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
            <h1 className='font-bold text-4xl tracking-tight '>{individualListing.name}</h1>
            <p className="text-xl mt-3">{individualListing.details}</p>

            {/* price and bid subsection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 items-center">
                <div className="flex flex-row gap-6">
                    <div className="flex flex-col">
                        <p className="text-xl mt-3">Asking Price:</p>
                        <h1 className='font-bold text-4xl tracking-tight'>{individualListing.price}</h1>
                    </div>

                    <div className="flex flex-col">
                      {!individualListing.isSold ? (<> <p className="text-xl mt-3">Highest Bid Placed:</p>
                        <h1 className='font-bold text-4xl tracking-tight'>{highestBid}</h1></>):(<> <p className="text-xl mt-3">Sold for:</p>
                        <h1 className='font-bold text-4xl tracking-tight'>{individualListing.sellingPrice}</h1></>)}
                       
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <p>Listed on : {new Date(individualListing.createdOn).toLocaleDateString()}</p>
                    <p className="text-red-500">Bid deadline : {new Date(individualListing.deadline).toLocaleDateString()}</p>
                </div>

                {
    !individualListing.isSold ? (
        individualListing.userCreatedEmailId === session?.user?.email ? (
            <BidTable bids={individualListing.bidsOnThisProduct}/>
        ) : (
            <BidForm productId={params.id} askingPrice={individualListing.price}/>
        )
    ) : (
      <>
      <div className="justify-center items-center mt-12">
        <p className="text-xl font-semibold my-5 text-red-600"> This item has been sold !</p>
        <p className="text-muted-foreground mt-3">Sold to : <span className="font-medium text-black ">{individualListing.soldToUserName}</span></p>
        {/* <p>({individualListing.soldToUserEmail})</p> */}
       
        <p className="text-muted-foreground mt-3">Seller : <span className="font-medium text-black ">{userData.name}</span></p>
        <p className="text-muted-foreground mt-3">Sold for (Rupees) : <span className="font-bold text-black ">{individualListing.sellingPrice}</span></p>
        
        {
    (session && (session?.user?.email === individualListing.userCreatedEmailId || individualListing.soldToUserEmail)) ? (
        <Link href={`/checkout/${individualListing.finalBidId}`}>
            <Button className="mt-4">Check more Details</Button>
        </Link>
    ) : (
        <Link href="/">
            <Button className="mt-4">Check more items</Button>
        </Link>
    )
}      </div>
      </>
    )
}
                
            </div>
            </div>

            {/* {shouldShowChat && (
            <>
                <div className="flex flex-row gap-4 m-8">
                    <Button onClick={toggleChatModal}>Chat </Button>
                </div>
            </>
        )}   */}
    </section>

{/* {isChatOpen && shouldShowChat && (
    <ChatModal isChatOpen={isChatOpen} toggleChatModal={toggleChatModal} sellerEmail={individualListing.userCreatedEmailId} buyerEmail={session?.user?.email} productId={params.id} isSold={individualListing.isSold}/>
)}     */}
        

    </div>
  )
}


// {new Date(date).toLocaleDateString()}
// {individualListing.createdOn}