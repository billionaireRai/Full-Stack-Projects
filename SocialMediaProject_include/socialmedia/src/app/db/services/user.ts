import users from "@/app/db/models/users";
import accounts from "@/app/db/models/accounts";
import { NextResponse } from "next/server";
import { connectWithMongoDB } from "@/app/db/dbConnection";
import { registrationDataType } from "@/app/controllers/auth";

interface resType {
    email:string,
    userId:string,
    accessToken:string,
    refreshToken:string,
    accountInfo:userCardProp
}

export interface accountType {
  name:string ,
  handle:string ,
  bio:string ,
  location:string,
  website:string,
  joinDate:string,
  following:string,
  followers:string,
  Posts:string,
  isCompleted:boolean,
  isVerified:boolean,
  coverImage:string,
  avatar:string
}

export interface userCardProp {
  decodedHandle?:string | null ;
  name?:string | null;
  content?:string | null ;
  heading?:React.ReactElement;
  account?: accountType;
  IsFollowing?:boolean;
}

export async function userRegistrationService(credentials:registrationDataType) : Promise<any> {
    const { Name , Username , Email , Password } = credentials ; // destructuring the data from credential...

    await connectWithMongoDB() // establishing connection with database...
    let userExists = await users.find({ email:Email }) ; // as email is unique...
    let accountExists = await accounts.find({ username:Username }); // username is unique for an account...
    if (userExists.length > 0 || accountExists.length > 0) {
        console.log('Either User/Account already exists with these credentials...');
        return NextResponse.json({messsage:'Duplicate credentials submitted either for User or Account !!'},{ status:404 });
    }

    const newUser = new users({ email:Email , password:Password }); // making new user...
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    newUser.refreshToken = { value: refreshToken.token , rfExpiry: refreshToken.expiry }
    await newUser.save() ; // saving the doc...

    // first account creation for this user...
    const firstAccount = new accounts({ userId:newUser._id , name:Name , username:Username.toLowerCase() }) ; 
    await firstAccount.save(); // saving account doc to DB...

    let accountData : userCardProp = {
        decodedHandle:firstAccount.username,
        name:firstAccount.name,
        account:{
            name:firstAccount.name,
            handle:firstAccount.username,
            bio:'' ,
            location:'',
            website:'',
            joinDate:String(firstAccount.createdAt),
            following:'0',
            followers:'0',
            Posts:'0',
            isCompleted:false,
            isVerified:false,
            coverImage:'',
            avatar:''
        }
    }
    const info:resType = {
        email:Email,
        userId:String(newUser._id),
        accessToken:accessToken,
        refreshToken:refreshToken.token,
        accountInfo:accountData
    } 

    return info ;
    
}