import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { SignJWT } from 'jose';

const loginSchema = z.object({
  email: z.email(),
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
      // Only runs on sign-in: copy user fields into the JWT and create the raw token
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role;
        token.name = user.name;
        token.email = user.email;

        // Create a raw JWT signed with AUTH_SECRET — Express uses this to verify API requests.
        // We only do this ONCE at login and store it in the token. Subsequent requests reuse it.
        // Using 'jose' because 'jsonwebtoken' is not Edge-runtime compatible.
        const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
        token.raw = await new SignJWT({
          id: user.id,
          email: user.email,
          role: (user as any).role,
          name: user.name,
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime('30d')
          .sign(secret);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id          = token.sub as string;
        session.user.role        = token.role as string;
        session.user.name        = token.name as string;
      }
      session.accessToken      = token.raw as string;   // raw JWT string for Express calls
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
