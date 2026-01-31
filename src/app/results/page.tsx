"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoadingState } from "@/components/loading-state";
import { AnalysisResults } from "@/components/analysis-results";
import { ErrorDisplay } from "@/components/error-display";
import { PersonalityAnalysis, ScrapeResponse, AnalysisResponse } from "@/types";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const username = searchParams.get("username");
  const startYear = searchParams.get("startYear");
  const endYear = searchParams.get("endYear");

  const [stage, setStage] = useState<"scraping" | "analyzing" | "complete">("scraping");
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);

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

  // Show error state
  if (error) {
    return <ErrorDisplay title="Analysis Failed" message={error} />;
  }

  // Show loading state
  if (!analysis) {
    return <LoadingState stage={stage} username={username || ""} />;
  }

  // Show results
  return <AnalysisResults analysis={analysis} />;
}

export default function ResultsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
          VibeScan
        </h1>
        <p className="text-muted-foreground mt-2">
          Discover personality through Instagram
        </p>
      </div>
      <Suspense fallback={<LoadingState stage="scraping" username="" />}>
        <ResultsContent />
      </Suspense>
    </main>
  );
}
