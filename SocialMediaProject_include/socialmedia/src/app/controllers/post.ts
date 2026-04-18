import { NextRequest , NextResponse } from "next/server";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { postDeletionService, postUpdationService, togglePostHighlightService, togglePostPinService, togglePostFavouriteService, postNotInterestedService, postRepostService, postLikedService, postBookmarkingService, postSendingViaDM, getBookmarkAndSuggestionService, getPostPageEssentialService , getAccountsBookmarkedAPostService} from "../db/services/post";
import { getVerifiedUrlForQRService } from "../db/services/qr";

export const deleteMyPostController =  asyncErrorHandler(async (request:NextRequest) => {
    const reqUrl = new URL(request.nextUrl);
    const searchParam = reqUrl.searchParams ; // getting the search param obj...
    const postid = searchParam.get('postId')?.trim();
    const postowner = searchParam.get('postOwner')?.trim();
    const deleterequestby = searchParam.get('deleteRequestBy')?.trim() ;

    if (!postid || !postowner || !deleterequestby) {
        console.log('Some credentials missing !!');
        return NextResponse.json({ message:'Recheck Credentials coming...'},{ status:400 });
    }

    if (postowner !== deleterequestby) {
        console.log('Deletion logic failed !!') ;
        return NextResponse.json({ message:'Cant delete someone else post...'},{ status:403 });
    }
   
   // await postDeletionService({ postId:String(postid) , postOwner:String(postowner) , deleteRequestBy:String(deleterequestby)  });
   return NextResponse.json({ message:'Post deleted successfully !!'},{ status:200 });
})

export const updatePaticularPostController = asyncErrorHandler(async (request:NextRequest) => {
    const formdata = await request.formData() ;
    const data: { [key: string]: any } = {}; // for storing extraccted data...
    for (const [key, value] of formdata.entries()) {
        data[key] = value;
    }
    
    // await postUpdationService(data) ; // calling thhe service...

    return NextResponse.json({ message:'Post updated successfully !!'},{ status:200 });
})

export const togglePinnedPostController = asyncErrorHandler( async (request:NextRequest) => { 
    const requestUrl = new URL(request.nextUrl) ;
    const currentState = requestUrl.searchParams.get('currentPinState') ;
    const postid = requestUrl.searchParams.get('postId')?.trim();
    const postowner = requestUrl.searchParams.get('postOwner')?.trim();
    const requestby = requestUrl.searchParams.get('pinRequestBy')?.trim() ;
    
     if (!postid || !postowner || !requestby) {
        console.log('Some credentials missing !!');
        return NextResponse.json({ message:'Recheck Credentials coming...'},{ status:400 });
    }

    if (postowner !== requestby) {
        console.log('Deletion logic failed !!') ;
        return NextResponse.json({ message:'Cant delete someone else post...'},{ status:403 });
    }
    
    // await togglePostPinService({currentState,postid,postowner,requestby}); // calling the toggle service...
    return NextResponse.json({ message:'Post pinned toggled successfully !!'},{ status:200 });
})

export const toggleHighlightPostController = asyncErrorHandler( async (request:NextRequest) => { 
    const { postId } = await request.json() ; // getting the postId...

    if (!postId) {
        console.log("PostId is missing , REQUIRED !!");
        return NextResponse.json({ message:'postid unavailable please check...'},{ status:400 });
    }

    // await togglePostHighlightService(postId) ; // calling post highlight service...
    return NextResponse.json({ message:'Post pinned toggled successfully !!'},{ status:200 });
})

export const addToFavouriteController = asyncErrorHandler( async (request:NextRequest) => {
    const { postId } = await request.json() ;

    if (!postId) {
        console.log("PostId is missing , REQUIRED !!");
        return NextResponse.json({ message:'postid unavailable please check...'},{ status:400 });
    }

    // await togglePostFavouriteService(postId) ; // calling the toggle favourite service...
    return NextResponse.json({ message:'Post added to fav !!'},{ status:200 });
})


// data structure 
// Post Id : 1
// reply : 'Just trying to comment on a post'
// Mentions : [ 'alice' ]
// Locations : [ { name: 'London', coordinates: [ 51.5074, -0.1278 ] } ]
export const commentOnPostController = asyncErrorHandler( async (request:NextRequest) => {
    const { postId , replyText , mentions , AddLocation } = await request.json() ; // getting the extracted data...

    if (!postId || !replyText.trim()) {
        console.log("Any of neccessary credential missing...");
        return NextResponse.json({ message:'Check your neccessary credentials !!' },{ status:404 });
    }

    // await commentingOnAPostService({ postId , replyText , mentions , AddLocation });
    return NextResponse.json({ message:'Commented successfully !!'},{ status:200 });
})

export const getPostForEmbedPageController = asyncErrorHandler( async (request:NextRequest) => {
    const url = new URL(request.nextUrl) ;
    const postId = url.searchParams.get('postid') ;

    if (!postId) {
        console.log("PostId is missing , REQUIRED !!");
        return NextResponse.json({ message:'postid unavailable please check...'},{ status:400 });
    }

    // await getPostByIdService(postId) ; // calling post highlight service...
    return NextResponse.json({ message:'Post data fetched !!'},{ status:200 });
})

export const postNotInterestedController = asyncErrorHandler(async (request:NextRequest) => {
    const { postId } = await request.json() ; // getting the postId from request body...
    console.log('Not interested postId :',postId); // debugging step...
    if (!postId) {
        console.log('PostId is missing !!');
        return NextResponse.json({ message:'Please check postId' },{ status:404 });
    }
    
    // await postNotInterestedService(postId) ;
    return NextResponse.json({ message:'Post data fetched !!'},{ status:200 });
}) 

export const postRepostController = asyncErrorHandler(async (request:NextRequest) => {
    const requrl =  new URL(request.nextUrl) ;

    // getting the query search params...
    const postid = String(requrl.searchParams.get('postId'));
    const repostState = Boolean(requrl.searchParams.get('state')) ;

    if (!postid) {
        console.log("Any of credential missing...");
        return NextResponse.json({ message:'Check the request object !!' },{ status:404 });
    }

    // await postRepostService({ postid , repostState }) ;
    return NextResponse.json({ message:'Post successfully reposted !!'},{ status:200 });
})

export const postLikeController = asyncErrorHandler(async (request:NextRequest) => {
    const { postId , isLiked } = await request.json() ; // getting data from request object...

    if (!postId) {
        console.log("Any of credential missing...");
        return NextResponse.json({ message:'Check the request object !!' },{ status:404 });
    }

    // await postLikedService({ postId , isLiked }); 
    return NextResponse.json({ message:'Post liked successfully !!'},{ status:200 });
})

export const postBookmarkController = asyncErrorHandler( async (request:NextRequest) => {
    const { postId , isBookmarked } = await request.json() ; // destructuring syntax...

    if (!postId) {
      console.log("Any of credential missing...");
      return NextResponse.json({ message:'Check the request object !!' },{ status:404 });
    }

    // await postBookmarkingService({ postId , isBookmarked });
    return NextResponse.json({ message:'Post bookmarked successfully !!'},{ status:200 });
})

export const postSendViaDMController = asyncErrorHandler(async (request:NextRequest) => {
    const { link , selectedAccounts } = await request.json(); // getting data...
    
    if (!link || !selectedAccounts) {
        console.log("Missing credentials check again !!");
        return NextResponse.json({ message:'Missing neccessary credentials...' },{ status:404 });
    }

    // await postSendingViaDM({ link , selectedAccounts }) ; // calling DM sending logic...
    return NextResponse.json({ message:'Post sent via DM !!'},{ status:200 });
})

export const getBookmarkPostAndSuggestionsController = asyncErrorHandler( async (request:NextRequest) => {

    // await getBookmarkAndSuggesstionService() ; // calling the function...
    return NextResponse.json({ message:'fetched successfully !!'},{ status:200 });
})

export const postPageEssentialController = asyncErrorHandler( async (request:NextRequest) => {
    const { postId , username } = await request.json() ; // extracting the body inputs...

    if (!postId || !username) {
        console.log("Neccessary credential missing !!");
        return NextResponse.json({ message:'Recheck the credentials...' },{ status:400 });
    }

    // await getPostPageEssentialService({ postId , username }) ;
    return NextResponse.json({ message:'Essentials fetched successfully !!'},{ status:200 });
})

export const getAccountsBookmarkedAPostController = asyncErrorHandler( async (request:NextRequest) => {
    const url = new URL(request.nextUrl) ;
    const postid = url.searchParams.get('postid');
    
    const page =  parseInt(String(url.searchParams.get('page')));
    const size = parseInt(String(url.searchParams.get('size')));

    if (!postid || !page || !size) {
        console.log("Important credential missing");
        return NextResponse.json({ message:'Check incoming credentials...' },{ status:400 });
    }

    // await getAccountsBookmarkedAPostService({ postid , page , size });
    return NextResponse.json({ message:'Essentials fetched successfully !!'},{ status:200 });
})


export const getVerifiedUrlForQRController = asyncErrorHandler( async (request:NextRequest) => {
    const { category , handle , id , path } = await request.json() ; // extracting data from body...

    if (!category || !path) {
        console.log("Any of the credential missing !!");
        return NextResponse.json({ message:'Ensure credentials coming...' },{ status:400 });
    }

    // await getVerifiedUrlForQRService({ category , handle , id , url });
    return NextResponse.json({ message:'Verified url sent !!' },{ status:200 });
})