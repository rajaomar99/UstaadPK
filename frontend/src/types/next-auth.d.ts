import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      role: string;
      name: string;
      email: string;
    } & DefaultSession['user'];
  }
}
