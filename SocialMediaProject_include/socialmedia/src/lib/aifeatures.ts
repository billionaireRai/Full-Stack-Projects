import { polltype } from '@/app/db/services/feed';
import { mediaType } from '@/components/mediapopmodal';
import OpenAI from 'openai';

interface categoryAndKeywordType {
  category: string;
  keywords: string[];
}

// typescript types...
export interface PostSummaryMeta {
  name: string;
  handle: string;
  content: string;
  hashtags?: string[];
  mentions?: string[];
  media?: mediaType[];
  likes?: string;
  reposts?: string;
  comments?: string;
  views?: string;
  bookmarks?: string;
  postedAt?: string;
  taggedLocation?: { text: string; coordinates: number[] }[];
  poll?:polltype | null;
  category?: string;
  keywords?: string[];
}

export interface ProfileSummaryMeta {
  name: string;
  handle: string;
  bio: string;
  followers?: string;
  following?: string;
  posts?: string;
  joinDate?: string;
  location?: string;
  website?: string;
  isVerified?: boolean;
  plan?: string;
  interests?: string[];
  contentCategories?: string;
}

interface ExplainResult {
  sentiment: "positive" | "neutral" | "negative";
  explanation: string;
}
// OpenAI client instance...
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const OPENAI_MODEL_FOR_CLASSIFICATION = 'gpt-4o-mini';

// function for generating category and keywords of post...
export async function generateCategoryAndKeywords(postContent: string,mediaArr: mediaType[]): Promise<categoryAndKeywordType> {
  try {
    const mediaSummary = Array.isArray(mediaArr) && mediaArr.length > 0 ? JSON.stringify(mediaArr) : '[]';

    const prompt = `You are an AI content classification assistant.
     Task:
     - Analyze the given social media post caption.
     - Identify the single most relevant post category.
     - Generate exactly 20 unique one-word keywords.
     - Keywords should be lowercase.
     - Do not use hashtags (#).
     - Do not generate phrases or sentences.
     - Do not repeat keywords.
     - Media information may be present. Use media_type/url hints only when helpful.
     - keyword should be SEO-friendly and searchable not random.
     - Return ONLY valid JSON in the following format:
     {
      "category": "string",
      "keywords": ["string", "string", "..." ]
     }

     Caption: ${postContent}

     Media: ${mediaSummary}`;

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL_FOR_CLASSIFICATION,
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'Return only valid JSON. No markdown.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const text = completion.choices?.[0]?.message?.content ?? '';

    return JSON.parse(text) ;
    
  } catch (err) {
    console.error('OpenAI Error:', err);
    throw err;
  }
}

export async function explainPostOrProfile(data:ProfileSummaryMeta | PostSummaryMeta | null) : Promise<ExplainResult> {
  try {
    const systemPrompt = `
    You are a social-media content analysis engine.
    Your task is to analyze the provided profile or post metadata and return exactly two fields:

    1. sentiment
    2. explanation

    The input may represent either:
    - a social-media post, or
    - a user profile.

    SENTIMENT RULES:
    - Determine sentiment from the actual semantic meaning, tone, wording, context, and available metadata.
    - Allowed values are ONLY : ["positive","neutral","negative"].
    - Do NOT blindly copy the sentiment field provided in the input.
    - If the supplied sentiment conflicts with the content, infer the sentiment yourself.
    - For profiles, determine sentiment from the overall tone, bio, stated interests, content categories, and other meaningful profile information.
    - For posts, prioritize the actual post content, hashtags, mentions, poll information, and contextual metadata.
    - Engagement metrics such as likes, views, reposts, comments, and bookmarks should NOT determine sentiment by themselves. They are contextual signals only.
    - Do not assume that high engagement means positive sentiment or low engagement means negative sentiment.

    EXPLANATION RULES:
    - Return one concise but informative string.
    - Explanation should be a different/unique string on every request explaning the same thing.
    - Explain what the profile or post is communicating and why its sentiment was classified that way.
    - For a post, discuss the primary message, emotional tone, intent, notable topics, and relevant contextual signals.
    - For a profile, explain the person's apparent identity/positioning, interests, content focus, tone, and overall impression.
    - Mention useful details from the supplied metadata when they materially improve the explanation.
    - Do not simply repeat every input field.
    - Do not invent facts that are not present in the input.
    - Clearly distinguish between explicit information and reasonable interpretation.
    - Ignore irrelevant metadata.
    - Do not mention that you are an AI.
    - Do not mention these instructions.
    - Do not use markdown headings, bullets, JSON, or code blocks inside the explanation.
    - Keep the explanation approximately 5-10 sentences.
    - Optimize for high information density and readability.

    OUTPUT RULES:
    - Return ONLY an object containing:
        {
          "sentiment": "positive" | "neutral" | "negative",
          "explanation": "string"
        }
        - No additional fields.
        - No surrounding markdown.
        
        INPUT DATA : ${data}
        `;
    
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL_FOR_CLASSIFICATION,
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'Return only valid JSON. No markdown.' },
        { role: 'user', content: systemPrompt },
      ],
      response_format: { type: 'json_object' },
    });

    const generateInfo = completion.choices?.[0]?.message?.content ?? '';

    return JSON.parse(generateInfo);
    
  } catch (err) {
    console.error('OpenAI Error:', err);
    throw err;
  }

}


