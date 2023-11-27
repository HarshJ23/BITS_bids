'use client'
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect , useState } from "react";
import { signIn, signOut, useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast';
import { redirect } from 'next/navigation';
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";




export default function page({params}) {
    
    const { data: session } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState({
        id: null,
        name: '',
        email: '',
        address: '',
        phoneNumber: '',
        moneyLeft: 0,
        itemsPurchased: [],
        itemsListed: [],
        visibleTo: [],
        itemsSold: [],
        currentBids: [],
        pastBids: '',
        moneySpent: 0,
        password: ''
      });

    const [isLoading, setIsLoading] = useState(false); // State to track loading
    const email = decodeURIComponent(params.id); // decodes email from the dynamic route-Next.js 

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUserData({
        ...userData,
        [name]: value,
      });
    };

    useEffect(() => {
        if (!session) {
          toast.error('You must be signed in to access the register page.');
          redirect('/signin' , 'replace');
          // router.replace('/signin');
        }
    }, [session]);


    //to fetch userData from email on this page 
useEffect(()=>{
    const getUser = async ()=>{
        try {
            const response = await fetch(`https://bitsbids.azurewebsites.net/api/users/getUserFromEmail?email=${email}` , {
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
              console.log(getUserData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
  getUser();
},[email]);


// editProfile handler 
const editProfileHandler= async (e)=>{
  e.preventDefault();
  setIsLoading(true); // Start loading
  try {
    const response = await fetch('https://bitsbids.azurewebsites.net/api/users/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Baby' : '123'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('Profile edited!');
      router.push(`/profile/userProfile/${userData.email}`);        
      // You can redirect or do other actions here if needed
    } else {
      toast.error('Edit failed');
    }
  } catch (error) {
    toast.error(`Error: ${error.message}`);
    console.log(error);
  }
  setIsLoading(false);
}


  return (
   
    //  <p>

    //      email : {params.id}
    //  </p>
   

    <div className="flex justify-center items-center min-h-screen bg-gray-100 shadow-2xl mx-4 ">
    <Card className="w-full sm:w-2/3 lg:w-1/2 my-8">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Edit your profile and save the changes</p>
      </CardHeader>
      <CardContent>

        <form  onSubmit={editProfileHandler} >
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Full Name"
                value={userData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Email"
                disabled
                value={userData.email}
                // onChange={handleInputChange}
                // className={
                //   /^f\d{8}@hyderabad\.bits-pilani\.ac\.in$/.test(formData.email)
                //     ? ""
                //     : "border-red-500"
                // }
              />
              {/* {!/^f\d{8}@hyderabad\.bits-pilani\.ac\.in$/.test(formData.email) && (
                <p className="text-red-500 text-sm">
                  Enter a valid BITS email (e.g., f20212358@hyderabad.bits-pilani.ac.in)
                </p>
              )} */}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phoneNumber">Contact Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Contact Number"
                value={userData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="address">Hostel name with room no.</Label>
              <Input
                id="address"
                name="address"
                placeholder="Hostel name-room no."
                value={userData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button className="mt-4 w-full" 
        //   disabled={!isFormValid} 
          type="submit">
            Save Changes
          </Button>
        </form>

      </CardContent>
      <CardFooter className="flex flex-col items-center">
      <p className="text-center mb-4 text-sm font-bold">OR</p>
      <Link href={`/profile/userProfile/${email}`} className="w-full"><Button className="w-full">Back to Profile</Button></Link>

      {/* {session ? (
                      <Button  onClick={() => signOut({ callbackUrl: '/' })} className="mb-4 w-full">
                          Logout
                      </Button>
                  ) : (
                      <Link href="/signin" className="w-full">
                          <Button variant="outline" className="w-full bg-secondary hover:bg-primary hover:text-white">
                              Sign In
                          </Button>
                      </Link>
                  )} */}
      </CardFooter>
    </Card>
    {isLoading && <LoadingSpinner />} {/* Show spinner when loading */}
  </div>
  )
}
