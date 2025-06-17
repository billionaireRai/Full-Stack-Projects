import { NextResponse } from "next/server";
import { connectWithMongoDB } from "@/db/dbConnection";
import asyncErrorHandler from "@/middlewares/errorMiddleware";
import users from "@/db/models/userModel.js";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";
import { isSpoofedBot } from "@arcjet/inspect";
import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer"; 

// making an arcjet instance for protection configuration...
const aj = arcjet({
  key: process.env.ARCJET_KEY, 
  characteristics: ["ip.src"], // Tracking requests made by user by IP...
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: ["CATEGORY:SEARCH_ENGINE"]}),
    tokenBucket({mode: "LIVE",refillRate: 5,interval: 10,capacity: 10}),
  ],
});

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

const POST = asyncErrorHandler(async (request) => {
  console.log("Password Resetting API called");
  // application of configuration and output handling... 
  const decision = await aj.protect(request, { requested: 5 });
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) { 
      console.log("Request denied: Too Many Requests");
      return NextResponse.json({ error: "Too Many Requests", reason: decision.reason }, { status: 429 });
    } else if (decision.reason.isBot()) {
      console.log("Request denied: Bot detected");
      return NextResponse.json({ error: "No bots allowed", reason: decision.reason }, { status: 403 });
    } else {
      console.log("Request denied: Forbidden");
      return NextResponse.json({ error: "Forbidden", reason: decision.reason }, { status: 403 });
    }
  }
  if (decision.results.some(isSpoofedBot)) {
    console.log("Request denied: Spoofed bot detected");
    return NextResponse.json({ error: "Forbidden", reason: decision.reason }, { status: 403 });
  }
  // main resetting logic starts from here...
  const { email } = await request.json();
  console.log("Email :", email); // debugging step

  await connectWithMongoDB(); // establishing mongoDB connection...
  const userByEmail = await users.findOne({ email }); // finding user by email...
  if (!userByEmail) {
    console.log(`User not found with ${email} EmailId`);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  // generating reset-token for the user...
  const tokenForReset = jsonwebtoken.sign({ id: userByEmail._id.toString() }, process.env.SECRET_KEY_FOR_PASSWORD_RESET, {
    expiresIn: process.env.EXPIRY_FOR_RESET_TOKEN, // token is valid for 10 minutes...
  });
  // sending reset token to user via email...
  try {
    const mail = await sendMailToUser(userByEmail.email, tokenForReset, userByEmail.name);
    console.log(mail.response); // logging the mail response that is info returned from sendMailToUser function...
  } catch (error) {
    return NextResponse.json({ error: "Error in sending mail" }, { status: 500 });
  }
  // sending the next response
  return NextResponse.json({ message: "Password resetting done..." }, { status: 200 });
});

export { POST };
