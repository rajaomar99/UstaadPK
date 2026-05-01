import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { SignJWT } from 'jose';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        try {
          const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed.data),
          });

          if (!res.ok) return null;

          const responseData = await res.json();
          const user = responseData.data;
          
          if (!user) return null;

          return {
            id: user._id || user.id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On sign in, user object is populated — copy fields into JWT
      if (user) {
        token.sub  = user.id;
        (token as any).role = (user as any).role;
        token.name = user.name;
        token.email = user.email;
      }
      
      // Store a raw JWT string signed with AUTH_SECRET so the Express backend can verify it
      // Using 'jose' instead of 'jsonwebtoken' because 'jsonwebtoken' is not compatible with Next.js Edge runtime
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
      const rawToken = await new SignJWT({ 
        id: token.sub, 
        email: token.email, 
        role: (token as any).role, 
        name: token.name 
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret);
        
      (token as any).raw = rawToken;
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id          = token.sub as string;
        session.user.role        = (token as any).role as string;
        session.user.name        = token.name as string;
      }
      session.accessToken      = (token as any).raw as string;   // raw JWT string for Express calls
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error:  '/login',
  },

  session: {
    strategy: 'jwt'
  }
});
