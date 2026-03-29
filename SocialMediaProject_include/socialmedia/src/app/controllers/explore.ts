import asyncErrorHandler from "../middleware/errorMiddleware";
import { NextResponse , NextRequest } from "next/server";
import { getExplorePostsService } from "../db/services/post";
import { exploreDetailsForAccountService } from "../db/services/account";

export const getExplorePostsOfAccountController = asyncErrorHandler( async (request:NextRequest) => {
    const url = new URL(request.url); // getting the request url...

    const hashtag = String(url.searchParams.get('hashtag'));
    const page =  parseInt(String(url.searchParams.get('page')));
    const size = parseInt(String(url.searchParams.get('size')));

    // check either page OR size didnt exists...
    if (!page || !size) {
        console.log("Important credential missing");
        return NextResponse.json({ message:'Check incoming credentials...' },{ status:400 });
    } 

    // await getExplorePostsService({ hashtag , page , size });
    return NextResponse.json({ message:'Explore posts fetched !!' },{ status:200 });
})

export const getOtherExploreDetailsController = asyncErrorHandler( async (request:NextRequest) => {
    // return await exploreDetailsForAccountService();
})
