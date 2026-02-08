import { NextResponse } from "next/server";
import { createANewPostService } from "@/app/db/services/post";


export async function POST(req: Request) {
    const formData = await req.formData() ; // getting the form data...
    console.log(formData) ;

    const postText = formData.get('postText') as string;
    const mentions = JSON.parse(formData.get('mentions') as string);
    const taggedLocation = JSON.parse(formData.get('taggedLocation') as string);
    const canBeRepliedBy = formData.get('canBeRepliedBy') as string;
    const poll = JSON.parse(formData.get('poll') as string);

    const imgUrls = formData.getAll('imgUrls') as File[];
    const videoUrls = formData.getAll('videoUrls') as File[];
    const gifsArr = formData.getAll('gifsArr') as File[];

   // await createANewPostService({ postText, imgUrls, videoUrls, mentions, gifsArr, taggedLocation, canBeRepliedBy, poll });

}

