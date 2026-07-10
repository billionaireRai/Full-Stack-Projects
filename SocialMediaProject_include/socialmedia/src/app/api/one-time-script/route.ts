import { NextResponse } from "next/server";
import Post from "@/app/db/models/posts";
import { posts } from './post' ;
import { generateCategoryAndKeywords } from "@/lib/aifeatures";
import { connectWithMongoDB } from "@/app/db/dbConnection";
import { mediaType } from "@/components/mediapopmodal";

export const GET = async () => { 
    await connectWithMongoDB() ;
    const updatedPosts = await Promise.all(posts.map( async (post) => { 
        let expectedMediaArr: mediaType[] = [];
        if (post.mediaUrls.length > 0) {
            expectedMediaArr = post.mediaUrls.map((m) => ({ url: m.url,media_type: m.media_type }));
        }

        const { category , keywords } = await generateCategoryAndKeywords(post.content,expectedMediaArr);
      return { ...post, category , keywords } ;
    }))

    await Post.insertMany(updatedPosts);
    return NextResponse.json({ message:'One time script executed !!' , success:true },{ status:200 });
}