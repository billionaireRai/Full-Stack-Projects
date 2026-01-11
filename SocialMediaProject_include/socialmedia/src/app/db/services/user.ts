import users from "@/app/db/models/users";
import accounts from "@/app/db/models/accounts";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectWithMongoDB } from "@/app/db/dbConnection";
import { loginDataType, registrationDataType } from "@/app/controllers/auth";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import follows from "../models/follows";
import Post from "../models/posts";
import subscriptions from "../models/subscriptions";
import mongoose from "mongoose";

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
  location:{
    text:string,
    coordinates:number[] // lat,long
  },
  website:string,
  joinDate:string,
  following:string,
  followers:string,
  Posts:string,
  isCompleted:boolean,
  isVerified:boolean,
  bannerUrl:string,
  avatarUrl:string
}

export interface userCardProp {
  decodedHandle?:string | null ;
  name?:string | null;
  content?:string | null ;
  heading?:React.ReactElement;
  account?: accountType;
  IsFollowing?:boolean;
}

// function for formating the number...
const fmt = (n: number): string => {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";  // 1e9 = 1 * math.pow(10,9) where e = 10 ;
    if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
    return String(n); // number is in hundreds...
};


// DB service related to user registration...
export async function userRegistrationService(credentials:registrationDataType) : Promise<any> {
    const { Name , Username , Email , Password , lat , long , text } = credentials ; // destructuring the data from credential...

    await connectWithMongoDB() // establishing connection with database...
    let userExists = await users.find({ email:Email }) ; // as email is unique...
    let accountExists = await accounts.find({ username:Username }); // username is unique for an account...
    if (userExists.length > 0 || accountExists.length > 0) {
        console.log('Either User/Account already exists with these credentials...');
        return NextResponse.json({messsage:'Duplicate credentials submitted either for User or Account !!'},{ status:404 });
    }

    const newUser = new users({ email:Email , password:Password }); // making new user...
    // Set location if lat and long are provided...
    
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();
    
    newUser.refreshToken = { value: refreshToken.token , rfExpiry: refreshToken.expiry }
    await newUser.save() ; // saving the doc...
    
    // first account creation for this user...
    const firstAccount = new accounts({ userId:newUser._id , name:Name , username:Username.toLowerCase() }) ; 
    if (lat && long) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(long);
        firstAccount.location = {
                text: decodeURIComponent(text) ,
                coordinates: [latitude,longitude] // GeoJSON: [latitude,longitude]...
            };
    }
    await firstAccount.save(); // saving account doc to DB...
    let accountData : userCardProp = {
        decodedHandle:firstAccount.username,
        name:firstAccount.name,
        account:{
            name:firstAccount.name,
            handle:firstAccount.username,
            bio:'' ,
            location:firstAccount.location,
            website:'',
            joinDate:String(firstAccount.createdAt),
            following:'0',
            followers:'0',
            Posts:'0',
            isCompleted:false,
            isVerified:false,
            bannerUrl:'/images/default-banner.jpg',
            avatarUrl:'/images/default-profile-pic.png'
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

// service for user loggin (No tokens already exists)...
export async function logginUserService(data:loginDataType) : Promise<any> {
    const { email , password } = data ; // getting data destructured...

    await connectWithMongoDB(); // establishing connection to DB...
    const userdoc = await users.findOne({ email:email }).select('+password'); // geting the user by email...
    if (!userdoc) return NextResponse.json({ message: 'Invalid email entered...' }, { status: 401 });

    const isValid = await bcrypt.compare(password,userdoc.password);
    if (!isValid) {
         console.log(`Password coming for email ${email} is INVALID !!`);
         return NextResponse.json({ message: 'Invalid password entered...' }, { status: 401 });
    }    

    // Procceding with login logic... 
    const accessToken = userdoc.generateAccessToken();
    const refreshToken = userdoc.generateRefreshToken();

    userdoc.refreshToken = { value: refreshToken.token, rfExpiry: refreshToken.expiry };
    await userdoc.save();

    // Fetch account data for client global state...
    const account = await accounts.findOne({ $and:[{ userId: userdoc._id }, { 'account.Active': true }] });
    if (!account) {
        console.log(`Account with userId ${userdoc._id} not found !!`);
        return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }
     
    const posts = await Post.find({ authorId : userdoc._id }); // taking out all the posts...
    // getting count of followers and followings... 
    const followers = await follows.find({ followingId : account._id })
    const following = await follows.find({ followerId : account._id })
    let accountData : userCardProp = {
        decodedHandle:account.username,
        name:account.name,
        account:{
            name:account.name,
            handle:account.username,
            bio:account.bio || ' ',
            location:account.location ,
            website:account.website || ' ',
            joinDate:String(account.createdAt),
            following:fmt(following.length),
            followers:fmt(followers.length),
            Posts:fmt(posts.length),
            isCompleted:account.account?.complete || false ,
            isVerified:account.isVerified?.value || false,
            bannerUrl: account.bannerUrl ||'/images/default-banner.jpg',
            avatarUrl: account.avatarUrl ||'/images/default-profile-pic.png'
        }
    }
    const info:resType = {
        email:email,
        userId:String(userdoc._id),
        accessToken:accessToken,
        refreshToken:refreshToken.token,
        accountInfo:accountData
    }

    return info;
}

export async function creatingUserAfterOauth(email: string, name: string,pic:string,provider:string) {
    await connectWithMongoDB();
    // Check if user already exists
    let existingUser = await users.findOne({ email });
    if (existingUser) {
        // User exists, generate tokens
        const accessToken = existingUser.generateAccessToken();
        const refreshToken = existingUser.generateRefreshToken();

        existingUser.refreshToken = { value: refreshToken.token, rfExpiry: refreshToken.expiry };
        await existingUser.save();

        // Fetch account data
        const account = await accounts.findOne({ $and:[{ userId: existingUser._id }, { 'account.Active': true }] });
        if (!account) return NextResponse.json({ message: 'Account not found' }, { status: 404 }) ;

        // Update the account's avatarUrl with the new picture
        account.avatarUrl = pic;
        await account.save();

        let accountData: userCardProp = {
            decodedHandle: account.username,
            name: account.name,
            account: {
                name: account.name,
                handle: account.username,
                bio: '',
                location: account.location,
                website: '',
                joinDate: String(account.createdAt),
                following: '0',
                followers: '0',
                Posts: '0',
                isCompleted: false,
                isVerified: false,
                bannerUrl: '/images/default-banner.jpg',
                avatarUrl: pic
            }
        };

        const info: resType = {
            email,
            userId: String(existingUser._id),
            accessToken,
            refreshToken: refreshToken.token,
            accountInfo: accountData
        };

        return info;
    }

    // Generate a new user credentials...
    let baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
    let username = baseUsername;
    let counter = 1;
    while (await accounts.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
    }

    // Create new user with dummy password for OAuth...
    const dummyPassword = 'oauth_dummy_password_' + Math.random().toString(36);
    const newUser = new users({
        email,
        password: dummyPassword,
        o_auth: { authProvider: provider, isUsed: true }
    });

    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    newUser.refreshToken = { value: refreshToken.token, rfExpiry: refreshToken.expiry };
    await newUser.save();

    // Create account
    const newAccount = new accounts({ userId: newUser._id, name, username, avatarUrl: pic });
    await newAccount.save();

    // Fetch real data for the new account
    const posts = await Post.find({ authorId: newUser._id });
    const followers = await follows.find({ followingId: newAccount._id });
    const following = await follows.find({ followerId: newAccount._id });

    let accountData: userCardProp = {
        decodedHandle: newAccount.username,
        name: newAccount.name,
        account: {
            name: newAccount.name,
            handle: newAccount.username,
            bio: newAccount.bio || '',
            location: newAccount.location ,
            website: newAccount.website || '',
            joinDate: String(newAccount.createdAt),
            following: fmt(following.length),
            followers: fmt(followers.length),
            Posts: fmt(posts.length),
            isCompleted: newAccount.account?.completed || false,
            isVerified: newAccount.isVerified?.value || false,
            bannerUrl: newAccount.bannerUrl || '/images/default-banner.jpg',
            avatarUrl: pic
        }
    };

    const info: resType = {
        email,
        userId: String(newUser._id),
        accessToken,
        refreshToken: refreshToken.token,
        accountInfo: accountData
    };

    return info;
}

export async function accountFetchingService(handle:string) {
    await connectWithMongoDB() ; // establishing the connection with DB...

    const user = await getDecodedDataFromCookie("accessToken");
    // Return the error response...
    if (user instanceof Error) return NextResponse.json({ message:user.message },{ status:401, statusText: 'ACCESS_TOKEN_EXPIRED' });    
    
    // getting account details...
    const account = await accounts.findOne({ username:handle, 'account.Active': true , userId:user.id })  ;
    if (!account) {
        console.log('account unavailable , check account handle !!');
        return NextResponse.json({message:'account unavailable...'},{status:400});
    }

    const posts = await Post.find({ authorId:account._id }) ;
    // getting count of followers and followings...
    const followers = await follows.find({ followingId : account._id })
    const following = await follows.find({ followerId : account._id })

    const formatedOne : userCardProp = {
        decodedHandle:account.username,
        name:account.name,
        content:account.bio,
        account: {
            name:account.name ,
            handle:account.username ,
            bio:account.bio ,
            location:{
              text:account.location.text,
              coordinates:account.location.coordinates // lat,long
            },
            website:account.website,
            joinDate:String(account.createdAt),
            following:fmt(following.length),
            followers:fmt(followers.length),
            Posts:fmt(posts.length),
            isCompleted:account.account?.completed || false,
            isVerified:account.isVerified?.value || false,
            bannerUrl:account.bannerUrl,
            avatarUrl:account.avatarUrl
        }
    }

    return formatedOne ;

}
