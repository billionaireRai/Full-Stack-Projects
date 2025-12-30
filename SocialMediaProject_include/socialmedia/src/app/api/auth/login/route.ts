import { NextRequest, NextResponse } from 'next/server';
import { logginUserController } from '@/app/controllers/auth';

// POST request handler for user registeration...
export const POST = (request:NextRequest) : Promise<NextResponse> => {
    return logginUserController(request);
};
