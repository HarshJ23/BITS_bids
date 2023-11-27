import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';


export default function BidForm({ productId }) {
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
            const response = await fetch('https://bitsbids.azurewebsites.net/api/bid/createBid', {
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
                                className="flex-1" 
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                disabled={isBidPlaced} // Disable input if bid is placed
                            />
                            <Button 
                                type="submit" 
                                className="px-4 py-2" 
                                disabled={isBidPlaced} // Disable button if bid is placed
                            >
                                Submit bid
                            </Button>
                        </form>
                    </CardContent>
                </>
            ) : (
                <>
                    <CardContent>
                        <CardTitle className="">Please Sign in to check the item</CardTitle>
                    </CardContent> 
                </>
            )}
        </Card>
    );
}
