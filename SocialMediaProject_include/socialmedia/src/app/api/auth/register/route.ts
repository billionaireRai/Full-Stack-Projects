import { NextRequest, NextResponse } from 'next/server';
import { registerUserController } from '@/app/controllers/auth';

// POST request handler for user registeration...
export const POST = (request:NextRequest) : Promise<NextResponse> => {
    return registerUserController(request);
};
