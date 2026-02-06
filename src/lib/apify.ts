import { ApifyClient } from "apify-client";
import { InstagramPost } from "@/types";

const POSTS_ACTOR_ID = "louisdeconinck/instagram-profile-posts-scraper";
const PROFILE_ACTOR_ID = "apify/instagram-profile-scraper";
const MAX_POSTS_PER_PROFILE = 24; // Minimum allowed by Apify
const MAX_POSTS_LIMIT = 10; // Our hard limit

interface ProfileInfo {
  profilePicUrl?: string;
  profilePicUrlHD?: string;
}

export async function scrapeInstagramProfile(
  username: string,
  startYear: number,
  endYear: number
): Promise<{ posts: InstagramPost[]; totalScraped: number; profilePicUrl?: string }> {
  const token = process.env.APIFY_TOKEN;

  if (!token) {
    throw new Error("APIFY_TOKEN environment variable is not set");
  }

  const client = new ApifyClient({ token });

  // Clean username (remove @ if present)
  const cleanUsername = username.replace(/^@/, "").trim();

  // Step 1: Scrape posts first
  const postsRun = await client.actor(POSTS_ACTOR_ID).call({
    profiles: [cleanUsername],
    maxPostsPerProfile: MAX_POSTS_PER_PROFILE,
  });

  // Get the posts dataset items
  const { items } = await client.dataset(postsRun.defaultDatasetId).listItems();
  const allPosts = items as unknown as InstagramPost[];

  // Step 2: Fetch profile info (sequentially, after posts finish and free memory)
  let profilePicUrl: string | undefined;
  try {
    const profileRun = await client.actor(PROFILE_ACTOR_ID).call(
      { usernames: [cleanUsername] },
      { memory: 2048 } // Use lower memory to stay within free plan limits
    );
    const { items: profileItems } = await client
      .dataset(profileRun.defaultDatasetId)
      .listItems();
    const profile = profileItems[0] as unknown as ProfileInfo | undefined;
    profilePicUrl = profile?.profilePicUrlHD || profile?.profilePicUrl;
  } catch {
    // Silently ignore profile pic fetch errors — fallback to letter initial
  }

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
    profilePicUrl,
  };
}
