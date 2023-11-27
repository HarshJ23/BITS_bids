'use client'
import React from 'react';
import { Signin } from '@/components/shared/Signin';
import Navbar from '@/components/shared/Navbar';
import { useEffect, useRef } from 'react';

export default function Page() {

  let allProducts = [];

  // Fetch products on component mount
  useEffect(() => {
    fetch('https://bitsbids.azurewebsites.net/api/product/getAllProducts',{
      headers:{
        'Baby' : '123'
      }
    })
      .then(response => response.json())
      .then(data => {
        allProducts = data;
      })
      .catch(error => console.error('Error fetching products:', error));
    }, []);
    console.log(allProducts);
    
  // Function to handle search
  const handleSearch = (searchTerm) => {
    searchTerm = searchTerm.toLowerCase();
    const filteredProducts = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );

    // Display these products as per your UI design
    console.log(filteredProducts); // Replace this with your UI rendering logic
  };

  return (
    <>
    <Navbar onSearch={handleSearch}/>
    <main className='flex flex-col md:flex-row justify-evenly items-center h-screen'>

      <section className='flex flex-col items-center'>
        <h1 className='text-6xl font-bold'>Buy n Sell on</h1>
        <h1 className='text-6xl font-bold text-primary'>BITS_Bids</h1>
      </section>

      <section className='my-auto'>
        <Signin />
      </section>
    </main>
    </>
  );
}
