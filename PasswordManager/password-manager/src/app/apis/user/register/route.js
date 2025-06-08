import { NextResponse } from "next/server";
import { connectWithMongoDB } from "@/db/dbConnection";
import asyncErrorHandler from "@/middlewares/errorMiddleware";
import users from "@/db/models/userModel.js";

const POST = asyncErrorHandler(async (request) => {
    const { name, email, salt, password, confirmPassword } = await request.json();
    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" },{ status: 400 });
    }
    await connectWithMongoDB(); // Connect to MongoDB
    // Check if user already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser)  return NextResponse.json({ message: "User with this email already exists" },{ status: 409 });

    // Validate salt is a number and generate encryptionSalt
    const encryptionSalt = Number(salt); // to be stored in the DB...
    if (isNaN(encryptionSalt))  return NextResponse.json({ message: "Invalid salt value" },{ status: 400 });

    // Create new user document
    const newUserDoc = await users.create({ name: name.trim(),email: email.toLowerCase().trim(),password,encryptionSalt });
    // calling user defined methods of user model...
    const accessToken = newUserDoc.generateAccessToken() ;
    const refreshToken = newUserDoc.generateRefreshToken() ;
    newUserDoc.refreshToken = refreshToken;
    await newUserDoc.save();  // Saving user in our database...
    // Return success response without password and salt
    return NextResponse.json(
      { message: "User registered successfully", userId: newUserDoc._id },
      {
        status: 201,
        headers: {
          "Set-Cookie": [
            `refreshToken=${refreshToken}; HttpOnly; Path=/; Secure=false; SameSite=Lax`,
            `accessToken=${accessToken}; HttpOnly; Path=/; Secure=false; SameSite=Lax`
          ]
        }
      }
    )
});

export { POST };
