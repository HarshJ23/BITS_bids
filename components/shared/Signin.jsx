'use client'
import * as React from "react";
import { useState } from "react";
// import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FcGoogle} from 'react-icons/fc'


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Signin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const isEmailValid = /^f\d{8}@hyderabad\.bits-pilani\.ac\.in$/.test(formData.email);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  // const session =useSession();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signIn('google');
    } catch (error) {
      toast.error(error.message);
      redirect('/signin');
      // router.push('/signin');

    }
  };

  
  const { data: session, status } = useSession();
  console.log(session);
  // const router = useRouter();

  useEffect(() => {
      if (session) {
        redirect('/register' ,'push');
        // router.push('/register');
      }
  }, [session]);




  return (
    <Card className="w-[350px] shadow-2xl">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>To continue on the website</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            </div>
          <Button
          className="mt-4 w-full" 
          onClick={(e) => {
            e.preventDefault();
            handleSignIn();
          }}>
            Sign in with Google
            <FcGoogle className="bg-white rounded-xl ml-3" size={20}/>
          </Button>
            {/* </Link> */}
        </form>
      </CardContent>
      {/* <p className="text-center mb-4 text-sm font-bold">OR</p>
      <CardFooter className="flex justify-between">
        <Link href="/register" className="w-full">
          <Button variant="outline" className="w-full bg-secondary hover:bg-primary hover:text-white">
            Register
          </Button>
        </Link> */}
      {/* </CardFooter> */}
    </Card>
  );
}
