import { NextRequest, NextResponse } from "next/server";
import { scrapeInstagramProfile } from "@/lib/apify";
import { ScrapeResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, startYear, endYear } = body;

    // Validate input
    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    if (!startYear || !endYear) {
      return NextResponse.json(
        { error: "Start year and end year are required" },
        { status: 400 }
      );
    }

    const start = parseInt(String(startYear));
    const end = parseInt(String(endYear));

    if (isNaN(start) || isNaN(end)) {
      return NextResponse.json(
        { error: "Invalid year format" },
        { status: 400 }
      );
    }

    if (start > end) {
      return NextResponse.json(
        { error: "Start year cannot be after end year" },
        { status: 400 }
      );
    }

    // Scrape Instagram profile
    const { posts, totalScraped, profilePicUrl } = await scrapeInstagramProfile(
      username,
      start,
      end
    );

    const response: ScrapeResponse = {
      posts,
      username: username.replace(/^@/, "").trim(),
      totalScraped,
      filteredCount: posts.length,
      profilePicUrl,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Scrape error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to scrape Instagram profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
