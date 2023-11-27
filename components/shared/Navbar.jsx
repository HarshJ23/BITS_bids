'use client';
import Link from "next/link";
import { useEffect , useState } from "react";
import { Button } from "../ui/button";
import { useSession } from 'next-auth/react'



const Navbar = ({ onSearch }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const { data: session } = useSession();



  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.toggle('hidden');
    }
  };



  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    if (onSearch) {
      onSearch(searchTerm);
    }
    handleSearch(searchTerm); // Call handleSearch with the updated search term
  };


  useEffect(()=>{
    const getListings = async ()=>{
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
    }
getListings();
},[]);
    
const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === '') {
      // Clear the filtered items if the search term is empty
      setFilteredItems([]);
    } else {
      // Filter products that include the search term
      const filteredProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filteredProducts);
    }
  };


  const handleItemClick = (item) => {
    // Set the search bar value to the clicked item
    document.querySelector('input[name="search"]').value = item.name;
    // Clear the filtered items
    setFilteredItems([]);
    // Perform the search with the selected item
    onSearch(item.name);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-1000">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Website Logo */}
          <Link href="/" className="flex items-center py-4 px-2">
            <span className="font-semibold text-primary text-2xl hover:bg-slate-100 rounded-md p-2">BITS_bids</span>
          </Link>
{/* Searchbar */}
<div className="flex-grow md:flex md:items-center md:justify-center hidden relative">
  <input className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
    type="search" name="search" placeholder="Search"
    onChange={handleSearchChange} />

  {filteredItems.length > 0 && (
    <u className="absolute z-10 top-full list-none mt-1 no-underline bg-white w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
      {filteredItems.map((item) => (
       
       // <Link  key={item.id} onClick={() => handleItemClick(item)} className="p-2 hover:bg-gray-100 cursor-pointer">
       //     <p>{item.name}</p></Link>
      
       <li  className="p-2 hover:bg-gray-100 cursor-pointer no-underline"  href={`/listings/product/${item.id}`} >
           <Link key={item.id}
               onClick={() => handleItemClick(item)} href={`/listings/product/${item.id}`}>
               <p className="no-underline"> {item.name}</p>
         </Link>
       </li>
   ))}
    </u>
            
  )}
</div>

 {/* Buttons */}
 <div className="flex items-center space-x-4">
        {/* Sell Items Button */}
        <Link href={'/signin'} className=" hover:bg-slate-100 rounded-md p-2 hover:text-primary">
            <p className="font-semibold ">Sell Items</p>
          
        </Link>


        {session ? 
        (
          <Link href={`/profile/userProfile/${session.user.email}`} className=" hover:bg-slate-100 rounded-md p-2 hover:text-primary">
             <p className="font-semibold hover:text-primary ">Profile</p>
          </Link>
        ) : (
          <Link href={'/signin'} className=" hover:bg-slate-100 rounded-md p-2 hover:text-primary">
           <p className="font-semibold hover:text-primary">Sign In</p>
          </Link>
        )}
      </div>


          {/* Primary Navbar items */}
          {/* ... existing code ... */}
        </div>

       {/* Searchbar - visible on small screens */}
<div className="mt-2 mb-2 flex justify-center md:hidden relative">
  <input className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
    type="search" name="search" placeholder="Search"
    onChange={handleSearchChange} />

  {filteredItems.length > 0 && (
    <ul className="absolute z-500 top-full mt-1 bg-white w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
      {filteredItems.map((item) => (
        <li key={item.id} className="p-2 hover:bg-gray-100 cursor-pointer">
          <Link
            onClick={() => handleItemClick(item)}
            href={`/listings/product/${item.id}`}
          >
            <p> {item.name}</p>
          </Link>
        </li>
      ))}
    </ul>
  )}
</div>


        {/* Mobile menu */}
        {/* ... existing code ... */}
      </div>
    </nav>
  );
};

export default Navbar;
