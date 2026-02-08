import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";
import { uploadMediaOnCloudinary } from "@/app/controllers/cloudinary";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import accounts from "../models/accounts";
import Post from "../models/posts";
import Poll from "../models/polls";

interface uploadedObj {
     success: boolean;
     url: string;
     public_id: string;
     resource_type: "image" | "video" | "raw" | "auto";
}

interface postDeletionType {
    postId:string,
    postOwner:string,
    deleteRequestBy:string
}


export const createANewPostService = async ( data:any ) => { 
    await connectWithMongoDB() ; // establishing connection with mongoDB...

    const { postText , imgUrls , videoUrls , mentions , gifsArr , taggedLocation , canBeRepliedBy , poll } = data ; // getting out the data...

    // getting credentials from cookies...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
    // getting the active account...
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // checking post restriction...
    const currentDate = new Date();
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const totalPostsThisMonth = await Post.countDocuments({
        authorId: activeAcc._id,
        isDeleted: false,
        createdAt: { $gte: monthStart, $lt: monthEnd }
    });

    // posts limited to 10 for unverified accounts...
    if (!activeAcc.isVerified.value && totalPostsThisMonth >= 10) {
        console.log("Post creation restricted , get verified !!");
        return NextResponse.json({ message: 'Post limit of this month exceeded for unverified accounts !!' }, { status: 429 });
    }

    // uploading media on cloudinary...
    const uploadedImgObjs : uploadedObj[] = await Promise.all( imgUrls.map( async (url:File) => { 
        const bytes = await url.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const uploadedObj = await uploadMediaOnCloudinary(buffer,url.name);
        if (uploadedObj.success)  return uploadedObj ;
    }))

    const uploadedvideoObjs : uploadedObj[] = await Promise.all( videoUrls.map( async (url:File) => { 
        const bytes = await url.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const uploadedObj = await uploadMediaOnCloudinary(buffer,url.name);
        if (uploadedObj.success)  return uploadedObj ;
    }))

    const uploadedgifsArrObjs : uploadedObj[] = await Promise.all( gifsArr.map( async (url:File) => { 
        const bytes = await url.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const uploadedObj = await uploadMediaOnCloudinary(buffer,url.name);
        if (uploadedObj.success)  return uploadedObj ;
        
    }))

    const mentionsAccountsIds = await Promise.all(mentions.map( async (mentionHandle:string) => {
        const account = await accounts.findOne({ username:mentionHandle , 'account.status':'ACTIVE' });
        return account._id ;
    }))
    const fullMediaArr = [ ...uploadedImgObjs , ...uploadedvideoObjs , ...uploadedgifsArrObjs ] ; // full array of media...
    const newPost = new Post({
        content:postText,
        mediaUrls: fullMediaArr.map((media) => ({ url: media.url, public_id: media.public_id, media_type: media.resource_type })),
        replyAllowedBy:canBeRepliedBy,
        mentions:mentionsAccountsIds,
        taggedLocation : taggedLocation
    })
    
    if (poll && poll.question) {
        const expiry = new Date(Date.now() + poll.duration * 1000); // expiry time based on duration...
        const newPoll = new Poll({ authorPost: newPost._id, question: poll.question, options: poll.options, duration: poll.duration, expiry });
        await newPoll.save();
    }

    await newPost.save(); // saving the post...
    return NextResponse.json({ message: 'Post created successfully!' }, { status: 200 });

}

export const postDeletionService = async (credentials:postDeletionType) => {
    const { postId , postOwner , deleteRequestBy } = credentials ; // parsing credentials in service...
    await connectWithMongoDB() ; // connecting to database...

    // getting credentials from cookies...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // getting my active account...
    const activeAcc = await accounts.findOne({ username:deleteRequestBy , userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // Update the post to mark as deleted...
    const updatedPost = await Post.findOneAndUpdate({ $and:[{ _id:postId },{ authorId:activeAcc._id  },{ isDeleted:false }] },{ isDeleted:true },{ new:true });

    if (!updatedPost) return NextResponse.json({ message: 'Post not found or already deleted' }, { status: 404 });

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
}

export const postUpdationService = async (data:any) => {
    const { postId , postText , mentions , taggedLocations , canBeRepliedBy , poll , imgUrls , videoUrls , gifsArr , existingMedia } = data ; // destructuring syntax...

    await connectWithMongoDB() ; // establish connection with mongoDB...

    // getting credentials from cookies...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // getting my active account...
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    if(!activeAcc.isVerified.value){
        console.log('Restircted to use this functionality !!');
        return NextResponse.json({ message: 'Post updates are restricted for unverified accounts. Please verify your account.' }, { status: 403 });
    }

    // processing mentions..
    const mentionsAccountsIds = await Promise.all(mentions.map( async (mentionHandle:string) => {
        const account = await accounts.findOne({ username:mentionHandle , 'account.status':'ACTIVE' });
        return account ? account._id : null ;
    }))

    // uploading media on cloudinary...
    const uploadedImgObjs : uploadedObj[] = imgUrls.length > 0 ? await Promise.all( imgUrls.map( async (url:File) => {
        const bytes = await url.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadedObj = await uploadMediaOnCloudinary(buffer,url.name);
        return uploadedObj.success ? uploadedObj : null;
    })) : []

    const uploadedvideoObjs : uploadedObj[] = videoUrls.length > 0 ? await Promise.all( videoUrls.map( async (url:File) => {
        const bytes = await url.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadedObj = await uploadMediaOnCloudinary(buffer,url.name);
        return uploadedObj.success ? uploadedObj : null;
    })) : [] ;

    const uploadedgifsArrObjs : uploadedObj[] = gifsArr.length > 0 ? await Promise.all( gifsArr.map( async (url:File) => {
        const bytes = await url.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadedObj = await uploadMediaOnCloudinary(buffer,url.name);
        return uploadedObj.success ? uploadedObj : null;
    })) : [];

    const fullMediaArr = [ ...uploadedImgObjs , ...uploadedvideoObjs , ...uploadedgifsArrObjs ] ; // full array of media...

    // updating the post...
    const updatedPost = await Post.findOneAndUpdate({ $and:[{ authorId:activeAcc._id },{ _id:postId }] },{
        content: postText,
        mediaUrls: [ ...existingMedia, ...fullMediaArr.map((media) => ({ url: media.url, public_id: media.public_id, media_type: media.resource_type })) ],
        replyAllowedBy: canBeRepliedBy,
        mentions: mentionsAccountsIds,
        taggedLocation: taggedLocations
    },{ new: true }) ;

    // poll related updation...
    const existingPoll = await Poll.findOne({ authorPost: updatedPost._id, expiry: { $gt: new Date() }, isActive: true });

    if (existingPoll && poll && poll.question) {
            // Updating existing poll
            const expiry = new Date(Date.now() + poll.duration * 1000);
            await Poll.findOneAndUpdate(
                { _id: existingPoll._id },
                {
                    question: poll.question,
                    options: poll.options,
                    duration: poll.duration,
                    expiry: expiry
                }
            );
    } else {
        if (poll && poll.question) {
            // Create new poll...
            const expiry = new Date(Date.now() + poll.duration * 1000);
            const newPoll = new Poll({
                authorPost: updatedPost._id,
                question: poll.question,
                options: poll.options,
                duration: poll.duration,
                expiry: expiry
            });
            await newPoll.save();
        }
    }

    if (!updatedPost) return NextResponse.json({ message: 'Post not found !!' }, { status: 404 });

    return NextResponse.json({ message: 'Post updated successfully !!' }, { status: 200 });

}