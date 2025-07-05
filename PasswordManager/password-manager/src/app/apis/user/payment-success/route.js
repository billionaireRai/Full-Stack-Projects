import users from "@/db/models/userModel";
import asyncErrorHandler from "@/middlewares/errorMiddleware";
import { decodeGivenJWT } from "@/lib/decodejwt";
import { connectWithMongoDB } from "@/db/dbConnection";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";


const sendMailToUser = async (userEmail, token, userName) => { 
  const mailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth:{
      user: process.env.MY_MAIL,
      pass: process.env.MY_MAIL_PASSWORD,
    }
  });
  const isProduction = process.env.NODE_ENV === 'production'; // checking current node environment...
  const mailOptions = {
    from: process.env.MY_MAIL,
    to: userEmail,
    subject: `Password Reset Requested By ${userName}`,
    text: `You are receiving this because you OR someone else have requested password resetting for EmailId in SUBJECT
    if that is you Please click on the link below to reset your password http://${isProduction ? 'www.lockrift.com' :'localhost:3000'}/auth/reset-password?token=${token}`
  };
  return new Promise((resolve, reject) => {
    mailTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error in mail Sending callback :", error);
        reject(error);
      } else {
        console.log("Mail sent successfully");
        resolve(info);
      }
    });
  });
};

const GET = asyncErrorHandler( async (request) => {
    console.log("Route handler for sending success payment EMAIL...")
    // cookies related logic..
    const cookiesStore = await cookies();
    const accessToken = cookiesStore.get("accessToken").value ;
    const decodedToken = decodeGivenJWT(accessToken,process.env.SECRET_FOR_ACCESS_TOKEN); // decoded user containing id , name , email...

    // endcases handling of the token...
    if(!decodedToken){
        console.log("user need to get Authenticated...");
        return new NextResponse("You need to get Authenticated...", { status: 401 });
    }

    await connectWithMongoDB() ; // establishing the connection to mongoDB...
    const subscriptionDetails = await users.findById(decodedToken.id);
    const objectToSend = subscriptionDetails.subscription ;

    const mailSend = await sendMailToUser()

})