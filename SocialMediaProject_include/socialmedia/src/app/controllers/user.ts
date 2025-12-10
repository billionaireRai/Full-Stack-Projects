import { NextRequest , NextResponse } from "next/server";
import asyncErrorHandler from "@/app/middleware/errorMiddleware";
import nodemailer from 'nodemailer';
import { userRegistrationService } from '@/app/db/services/user';


export interface returnDataType {
    userId:string,
    email:string,
}
export const registerUserController = asyncErrorHandler(async (request:NextRequest) => {
     const { Name , Username , Email , Password } = await request.json() ; // extracting data from request body...
    // applying some importants checks...
    if (!Name || !Username || !Email || !Password) {
        console.log('One or More credentials missing check again!!!');
        return NextResponse.json({message:'Send every neccessary credential...'},{ status:400 });
    }



    const Data : returnDataType = {
        userId:'',
        email:'',
    } ; 
    return NextResponse.json({ message:'User registration Successfull !!', userCred : Data , handle:`@${Username}`,accCompleted:false },{ status:200 });

})