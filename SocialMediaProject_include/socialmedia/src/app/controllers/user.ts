import { NextRequest , NextResponse } from "next/server";
import asyncErrorHandler from "@/app/middleware/errorMiddleware";
import { userFollowService } from "../db/services/follow";
import { accountFetchingService ,profileSpecificDataService , profileUpdateService , profileDeletionService, blockingAccountService } from "@/app/db/services/user";

export const getUserAccountController = asyncErrorHandler(async (request:NextRequest) => {
    const reqUrl = new URL(request.nextUrl) ;
    const accountHandle = reqUrl.searchParams.get('handle'); // getting the handle from the URL...

    if (!accountHandle) {
        console.log('Account Handle is missing from client site !!');
        return NextResponse.json({message:'account handle missing...'},{status:400});
    }

    const data = await accountFetchingService(accountHandle); // getting the account details...

    return NextResponse.json({ message:'profile fetch successfull !!',accountData:data?.formatedOne , blocked:data?.isBlocked },{ status:200 });
})

export const getProfileSpecificDataController = asyncErrorHandler( async (request:NextRequest) => { 
    const { handle } = await request.json() ; // extracting the handle...
    if (!handle) {
        console.log('Account handle is REQUIRED !!');
        return NextResponse.json({message:'Account handle unavailable...'},{ status:404 });
    }

    const comingData = await profileSpecificDataService(handle) ; // task intensive function...

    return NextResponse.json({message:'specific data fetched...' , Infos:comingData},{ status:200 });
})

export const triggerFollowToggleController = asyncErrorHandler( async (request:NextRequest) => { 
    const requestUrl = new URL(request.nextUrl) ; // making a url instance...
    // getting the url encoded feilds...
    const accounthandle = requestUrl.searchParams.get('accounthandle');
    const follow = Boolean(requestUrl.searchParams.get('follow'));

    if (!accounthandle || !follow) {
        console.log('Any of neccessary credentials missing...');
        return NextResponse.json({message:'credentials missing !!'},{ status:400 }) ;
    }
    
    // await userFollowService(accounthandle,follow) ; // calling DB service...
    return NextResponse.json({message:'action performed successfully...' },{ status:200 });
})

export const userProfileUpdationController = asyncErrorHandler( async (request:NextRequest) => { 
    const { updatedData } = await request.json() ; // getting updating data...
    if (!updatedData) {
        console.log('updated data missing...');
        return NextResponse.json({ message:'updated data missing !!' }, { status:200 });
    }

    // await profileUpdateService(updatedData); // calling DB service function...
    return NextResponse.json({message:'action performed successfully...' },{ status:200 });
})

export const userProfileDeletioncontroller = asyncErrorHandler( async (request:NextRequest) => { 
       const requestUrl = new URL(request.nextUrl) ; // making a url instance...
    // getting the url encoded feilds...
    const profilehandle = requestUrl.searchParams.get('profileHandle');
    if (!profilehandle) {
        console.log('Account handle is REQUIRED !!');
        return NextResponse.json({message:'Account handle unavailable...'},{ status:404 });
    }

    // profileDeletionService(profilehandle) ; // DB service...
    return NextResponse.json({message:'Account deleted successfully !!'},{ status:200 });

})

export const BlockPaticularAccountController = asyncErrorHandler( async (request:NextRequest) => { 
    const { handle , isBlock } = await request.json() ; // getting account handle...

    if (!handle) {
        console.log('Account handle is REQUIRED !!');
        return NextResponse.json({message:'Account handle unavailable...'},{ status:404 });
    }

    await blockingAccountService(handle,isBlock) ; // triggering the service function...
    return NextResponse.json({message:'account successfully blocked...'},{ status:200 });

})