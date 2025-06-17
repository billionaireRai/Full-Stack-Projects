import asyncErrorHandler from "@/middlewares/errorMiddleware";
import { connectWithMongoDB } from "@/db/dbConnection";
import users from "@/db/models/userModel";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const POST = asyncErrorHandler( async (request) => {
    const { method } = await request.json() ; // destructuring the method by which request is made...
    console.log("METHOD :",method);

    await connectWithMongoDB() ; // establishing the connetions...
    // getting userId from the previous refresh Token...
    const cookieStore = await cookies() ;
    const previousRefreshToken = cookieStore.get('refreshToken') ; // await is required to access the cookieStore...
    if (!previousRefreshToken) {
        console.log("No refresh token cookie found.");
        return NextResponse.json({ message: "User Not Found" }, { status: 401 });
    }
    const requiredUser = await users.findOne({ refreshToken: previousRefreshToken.value }); // cookie object for each cookie contains value which is required data ...
    if(!requiredUser){
        console.log("You have to LOGIN or REGISTER once...");
        return NextResponse.json({message:"User Not Found"}, { status: 401 });
    }

    // actual logic for generating new tokens...
    const accessToken = requiredUser.generateAccessToken() ;
    const refreshToken = requiredUser.generateRefreshToken() ;
    // updating the user with new refresh token...
    await users.updateOne({refreshToken:previousRefreshToken.value},{refreshToken:refreshToken});
    // setting new tokens to cookies...
    // Set cookie flags based on environment...
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = `HttpOnly; Path=/; Secure=${isProduction}; SameSite=Lax`;

  return NextResponse.json(
    { message: "New tokens successfully generated..." },
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

})

export { POST } ;