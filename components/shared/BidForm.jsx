import React, { useState , useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';


export default function BidForm({ productId , askingPrice }) {
    const { data: session } = useSession();
    const [bidAmount, setBidAmount] = useState('');
    const [isBidPlaced, setIsBidPlaced] = useState(false); // New state to track bid status
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            userCreatedEmailId: session?.user?.email,
            forWhichProductId: productId,
            priceOfBid: parseFloat(bidAmount),
            timestamp: new Date().toISOString(),
        };

        try {
            const response = await fetch('https://bitsbid.azurewebsites.net/api/bid/createBid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Baby' : '123'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Bid placed successfully!');
                setIsBidPlaced(true); // Update the state to indicate the bid was placed
                router.push(`/profile/userProfile/${session?.user?.email}`)
            } else {
                toast.error(`Bid failed: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };


    useEffect(() => {
        if (askingPrice) {
          setBidAmount(askingPrice);
        }
      }, [askingPrice]);

    return (
        <Card className="w-[500px] h-full mx-auto mt-16 flex justify-center items-center bg-secondary">
            {session ? (
                <>
                    <CardContent>
                        <CardTitle>Place your Bid!</CardTitle>
                    </CardContent>
                    <CardContent className="flex justify-center items-center w-full">
                        <form className="flex justify-center items-center space-x-4" onSubmit={onSubmit}>
                        <Input 
                            type="number" 
                            placeholder="Place your Bid" 
                            className="flex-1 transition ease-linear" 
                            value={bidAmount}
                            onChange={(e) => {
                              // Allow any value to be entered, but remove negative signs
                              e.target.value = e.target.value.replace(/^-/, '');
                              setBidAmount(e.target.value);
                            }}
                            onBlur={() => {
                              // If the user leaves the input with a value below the askingPrice, update it to the askingPrice
                              if (parseFloat(bidAmount) < askingPrice) {
                                setBidAmount(askingPrice);
                              }
                             }}
                             disabled={isBidPlaced}
                             min={askingPrice}
                        />
                            <Button 
                                type="submit" 
                                className="px-4 py-2" 
                                disabled={isBidPlaced}>
                                Submit bid
                            </Button>
                            
                        </form>
                    </CardContent>
                </>
            ) : (
                <>
                    <div className="w-2/3">
                        <h1 className=" font-semibold text-sm md:text-base lg:text-2xl">Please Sign in to continue with the item</h1>
                    </div> 
                </>
            )}
        </Card>
    );
}
