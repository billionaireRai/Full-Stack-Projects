import asyncErrorHandler from "@/middlewares/errorMiddleware";
import { cookies } from "next/headers";
import { connectWithMongoDB } from "@/db/dbConnection";
import { NextResponse } from "next/server";
import { decodeGivenJWT } from "@/lib/decodejwt";

const POST = asyncErrorHandler( async (request) => {
    console.log("Route handler for getting all vaults !!");

    // cookies related logic...
    const allCookies = await cookies() ;
    const accessToken = allCookies.get('accessToken').value ;
    const decodedUser = decodeGivenJWT(accessToken, process.env.SECRET_FOR_ACCESS_TOKEN);
    // taking some debugging steps...
    if (!decodedUser || !decodedUser.id) {
        console.log("Invalid access token");
        return new NextResponse("Invalid access token", { status: 401 });
    }

    await connectWithMongoDB(); // establishing the connection to DB..
})

export { POST };