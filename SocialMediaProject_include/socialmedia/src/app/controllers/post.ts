import { NextRequest , NextResponse } from "next/server";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { postDeletionService, postUpdationService } from "../db/services/post";

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
