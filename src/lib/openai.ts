import OpenAI from "openai";
import { PersonalityAnalysis } from "@/types";

// Download image and convert to base64
async function imageUrlToBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status}`);
      return null;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    
    // Determine content type from response headers or URL
    const contentType = response.headers.get("content-type") || "image/jpeg";
    
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error(`Error converting image to base64:`, error);
    return null;
  }
}

export async function analyzePhotos(
  photoUrls: string[],
  username: string
): Promise<PersonalityAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  const openai = new OpenAI({ apiKey });

  // Download all images and convert to base64
  console.log(`Downloading ${photoUrls.length} images...`);
  const base64Results = await Promise.all(
    photoUrls.map((url) => imageUrlToBase64(url))
  );
  
  // Filter out failed downloads
  const validBase64Images = base64Results.filter((b64): b64 is string => b64 !== null);
  
  if (validBase64Images.length === 0) {
    throw new Error("Failed to download any images for analysis");
  }
  
  console.log(`Successfully downloaded ${validBase64Images.length} images`);

  // Prepare image content for GPT-4o-mini vision using base64
  const imageContent: OpenAI.Chat.ChatCompletionContentPart[] = validBase64Images.map(
    (base64Url) => ({
      type: "image_url" as const,
      image_url: {
        url: base64Url,
        detail: "low" as const, // Use low detail to reduce costs
      },
    })
  );

  const systemPrompt = `You are an expert personality analyst and psychologist. Analyze the provided Instagram photos to determine the person's personality traits, interests, and MBTI type.

Based on visual cues like:
- Activities shown in photos
- Aesthetic preferences and style
- Locations and environments
- Social interactions
- Hobbies and interests visible
- Overall mood and tone of photos

Provide your analysis in the following JSON format:
{
  "personalityTraits": ["trait1", "trait2", "trait3", "trait4", "trait5"],
  "interests": ["interest1", "interest2", "interest3", "interest4", "interest5"],
  "mbtiType": "XXXX",
  "mbtiExplanation": "Brief explanation of why this MBTI type fits based on the photos",
  "overallSummary": "A 2-3 sentence summary of this person's personality and lifestyle based on their photos"
}

Be insightful and specific. Base your analysis only on what you can observe in the photos.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze these ${validBase64Images.length} Instagram photos from @${username} and determine their personality traits, interests, and MBTI type. Respond with valid JSON only.`,
          },
          ...imageContent,
        ],
      },
    ],
    max_tokens: 1000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No response from OpenAI");
  }

  const parsed = JSON.parse(content);

  return {
    username,
    personalityTraits: parsed.personalityTraits || [],
    interests: parsed.interests || [],
    mbtiType: parsed.mbtiType || "Unknown",
    mbtiExplanation: parsed.mbtiExplanation || "",
    overallSummary: parsed.overallSummary || "",
    photoCount: validBase64Images.length,
  };
}
