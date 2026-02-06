"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoadingState } from "@/components/loading-state";
import { AnalysisResults } from "@/components/analysis-results";
import { ErrorDisplay } from "@/components/error-display";
import { PersonalityAnalysis, ScrapeResponse, AnalysisResponse } from "@/types";
import Link from "next/link";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const username = searchParams.get("username");
  const startYear = searchParams.get("startYear");
  const endYear = searchParams.get("endYear");

  const [stage, setStage] = useState<"scraping" | "analyzing" | "complete">("scraping");
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!username || !startYear || !endYear) {
      router.push("/");
      return;
    }

    async function fetchAndAnalyze() {
      try {
        // Step 1: Scrape Instagram profile
        setStage("scraping");
        const scrapeResponse = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            startYear: parseInt(startYear!),
            endYear: parseInt(endYear!),
          }),
        });

        if (!scrapeResponse.ok) {
          const data = await scrapeResponse.json();
          throw new Error(data.error || "Failed to scrape profile");
        }

        const scrapeData: ScrapeResponse = await scrapeResponse.json();

        // Save profile pic URL
        if (scrapeData.profilePicUrl) {
          setProfilePicUrl(scrapeData.profilePicUrl);
        }

        if (scrapeData.posts.length === 0) {
          throw new Error(
            `No posts found for @${username} in the selected date range (${startYear}-${endYear})`
          );
        }

        // Extract photo URLs
        const photoUrls = scrapeData.posts
          .filter((post) => post.displayUrl)
          .map((post) => post.displayUrl);

        if (photoUrls.length === 0) {
          throw new Error("No photos found in the scraped posts");
        }

        // Save photo URLs for display
        setPhotoUrls(photoUrls);

        // Step 2: Analyze photos with OpenAI
        setStage("analyzing");
        const analyzeResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photoUrls,
            username: scrapeData.username,
          }),
        });

        if (!analyzeResponse.ok) {
          const data = await analyzeResponse.json();
          throw new Error(data.error || "Failed to analyze photos");
        }

        const analysisData: AnalysisResponse = await analyzeResponse.json();

        if (!analysisData.success || !analysisData.analysis) {
          throw new Error(analysisData.error || "Analysis failed");
        }

        // Step 3: Display results
        setStage("complete");
        setAnalysis(analysisData.analysis);
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    }

    fetchAndAnalyze();
  }, [username, startYear, endYear, router]);

  if (error) {
    return <ErrorDisplay title="Analysis Failed" message={error} />;
  }

  if (!analysis) {
    return <LoadingState stage={stage} username={username || ""} />;
  }

  return <AnalysisResults analysis={analysis} photoUrls={photoUrls} profilePicUrl={profilePicUrl} />;
}

export default function ResultsPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center p-4 py-12 overflow-hidden bg-gradient-to-br from-violet-50 via-rose-50 to-amber-50 dark:from-gray-950 dark:via-purple-950/30 dark:to-gray-950">
      {/* Decorative background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-pink-300/25 blur-3xl animate-pulse-soft stagger-2" />
        <div className="absolute top-1/2 right-1/4 h-64 w-64 rounded-full bg-orange-200/20 blur-3xl animate-pulse-soft stagger-4" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
        {/* Header */}
        <Link href="/" className="mb-8 text-center group">
          <div className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center shadow-md shadow-purple-500/20">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight gradient-text group-hover:opacity-80 transition-opacity">
              VibeScan
            </h1>
          </div>
        </Link>

        {/* Content */}
        <Suspense fallback={<LoadingState stage="scraping" username="" />}>
          <ResultsContent />
        </Suspense>
      </div>
    </main>
  );
}
