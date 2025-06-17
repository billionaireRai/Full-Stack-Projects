import { NextResponse } from "next/server";
import { connectWithMongoDB } from "@/db/dbConnection";
import asyncErrorHandler from "@/middlewares/errorMiddleware";
import users from "@/db/models/userModel.js";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";
import { isSpoofedBot } from "@arcjet/inspect";

// Create an Arcjet instance for protection configuration
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"], // Track requests by user IP
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: ["CATEGORY:SEARCH_ENGINE"] }),
    tokenBucket({ mode: "LIVE", refillRate: 5, interval: 10, capacity: 10 }),
  ],
});

// Route handler for login logic
const POST = asyncErrorHandler(async (request) => {
  console.log("Login API called");

  // Apply Arcjet protection and handle decision
  const decision = await aj.protect(request, { requested: 5 });
  const reason = decision.reason;

  if (decision.isDenied()) {
    if (reason.isRateLimit()) {
      console.log("Request denied: Too Many Requests");
      return NextResponse.json(
        { error: "Too Many Requests", reason },
        { status: 429 }
      );
    } else if (reason.isBot()) {
      console.log("Request denied: Bot detected");
      return NextResponse.json(
        { error: "No bots allowed", reason },
        { status: 403 }
      );
    } else {
      console.log("Request denied: Forbidden");
      return NextResponse.json({ error: "Forbidden", reason }, { status: 403 });
    }
  }

  if (decision.results.some(isSpoofedBot)) {
    console.log("Request denied: Spoofed bot detected");
    return NextResponse.json({ error: "Forbidden", reason }, { status: 403 });
  }

  // Parse request body and validate input
  const { email, password } = await request.json();
  if (!email || !password) {
    console.log("Missing email or password in request");
    return NextResponse.json({ error: "Email and password both are required" },{ status: 400 });
  }

  await connectWithMongoDB(); // Ensure MongoDB connection is established...

  // Find user by email
  const userGettingChecked = await users.findOne({ email }).select('+password');
  if (!userGettingChecked) {
    console.log("User does not exist in DB");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Validate password by predefiend schema method...
  const passwordCheck = await userGettingChecked.isPasswordValid(password);
  if (!passwordCheck) {
    console.log("Invalid password entered");
    return NextResponse.json({ error: "Invalid password, enter correct one" },{ status: 401 });
  }

  // Generate tokens and save refresh token
  const accessToken = userGettingChecked.generateAccessToken();
  const refreshToken = userGettingChecked.generateRefreshToken();
  userGettingChecked.refreshToken = refreshToken;
  await userGettingChecked.save();

  // Set cookie flags based on environment...
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = `HttpOnly; Path=/; Secure=${isProduction}; SameSite=Lax`;

  return NextResponse.json(
    { message: "Login Successful", userId: userGettingChecked._id },
    {
      status: 200,
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
