// import Image from 'next/image';
'use client'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect , useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import { ItemCard } from '@/components/shared/ItemCard';
// import { useEffect } from 'react';
import CardLoader from '@/components/shared/CardLoader'
import { useSession } from 'next-auth/react'





export default function Home() {

 const [allProducts, setAllProducts] = useState([]);
 const [isLoading, setIsLoading] = useState(false);
 const { data: session } = useSession();



  useEffect(()=>{
    const getListings = async ()=>{
      setIsLoading(true); 

        try {
            const response = await fetch(`https://bitsbids.azurewebsites.net/api/product/getAllUnsoldProducts` , {
                method : 'GET',
                headers:{
                    'Baby' : '123',
                }
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              const getUserData = await response.json();
              setAllProducts(getUserData);
              console.log(getUserData);
        } catch (error) {
            console.error('Error fetching data:', error)
      }
      setIsLoading(false); 

    }
getListings();
},[]);


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
 <main className="flex justify-center px-4">

 {isLoading ? (
                    <CardLoader />
                ) : (
                  <section className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-8 md:gap-6 sm:gap-4 w-full max-w-7xl ">

                  {allProducts.length>0 && (
                  
                    allProducts.map((item)=>(
                  <Link key={item.id} href={`/listings/product/${item.id}`}><ItemCard itemName={item.name} date={item.deadline} price={item.price} img={item.photosUrls}/></Link>
                    )))}
                          {/* <ItemCard/>
                          <ItemCard/>
                          <ItemCard/>
                          <ItemCard/> */}
                        </section>
                )}


        </main>
    </>
  );
}
