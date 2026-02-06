import { NextRequest, NextResponse } from "next/server";
import { analyzePhotos } from "@/lib/openai";
import { AnalysisResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { photoUrls, username } = body;

    // Validate input
    if (!photoUrls || !Array.isArray(photoUrls) || photoUrls.length === 0) {
      return NextResponse.json(
        { error: "Photo URLs are required" },
        { status: 400 }
      );
    }

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Limit to 10 photos max
    const limitedUrls = photoUrls.slice(0, 10);

    // Analyze photos with OpenAI
    const analysis = await analyzePhotos(limitedUrls, username);

    const response: AnalysisResponse = {
      success: true,
      analysis,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Analysis error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to analyze photos";
    return NextResponse.json(
      { success: false, error: message } as AnalysisResponse,
      { status: 500 }
    );
  }
}
