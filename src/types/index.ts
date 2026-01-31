export interface InstagramPost {
  id: string;
  username: string;
  shortcode: string;
  caption: string;
  timestamp: number;
  likes: number;
  comments: number;
  mediaType: string;
  displayUrl: string;
  thumbnailUrl: string;
  dimensions_width: number;
  dimensions_height: number;
  taggedUsers: TaggedUser[];
  commentsDisabled: boolean;
  pinned: boolean;
  locationName?: string;
}

export interface TaggedUser {
  fullName: string;
  profilePicUrl: string;
  username: string;
}

export interface ScrapeRequest {
  username: string;
  startYear: number;
  endYear: number;
}

export interface ScrapeResponse {
  posts: InstagramPost[];
  username: string;
  totalScraped: number;
  filteredCount: number;
}

export interface AnalysisRequest {
  photoUrls: string[];
  username: string;
}

export interface PersonalityAnalysis {
  username: string;
  personalityTraits: string[];
  interests: string[];
  mbtiType: string;
  mbtiExplanation: string;
  overallSummary: string;
  photoCount: number;
}

export interface AnalysisResponse {
  success: boolean;
  analysis?: PersonalityAnalysis;
  error?: string;
}
