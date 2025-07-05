/**
 * API route handler for creating a payment request using Razorpay.
 * 
 * This POST handler performs the following:
 * - Validates the presence of required fields 'plan' and 'data' in the request body.
 * - Extracts the access token from cookies and decodes the user information.
 * - Creates a Razorpay instance using environment keys.
 * - Creates a Razorpay order with the specified plan price and user receipt.
 * - Connects to MongoDB and updates the user's payment card details.
 * - Returns a JSON response with the order details on success.
**/

import Razorpay from "razorpay";
import asyncErrorHandler from "@/middlewares/errorMiddleware";
import users from "@/db/models/userModel";
import { connectWithMongoDB } from "@/db/dbConnection";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decodeGivenJWT } from "@/lib/decodejwt";

const POST = asyncErrorHandler( async (request) => { 
    const { plan , data, subscription } = await request.json() ; // destructuring the data coming in request body...
    if (!plan || !data) {
        console.log("some Credential missing from client side...");
        return NextResponse.json({message:"Any of the Required credential is missing"},{status:400});
    }
    // cookies related logic for accessToken...
    const cookiesStore = await cookies() ;
    const accessToken = cookiesStore.get("accessToken").value ;
    const decodedUser = decodeGivenJWT(accessToken,process.env.SECRET_FOR_ACCESS_TOKEN);

    // logic for razorpay by creating its instance ...
    const razorpay = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        key_secret: process.env.RAZORPAY_SECRET_KEY
    });

    let order ; // defining an order variable...
    if(subscription) {
        // Create subscription for recurring billing...
        const subscriptionOptions = {
            plan_id: plan.id, // assuming plan object has (id) for subscription...
            customer_notify: 1,
            total_count: 12, // for all 12 months...
            start_at: Math.floor(Date.now() / 1000) + 60, // start after 1 minute
            notes: { userId: decodedUser.id }
        };
        order = razorpay.subscriptions.create(subscriptionOptions);
    } else {
        // Create one-time order
        const optionsForOrder = {
            amount: parseInt(String(plan.price).substring(1).replace(/,/g, '')) * 100, // convert to paise
            currency: "INR",
            receipt: `receipt_${decodedUser.id}`,
            notes: { key: "note", value: "note value" }
        };
        order = await razorpay.orders.create(optionsForOrder);
    }
    // logic for saving data in DB...
    await connectWithMongoDB() ; // for establishing the connection with mongoDB...
    const userFromDB = await users.findByIdAndUpdate(decodedUser.id,
        {
            $set:{ 
                cardHolderName :data.name ,
                cardNumber : data.number ,
                expiryDate : data.expiry ,
                cvv : data.cvv 
            }}
    ) ;
    await userFromDB.save() ; // saving the updated doc in DB...
    return NextResponse.json({success:true,message:"Order successfully created",dataFromServer:order , user:decodedUser},{status:200});

 });

const PATCH = asyncErrorHandler(async (request) => {
    const { payment_id , order_id , subscription_id } = await request.json(); // destructuring the data...
    if(!payment_id || !order_id , !subscription_id) {
        console.log('credentials to push not available...');
        return NextResponse.json({success:false,message:"Invalid request"},{status:400});
    }
    // cookies related logic...
    const cookiesStore = await cookies() ;
    const accessToken = cookiesStore.get("accessToken").value ;
    const decodedUser = decodeGivenJWT(accessToken,process.env.SECRET_FOR_ACCESS_TOKEN);

    if(!decodedUser) {
        console.log('user aint Authencticated');
        return NextResponse.json({success:false,message:"please register/login first..."},{status:401});
    }
    // logic for puting the data in user DOC in database...
    await connectWithMongoDB() ; // establshing the connection to database...
    const userFromDB = await users.findByIdAndUpdate(decodedUser.id,{$set:{
        paymentId : payment_id ,
        orderId : order_id ,
        subscriptionId : subscription_id ,
    }}) 
    await userFromDB.save() ; // saving the doc instance to db...
    return NextResponse.json({success:true,message:"Payment Data pushed in DB..."},{status:200})
}) 


export { POST , PATCH };
