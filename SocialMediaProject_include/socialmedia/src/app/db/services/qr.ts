import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import accounts from "../models/accounts";
import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";

interface VerifyQrServiceType {
  path: string;
  id: string;
  category: string;
  handle: string;
}

export const getVerifiedUrlForQRService = async ({ category, handle, id, path }: VerifyQrServiceType) => {
    await connectWithMongoDB();

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) throw new Error(user.message);

    // Verify user has an active account
    const myAccount = await accounts.findOne({ authorId: user.id , $and: [{ "account.status": "ACTIVE" }, { "account.Active": true }]});
    if (!myAccount) return NextResponse.json({ message:'No active account found' },{ status:400 });

    // Generate verified URL
    const generateUrl = () => {
      if (category === "post")  return `${path}/${handle}/${category}/${id}?section=Comments`;

      else if (category === "profile") return `${path}/${handle}`;

      else if (category === "register") return `${path}/auth/sign-up`;

      else if (category === "login") return `${path}/auth/log-in`;
      
      return NextResponse.json({ message:'Invalid category for QR' },{ status:200 }); 
    };

     return NextResponse.json({ message: "Url generated for QR..." , URL: generateUrl() },{ status:200 });
  }
