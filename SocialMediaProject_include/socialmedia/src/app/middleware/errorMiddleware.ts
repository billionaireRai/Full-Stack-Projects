import { NextResponse, NextRequest } from "next/server";

// info related to middleware...
/**
Async error handling middleware wrapper for api routes
 @param FUNCTION - api async function to get wrapped
 @returns wrapped function with error handling
 */

export const asyncErrorHandler = (FUNCTION : (request: NextRequest) => Promise<NextResponse>) => {
  return async (request: NextRequest) => {
    try {
      const result = await FUNCTION(request);
      return result;
    } catch (error) {
      console.error("Error caught in asyncErrorHandler :", error);
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
};

export default asyncErrorHandler;
