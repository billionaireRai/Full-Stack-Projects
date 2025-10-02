import { NextResponse } from "next/server";
import { connectWithMongoDB } from "@/db/dbConnection";
import asyncErrorHandler from "@/middlewares/errorMiddleware";
import bcrypt from "bcrypt";
import users from "@/db/models/userModel.js";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";
import { isSpoofedBot } from "@arcjet/inspect";
import jsonwebtoken from "jsonwebtoken";

// making an arcjet instance for protection configuration...
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"], // Tracking requests made by user by IP...
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: ["CATEGORY:SEARCH_ENGINE"] }),
    tokenBucket({ mode: "LIVE", refillRate: 5, interval: 10, capacity: 10 }),
  ],
});

const POST = asyncErrorHandler(async (request) => {
  console.log("Resetting API called");
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
  // actual resetting logic runs here...
  const { confirmPassword, newPassword, token } = await request.json(); // destructuring the required data...
  // validating the passwords coming...
  if (confirmPassword !== newPassword) {
    console.log("Password getting mismatch...");
    return NextResponse.json({ error: "Password mismatch", reason: "Password mismatch" }, { status: 400 });
  }
  // checking the existence of token..
  if (!token) {
    console.log("Token is missing");
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }
  // checking if the user exists or not from the token...
  const decodedToken = jsonwebtoken.verify(token, process.env.SECRET_KEY_FOR_PASSWORD_RESET, { ignoreExpiration: false });
  console.log("decoded token:", decodedToken);

  await connectWithMongoDB(); // establishing the connection to database...

  // hashing logic for password...
  const user = await users.findById(decodedToken.id);
  if (!user || !user.encryptionSalt) {
    console.log("User or encryptionSalt not found");
    return NextResponse.json({ error: "User or encryptionSalt not found" }, { status: 404 });
  }
  const userEncryptionSalt = user.encryptionSalt;
  const hashedPassword = await bcrypt.hash(newPassword, userEncryptionSalt);

  // updating the user password, relying on pre-save hook for hashing
  const updatedUser = await users.findByIdAndUpdate(
    decodedToken.id,
    { password: hashedPassword },
    { new: true }
  );
  if (!updatedUser) {
    console.log("User not found");
    return NextResponse.json({ error: "User of paticular ID not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
});

export { POST }; // exporting the route handler is necessary in nextjs configuration...
