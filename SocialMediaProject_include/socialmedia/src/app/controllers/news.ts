import axios from "axios";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { NextRequest, NextResponse } from "next/server";

export const getNewsDataController = asyncErrorHandler(async (request: NextRequest) => {
  const { title = "technology" , category = "politics" , page } = await request.json();

  const apiKey = process.env.NEWSDATAIO_API_KEY;
  if (!apiKey) throw new Error("NEWS_API_KEY environment variable is missing...");

  const query = title.trim() ; // trimming the extra spaces...

  const normalizeQuery = (input: string) => {
    return input
    .replace(/-/g, " ")        // convert slug → words
    .replace(/\s+/g, " ")      // remove extra spaces
    .trim();
  };
  
  const normalizedCategory = category.toLowerCase() ; // Normalize category to valid lowercase

  const params: Record<string, string> = { apikey: apiKey, language: "en" };
  if (page.trim()) params.page = page ;
  
  if (query) { 
    params.q = normalizeQuery(query) ;
  } else {
    params.category = normalizedCategory;
}
  const searchParams = new URLSearchParams(params) ;

  const url = `https://newsdata.io/api/1/news?${searchParams}`;
  console.log("FINAL URL >>>", url);

  const apiResponse = await axios.get(url); // hitting request to api url...
  
  const data = apiResponse.data;
  
  if (apiResponse.status !== 200 || !data || !data.results) {
    console.error("NewsAPI Error:", apiResponse.status, data);
    return NextResponse.json({ message: `News API failed: ${apiResponse.status}`, error: data, status: 'error' 
    }, { status: apiResponse.status || 500 });
  }

  return NextResponse.json({ success: true, status: data.status,totalResults: data.totalResults,results: data.results || [], nextPage: data.nextPage 
  },{ status: 200 });
});
