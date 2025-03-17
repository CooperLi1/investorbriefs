import NextAuth from 'next-auth';
import { authConfig } from '@/login/auth.config';

export default NextAuth(authConfig).auth;
 
console.log('middleware is running!')
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)', '/dashboard/:path*'],
  matcher: ["/dashboard/:path*"],
};
