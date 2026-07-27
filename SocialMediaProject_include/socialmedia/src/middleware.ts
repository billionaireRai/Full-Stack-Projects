import authMiddleware from '@/app/middleware/authMiddleware';
export default authMiddleware;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
