'use client'
import * as React from "react";
import { useState , useEffect } from "react";
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
import { storage } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signIn, signOut, useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast';
import { redirect } from "next/navigation";
// import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for the toast
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";





export default function CreateListing() {
  const router = useRouter();
  const { data: session } = useSession();
  const initialFormData = {
    name: "",
    details: "",
    price: "",
    deadline: "",
    photos: [] // To store image file references
  };
  const [formData, setFormData] = useState(initialFormData); 
  const [userEmail , setUserEmail] =  useState(); 
  const [isLoading , setIsLoading ] = useState(false);
  
  const isFormValid =
  formData.name &&
  formData.details &&
  formData.price &&
  formData.deadline;

  useEffect(() => {
    if (session) {
       setUserEmail(session.user.email);
        // console.log(formData.email);
    }
    if (!session) {
      toast.error('You must be signed in to access the register page.');
      redirect('/signin' , 'replace');
      // router.replace('/signin');
  }
}, [session]);
  
  // const useremailId = userEmail;

    const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photos") {
      setFormData({
        ...formData,
        photos: files
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  

    // Handle image upload to Firebase
    const handleImageUpload = async (images) => {
      setIsLoading(true);
      const uploadedImageUrls = [];
      for (const image of images) {
        try {
          const storageRef = ref(storage, `images/${image.name}`);
          const uploadTaskSnapshot = await uploadBytes(storageRef, image);
          const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
          uploadedImageUrls.push(downloadURL);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
       setIsLoading(false);
      return uploadedImageUrls;
    };

    // submit handler 
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const imageUrls = await handleImageUpload(formData.photos);
  
      const dataToSend = {
        userCreatedEmailId: userEmail, // Replace with actual email if available
        photosUrls: imageUrls.join(','), // Convert array of URLs to a comma-separated string
        name: formData.name,
        price: parseFloat(formData.price), // Ensure price is a number
        sellingPrice : 0,
        createdOn: new Date().toISOString(), // Set the current date in ISO format
        deadline: formData.deadline,
        quantity: 1, // Default quantity, modify as needed
        details: formData.details,
        isSold: 0, // Default value, update based on your logic
        soldDate: "", // Empty or set based on your logic
        soldToUserName: "", // Empty or set based on your logic
        soldToUserEmail:"",
        bidsOnThisProduct: [],
        finalBid : null, // Empty array or populate as needed
      };
      console.log('Sending data:', dataToSend);
      
      try {
        const response = await fetch('https://bitsbids.azurewebsites.net/api/product/createProduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Baby' : '123'
          },
          body: JSON.stringify(dataToSend),
        });
        if (response.ok) {
          toast.success('Voila! Item listed !')
          router.push(`/profile/userProfile/${userEmail}`);        
          // You can redirect or do other actions here if needed
        } 
        if (!response.ok) {
          toast.error('unexpected error,please try again');
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const responseData = await response.json();
        console.log('Response from backend:', responseData);
  
      } catch (error) {
        console.error('Error submitting form:', error);
      }
      setIsLoading(false);
    };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 shadow-2xl mx-4">
      <Card className="w-full sm:w-2/3 lg:w-1/2 my-8">
        <CardHeader>
          <CardTitle>Create Listing</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Fill in the details to create a new listing.
          </p>
        </CardHeader>
        <CardContent>
        {isLoading && <LoadingSpinner />}
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Item Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="details">Item Description</Label>
                <Input
                  id="details"
                  name="details"
                  placeholder="Item Description"
                  value={formData.details}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="price">Item Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Item Price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="deadline">Set Bid Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
              <Label htmlFor="photos">Add Item Images</Label>
                <Input
                  id="photos"
                  name="photos"
                  type="file"
                  onChange={handleInputChange}
                  multiple
                />
              </div>
            </div>
            <Button className="mt-4 w-full" disabled={!isFormValid || isLoading}>
              Create Listing
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-center mb-4 text-sm font-bold">OR</p>
  
          <Link 
          href={`/profile/userProfile/${userEmail}`} 
          className="w-full">
          <Button variant="outline" className="w-full bg-secondary hover:bg-primary hover:text-white">
            Back to Profile.
          </Button>
        </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
