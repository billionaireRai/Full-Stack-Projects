import asyncErrorHandler from "../middleware/errorMiddleware";
import { getAccountFollowersService, getAllTheFollowingService, getFollowerSuggestionsService , getFollowingsSuggestionsService , getAccountFollowingsService , getFollowingsForAccountService } from "../db/services/follow";
import { NextRequest , NextResponse } from "next/server";

export const getAllTheFollowingsController = asyncErrorHandler( async (request:NextRequest) => { 
    const url = new URL(request.nextUrl) ;
    const handle = url.searchParams.get('handle') ; // getting the handle...
    const page = Number(url.searchParams.get('page')) ; // page sent from client
    const size = Number(url.searchParams.get('size')) ; // page size sent from client

    if (!handle || !page || !size) {
        console.log('Pagination data missing !!');
        return NextResponse.json({ message:'Check pagination data !!'},{ status:400 }) ;
    }

    return await getAllTheFollowingService(handle,page,size);
})

export const getAccountFollowersController = asyncErrorHandler(async (request:NextRequest) => {
    const { handle , size , page } = await request.json() ; // getting variables...

    if (!handle || !size || !page) {
        console.log('Pagination data missing !!');
        return NextResponse.json({ message:'Check pagination data !!'},{ status:400 }) ;
    }

    return await getAccountFollowersService(handle,page,size);
})

export const getFollowersSuggestionsController = asyncErrorHandler(async (request:NextRequest) => {
    const url = new URL(request.url); // formating url structure...
    const handle = url.searchParams.get('handle');

    if (!handle) {
        console.log('Handle is required for followings...');
        return NextResponse.json({ message:'Handle missing !!'},{ status:400 }) ;
    }
    
    return await getFollowerSuggestionsService(handle);
})

export const getFollowingsSuggestionsController = asyncErrorHandler(async (request:NextRequest) => {
    const url = new URL(request.url); // formating url structure...
    const handle = url.searchParams.get('handle');

    if (!handle) {
        console.log('Handle is required for followings suggestions...');
        return NextResponse.json({ message:'Handle missing !!'},{ status:400 }) ;
    }
    
    return await getFollowingsSuggestionsService(handle);
})

export const getAccountFollowingsController = asyncErrorHandler(async (request:NextRequest) => {
    const { handle , size , page } = await request.json() ; // getting variables...

    if (!handle || !size || !page) {
        console.log('Pagination data missing !!');
        return NextResponse.json({ message:'Check pagination data !!'},{ status:400 }) ;
    }

    return await getAccountFollowingsService(handle,page,size);
})

export const getAccountFollowingsUnpaginatedController = asyncErrorHandler(async (request:NextRequest) => {
    const url = new URL(request.nextUrl) ; // formating url structure...
    const handle = url.searchParams.get('handle') ; // getting the handle from the query params...

    if (!handle) {
        console.log('Handle is required for fetching all the followings !!');
        return NextResponse.json({ message:'Handle missing !!'},{ status:400 }) ;
    }

    return await getFollowingsForAccountService(handle);
})

