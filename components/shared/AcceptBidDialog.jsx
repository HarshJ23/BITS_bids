import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
  import toast from "react-hot-toast";
  import { useRouter } from "next/navigation";
  
  export function AcceptBidDialog({bidData}) {

    const router = useRouter();

    const handleSendPostRequest = async () => {
        try {
            const response = await fetch( `https://bitsbids.azurewebsites.net/api/product/sellProduct?buyerEmail=${bidData.userCreatedEmailId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Baby' : '123'
                },
                body: JSON.stringify(bidData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Success:', data);
            toast.success('Bid accepted! Item Sold !');
            router.push(`/checkout/${bidData.id}`);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error accepting bid: ' + error.message);
        }
    };

    return (
      <AlertDialog >
        <AlertDialogTrigger asChild>
          <Button className="mt-6 justify-center">Accept this Bid</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will mean that you are selling this product and item will be removed from the website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendPostRequest}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  

//   `https://bitsbids.azurewebsites.net/api/product/sellProduct?buyerEmail=${bidData.userCreatedEmailId}`