import { mediaType } from '@/components/mediapopmodal';
import OpenAI from 'openai';

interface categoryAndKeywordType {
  category: string;
  keywords: string[];
}

// OpenAI client instance...
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



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

    return JSON.parse(text) as categoryAndKeywordType;
    
  } catch (err) {
    console.error('OpenAI Error:', err);
    throw err;
  }
}


  // OpenAI model mapping
  // Caption generation - OpenAI: best text model (gpt-4o-mini used elsewhere)
  // Category generation - OpenAI: fast/cheap (gpt-4o-mini)
  // Keyword generation - OpenAI: fast/cheap (gpt-4o-mini)
  // Hashtag generation - OpenAI: fast/cheap (gpt-4o-mini)
  // Content moderation - OpenAI: fast/cheap (gpt-4o-mini)
  // AI rewrite / improve caption - OpenAI: best text model (gpt-4o-mini or upgrade if needed)
