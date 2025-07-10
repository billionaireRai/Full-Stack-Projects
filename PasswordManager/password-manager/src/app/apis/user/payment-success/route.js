import users from "@/db/models/userModel";
import asyncErrorHandler from "@/middlewares/errorMiddleware";
import nodemailer from "nodemailer";
import { decodeGivenJWT } from "@/lib/decodejwt";
import { connectWithMongoDB } from "@/db/dbConnection";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


const sendMailToUser = async (userEmail, userName, paymentDetails) => { 
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
    subject: `Payment Successful - Thank you, ${userName}!`,
    text: `Dear ${userName},
    Thank you for your successful payment. Your subscription details are as follows :
    ${JSON.stringify(paymentDetails, null, 2)}

    If you have any questions, feel free to contact our support team.
    Best regards,
    Lockrift Team ${isProduction ? 'https://lockRift.com' : "https://localhost:3000"}`
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

const POST = asyncErrorHandler( async () => {
    console.log("Route handler for sending success payment EMAIL...");
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
    const userToGet = await users.findById(decodedToken.id);
    const objectToSend = userToGet.subscription ; // extracting the main subscription object...

    // await sendMailToUser(decodedToken.email, decodedToken.name, objectToSend);
    const plans = [
          { name: "freemium", price: "₹0/month" },
          { name: "basic", price: "₹899/month"},
          { name: "standard", price: "₹1499/month" },
          { name: "premium", price: "₹3199/month"}
    ];
    // exact data to render on UI...
    const dataToRender = {
      billingTo : userToGet.email ,
      date : new Date(objectToSend.subscriptionDate).toUTCString() ,
      amountPaid : plans.find((plan) => plan.name === objectToSend.subscriptionLevel).price,
      plan: plans.find((plan) => plan.name === objectToSend.subscriptionLevel).name,
      transactionId: objectToSend.paymentId
    }
    return NextResponse.json({message:"Payment success email sent",dataToRender:dataToRender}, { status: 200 });
});

export { POST };
