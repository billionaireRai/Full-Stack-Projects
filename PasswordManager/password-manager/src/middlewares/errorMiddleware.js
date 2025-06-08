import { NextResponse } from "next/server";

/**
Async error handling middleware wrapper
 @param {Function} FUNCTION - async function to wrap
 @returns {Function} wrapped function with error handling
 */
export const asyncErrorHandler = (FUNCTION) => {
  return async (request, response) => {
    try {
      const result = await FUNCTION(request, response);
      return result || response; // return result if any, else original response
    } catch (error) {
      console.error("Error caught in asyncErrorHandler :", error);
      return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
  };
};

export default asyncErrorHandler ;
