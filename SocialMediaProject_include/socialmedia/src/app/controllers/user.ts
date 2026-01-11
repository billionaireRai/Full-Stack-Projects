import { NextRequest , NextResponse } from "next/server";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { accountFetchingService } from "../db/services/user";

export const getUserAccountController = asyncErrorHandler(async (request:NextRequest) => {
    const reqUrl = new URL(request.nextUrl) ;
    const accountHandle = reqUrl.searchParams.get('handle'); // getting the handle from the URL...

    if (!accountHandle) {
        console.log('Account Handle is missing from client site !!');
        return NextResponse.json({message:'account handle missing...'},{status:400});
    }

    const data = await accountFetchingService(accountHandle); // getting the account details...

    return NextResponse.json({ message:'profile fetch successfull !!',accountData:data },{ status:200 });
})
