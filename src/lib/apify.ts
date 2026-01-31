import { ApifyClient } from "apify-client";
import { InstagramPost } from "@/types";

const ACTOR_ID = "louisdeconinck/instagram-profile-posts-scraper";
const MAX_POSTS_PER_PROFILE = 24; // Minimum allowed by Apify
const MAX_POSTS_LIMIT = 20; // Our hard limit

export async function scrapeInstagramProfile(
  username: string,
  startYear: number,
  endYear: number
): Promise<{ posts: InstagramPost[]; totalScraped: number }> {
  const token = process.env.APIFY_TOKEN;

  if (!token) {
    throw new Error("APIFY_TOKEN environment variable is not set");
  }

  const client = new ApifyClient({ token });

  // Clean username (remove @ if present)
  const cleanUsername = username.replace(/^@/, "").trim();

  // Run the actor
  const run = await client.actor(ACTOR_ID).call({
    profiles: [cleanUsername],
    maxPostsPerProfile: MAX_POSTS_PER_PROFILE,
  });

  // Get the dataset items
  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  const allPosts = items as unknown as InstagramPost[];

  // Calculate date range boundaries (Unix timestamps)
  const startTimestamp = new Date(`${startYear}-01-01T00:00:00Z`).getTime() / 1000;
  const endTimestamp = new Date(`${endYear}-12-31T23:59:59Z`).getTime() / 1000;

  // Filter posts by date range
  const filteredPosts = allPosts.filter((post) => {
    return post.timestamp >= startTimestamp && post.timestamp <= endTimestamp;
  });

  // Limit to MAX_POSTS_LIMIT
  const limitedPosts = filteredPosts.slice(0, MAX_POSTS_LIMIT);

  return {
    posts: limitedPosts,
    totalScraped: allPosts.length,
  };
}
