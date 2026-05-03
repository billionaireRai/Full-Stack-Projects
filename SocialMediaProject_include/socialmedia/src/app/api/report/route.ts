import { NextResponse , NextRequest } from "next/server";
import { generateReportForAccount } from "@/app/controllers/report";

export const POST = (request:NextRequest) : Promise<NextResponse> => {
    return generateReportForAccount(request) ;
}