import { NextRequest , NextResponse } from "next/server";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { generateReportInPDF } from "@/lib/accountreports";
import { getProfileDashboardAnalyticsService } from "../db/services/analytics";

export const runtime = "nodejs"; // for running the controller on node edge runtime...

export const generateReportForAccount = asyncErrorHandler( async (request:NextRequest) => { 
    const { timeframe , handle , year , type } = await request.json() ;

    if (!timeframe?.trim() || !handle?.trim() || isNaN(Number(year)) || !type?.trim()) {
        console.log("One OR More neccessary credentials missing !!");
        return NextResponse.json({ message:"Check incoming credentials..." },{ status:404 });
    }

        const reportData = await getProfileDashboardAnalyticsService(handle,timeframe,year);
       const pdfBuffer = await generateReportInPDF(reportData);

    // converting array buffer into Uint8Array...
    const uint8Array = new Uint8Array(pdfBuffer);
    
    const arrayBuffer = uint8Array.buffer.slice(
      uint8Array.byteOffset,
      uint8Array.byteOffset + uint8Array.byteLength
    ) as ArrayBuffer;
    
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment"`,
      },
    });

})
