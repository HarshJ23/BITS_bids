// // pages/auth-error.js

// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { redirect } from 'next/navigation'
// import { useEffect } from 'react';
// import { toast } from 'react-toastify';

// export default function AuthError() {
//   const router = useRouter();
//   const { error } = router.query;

//   useEffect(() => {
//     if (error) {
//       toast.error(error.replace(/%20/g, ' '));
//       router.push('/signin') // Redirect to home page after showing the toast
//     }
//   }, [error, router]);

//   return (
//     <div>
//       <h1>Authentication Error</h1>
//       <p>An error occurred during authentication. Please try again.</p>
//       <Link href="/signin">Go back to home</Link>
//     </div>
//   );
// }
