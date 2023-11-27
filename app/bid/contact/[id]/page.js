'use client'
import Navbar from "@/components/shared/Navbar"
import { useEffect , useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ChatModal from "@/components/shared/ChatModal";
import { AcceptBidDialog } from "@/components/shared/AcceptBidDialog";
import Link from "next/link";

export default function page({params}) {
    let bidId = params.id;
    const [individualBid , setIndividualBid] = useState({
        id: null,
        userCreatedEmailId: '',
        forWhichProductId: null,
        priceOfBid: 0.0,
        timestamp: '',
        isExpired: 0
    });

    const [individualProduct , setIndividualProduct] = useState({
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
        photoUrlsOnThisProduct: [],
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

    const [isChatOpen, setIsChatOpen] = useState(false);
    const toggleChatModal = () => setIsChatOpen(!isChatOpen);

    //for fetching the bid details
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


//to get productfrom ID , id fetched from bid details
useEffect(() => {
    const getProductDetails = async () => {
        if (individualBid.forWhichProductId) {
            try {
                const response = await fetch(`https://bitsbids.azurewebsites.net/api/product/${individualBid.forWhichProductId}`, {
                    method: 'GET',
                    headers: {
                        'Baby': '123'
                    }
                });
                if (!response.ok) {
                    throw new Error('Error occurred');
                }
                const productDetail = await response.json();
                setIndividualProduct(productDetail);
            } catch (error) {
                console.error('Error while fetching product data', error);
            }
        }
    };
    getProductDetails();
}, [individualBid.forWhichProductId]); 



useEffect(()=>{
    const getUser = async ()=>{
        try {
            const response = await fetch(`https://bitsbids.azurewebsites.net/api/users/getUserFromEmail?email=${individualProduct.userCreatedEmailId}` , {
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
},[individualProduct.userCreatedEmailId]);

return (
    <div>
        <Navbar/>
      {/* <p>The seller will chat with buyer who had bidded for this product. bid id : {bidId}</p> */}
      <section className='grid grid-cols-1 gap-7 sm:grid-cols-3 my-4 mx-4'>
            <div>
            <Image
            src={individualProduct.photosUrls}
            width={400}
            height={400}
            alt="Picture of the author"
            className="object-cover h-80 w-80 mx-4 my-4 rounded-lg"
            />
            </div>

            <div className='col-span-2 mx-3'>
            <h1 className='font-bold text-4xl tracking-tight '>{individualProduct.name}</h1>
            <p className="text-xl mt-3">{individualProduct.details}</p>

            {/* price and bid subsection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 items-center">
                <div className="flex flex-row gap-6">
                    <div className="flex flex-col">
                        <p className="text-xl mt-3">Asking Price:</p>
                        <h1 className='font-bold text-4xl tracking-tight'>{individualProduct.price}</h1>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-xl mt-3">This Bid:</p>
                        <h1 className='font-bold text-4xl tracking-tight'>{individualBid.priceOfBid}</h1>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <p>Listed on : {individualProduct.createdOn}</p>
                    <p className="text-red-500">Bid deadline : {individualProduct.deadline}</p>
                </div>
                {!individualProduct.isSold ? (<AcceptBidDialog bidData={individualBid}/>):( <>
      <div className="justify-center items-center mt-12">
        <p className="text-xl font-semibold my-5"> This item has been sold</p>
        <p className="text-muted-foreground mt-3">Sold to : <span className="font-medium text-black ">{individualProduct.soldToUserName}</span></p>
        {/* <p>({individualListing.soldToUserEmail})</p> */}
       
        <p className="text-muted-foreground mt-3">Seller : <span className="font-medium text-black ">{userData.name}</span></p>
        <p className="text-muted-foreground mt-3">Sold for (Rupees) : <span className="font-bold text-black ">{individualProduct.sellingPrice}</span></p>
        

      </div>
      </>)}
                   
                {/* {individualProduct.userCreatedEmailId == session?.user?.email ? ( <BidTable bids={individualProduct.bidsOnThisProduct}/>)  : (<BidForm productId={params.id}/>)} */}
                
            </div>
            </div>
        </section>

<div className="flex flex-row gap-4 m-8">
<Button onClick={toggleChatModal}>Chat with bidder</Button>

<Link href={`/listings/product/${individualProduct.id}`}><Button variant="outline" className="hover:bg-primary hover:text-white">Back to Product</Button></Link>
</div>
<ChatModal isChatOpen={isChatOpen} toggleChatModal={toggleChatModal} />
                
    </div>
  )
}
