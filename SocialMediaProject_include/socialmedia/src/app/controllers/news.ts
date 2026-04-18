import axios from "axios";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { NextRequest, NextResponse } from "next/server";

export const getNewsDataController = asyncErrorHandler(async (request: NextRequest) => {
  const { title = "world", page = 1, category = "top" } = await request.json();

  const apiKey = process.env.NEWSDATAIO_API_KEY;
  if (!apiKey) throw new Error("NEWS_API_KEY environment variable is missing...");

  // const searchParams = new URLSearchParams({ apikey: apiKey, q: title.trim(), category, page: page.toString() });
  const searchParams = new URLSearchParams({ apikey: apiKey, q: title.trim()});
  const url = `https://newsdata.io/api/1/news?${searchParams}`;

    const apiResponse = await axios.get(url); // hitting request to api url...

    if (apiResponse.status !== 200) {
      console.error('NewsAPI Error:', apiResponse.status, apiResponse.data);
      return NextResponse.json({ message: `News API failed: ${apiResponse.status}`,error: apiResponse.data }, { status: apiResponse.status || 500 });
    }

    const data = apiResponse.data ;
    console.log(data);
    // if (!data || !data.results)  return NextResponse.json({ message: 'Invalid API response structure' }, { status: 500 });

    return NextResponse.json({ success: true, results: data.results , nextPage:data.nextPage },{ status:200 });
});
