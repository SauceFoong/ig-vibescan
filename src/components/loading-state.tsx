"use client";

import { Card, CardContent } from "@/components/ui/card";

interface LoadingStateProps {
  stage: "scraping" | "analyzing" | "complete";
  username: string;
}

export function LoadingState({ stage, username }: LoadingStateProps) {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Animated spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-muted rounded-full" />
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">
              {stage === "scraping" && "Scanning Profile..."}
              {stage === "analyzing" && "Analyzing Photos..."}
              {stage === "complete" && "Almost Done!"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {stage === "scraping" && (
                <>Fetching posts from @{username}</>
              )}
              {stage === "analyzing" && (
                <>AI is analyzing the photos to determine personality</>
              )}
              {stage === "complete" && (
                <>Preparing your results</>
              )}
            </p>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-2 pt-4">
            <Step
              label="Fetch"
              active={stage === "scraping"}
              complete={stage !== "scraping"}
            />
            <div className="w-8 h-0.5 bg-muted" />
            <Step
              label="Analyze"
              active={stage === "analyzing"}
              complete={stage === "complete"}
            />
            <div className="w-8 h-0.5 bg-muted" />
            <Step label="Results" active={stage === "complete"} complete={false} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Step({
  label,
  active,
  complete,
}: {
  label: string;
  active: boolean;
  complete: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
          complete
            ? "bg-green-500 text-white"
            : active
            ? "bg-purple-500 text-white"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {complete ? "✓" : active ? "..." : "○"}
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
