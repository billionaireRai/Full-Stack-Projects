import { NextResponse } from "next/server";
import { connectWithMongoDB } from "@/db/dbConnection";
import asyncErrorHandler from "@/middlewares/errorMiddleware";
import users from "@/db/models/userModel.js";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";
import { isSpoofedBot } from "@arcjet/inspect";

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

const POST = asyncErrorHandler(async (request) => {
  console.log("Registration API called");
  // application of configuration and output handling... 
  const decision = await aj.protect(request, { requested: 5 });
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) { 
      console.log("Request denied: Too Many Requests");
      return NextResponse.json({ error: "Too Many Requests", reason: decision.reason },{ status: 429 });
    
    } else if (decision.reason.isBot()) {
      console.log("Request denied: Bot detected");
      return NextResponse.json( { error: "No bots allowed", reason: decision.reason }, { status: 403 }
      );
    } else {
      console.log("Request denied: Forbidden");
      return NextResponse.json( { error: "Forbidden", reason: decision.reason },{ status: 403 });
    }
  }
  if (decision.results.some(isSpoofedBot)) {
    console.log("Request denied: Spoofed bot detected");
    return NextResponse.json(
      { error: "Forbidden", reason: decision.reason },
      { status: 403 }
    );
  }
  // main route logics...
const { name, email, salt, password, confirmPassword, userLatestLocation } = await request.json() ; // destructuring syntax...
  if (password !== confirmPassword) {
    console.log("Password and confirmPassword do not match");
    return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
  }
  const encryptionSalt = Number(salt);
  if (isNaN(encryptionSalt)) {
    console.log("Invalid salt value:", salt);
    return NextResponse.json({ message: "Invalid salt value" }, { status: 400 });
  }

  try {
    await connectWithMongoDB();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json({ message: "Database connection failed" }, { status: 500 });
  } 
  
  let existingUser = await users.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    console.log("User with this email already exists:", email);
    return NextResponse.json( { message: "User with this email already exists" },{ status: 409 });
  }

  // .create() function automatically save the DB object formed...
  // creating an user instance with the provided information...
 let newUserDoc = new users({ 
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      encryptionSalt,
      userLocation: userLatestLocation || undefined,
    });

    let accessToken, refreshToken;
    try {
      accessToken = newUserDoc.generateAccessToken();
      refreshToken = newUserDoc.generateRefreshToken();
    } catch (err) {
      console.error("Error generating tokens:", err);
      return NextResponse.json({ message: "Token generation failed" }, { status: 500 });
    }
    newUserDoc.refreshToken = refreshToken;  // setting the refreshtoken in the database...
  try {
    await newUserDoc.save(); // saving the user data object...
    console.log("User successfully saved:", newUserDoc);
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ message: "Failed to save user" }, { status: 500 });
  }

  // dynamic cookies options 
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = `HttpOnly; Path=/; Secure=${isProduction}; SameSite=Lax`;

  return NextResponse.json(
    { message: "User registered successfully", userId: newUserDoc._id },
    {
      status: 201,
      headers: {
        "Set-Cookie": [
          `refreshToken=${refreshToken}; ${cookieOptions}`,
          `accessToken=${accessToken}; ${cookieOptions}`,
        ],
      },
    }
  );
});

export { POST };
