import { NextRequest } from 'next/server';
import { registerUserController } from '@/app/controllers/user';

// POST request handler for user registeration...
export const POST = (request:NextRequest) => {
    registerUserController(request);
};
