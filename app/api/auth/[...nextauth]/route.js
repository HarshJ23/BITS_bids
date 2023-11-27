import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
// import { redirect } from 'next/navigation'
// import { useRouter } from "next/navigation"


// const router = useRouter();

const handler = NextAuth({
  providers:[
    GoogleProvider({
        clientId:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        // authorize: async (profile) => {
        //     const { email } = profile;
        //     if (email.endsWith('@hyderabad.bits-pilani.ac.in')) {
        //       return Promise.resolve(profile);
        //     } else {
        //       return Promise.reject(new Error('Invalid email domain'));
        //     }
        //   }
    })
  ],
  callbacks: {
    async signIn({user, account, profile }) {
      if (account.provider === "google") {
        if (profile.email_verified && profile.email.endsWith("@hyderabad.bits-pilani.ac.in")) {
          return true;
        } else {
          // throw new Error('Invalid email domain or email not verified');
          // router.push('/signin');
          return Promise.reject('/auth-error?error=Invalid email domain or email not verified');
          // window.location.href = '/auth-error?error=Invalid email domain or email not verified';
        }
      }
      return true;
    },
    async jwt({token,account,profile}){
      if (account?.access_token) {
        token.accessToken = account.access_token
        token.id = profile.id;
      }
      return token;
    },

    async session({ session, token , user }) {
      // Pass the ID token to the session object
      
        session.accessToken = token.access_token
        session.user.id = token.id
      
      return session;
    },
  }
 
})

export { handler as GET, handler as POST }