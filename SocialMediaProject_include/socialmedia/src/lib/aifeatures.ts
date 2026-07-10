import { mediaType } from '@/components/mediapopmodal';
import { GoogleGenAI } from "@google/genai";
interface categoryAndKeywordType {
  category: string;
  keywords: string[];
}

// making instance of gemini..
const geminiAiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// function for generating category and keywords of post...
export async function generateCategoryAndKeywords(postContent: string,mediaArr: mediaType[]): Promise<categoryAndKeywordType> {
  try {
  const geminires = await geminiAiClient.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `You are an AI content classification assistant.
            Task:
            - Analyze the given social media post caption.
            - Identify the single most relevant post category.
            - Generate exactly 20 unique one-word keywords.
            - Keywords should be lowercase.
            - Do not use hashtags (#).
            - Do not generate phrases or sentences.
            - Do not repeat keywords.
            - media information may not be present.
            - keyword should be SEO-friendly and searchable not random.
            - Return ONLY valid JSON in the following format:
            {
              "category": "string",
              "keywords": ["string", "string", "..."]
            }

            Caption: ${postContent}`,
          },
        ],
      },
    ],
  });

  const text = (geminires as any)?.response?.text?.() ?? (geminires as any)?.text;

  return JSON.parse(text) as categoryAndKeywordType;
  } catch (err) {
    console.error("Gemini Error:", err);
    throw err;
  }
}

// Task - Recommended Gemini Model (Cost Optimized)

// Caption generation - Gemini 2.5 Flash
// Category generation - Gemini 2.5 Flash-Lite
// Keyword generation - Gemini 2.5 Flash-Lite
// Hashtag generation - Gemini 2.5 Flash-Lite
// Content moderation - Gemini 2.5 Flash-Lite
// AI rewrite / improve caption - Gemini 2.5 Flash
