import { NextRequest } from "next/server";
import { gettingSearchedAccountController } from "@/app/controllers/user";

export async function GET(request: NextRequest) {
  return gettingSearchedAccountController(request);
}
