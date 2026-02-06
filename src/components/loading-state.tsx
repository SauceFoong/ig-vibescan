"use client";

interface LoadingStateProps {
  stage: "scraping" | "analyzing" | "complete";
  username: string;
}

export function LoadingState({ stage, username }: LoadingStateProps) {
  const steps = [
    { key: "scraping", label: "Fetching", icon: "📡" },
    { key: "analyzing", label: "Analyzing", icon: "🧠" },
    { key: "complete", label: "Done", icon: "✨" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === stage);

  return (
    <div className="glass rounded-2xl p-10 shadow-xl shadow-purple-500/5 w-full max-w-md animate-fade-in">
      <div className="flex flex-col items-center space-y-8">
        {/* Animated orb */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 opacity-20 blur-xl animate-pulse-soft" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 opacity-30 blur-md animate-pulse-soft stagger-1" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-float">
            <span className="text-3xl">
              {stage === "scraping" && "📡"}
              {stage === "analyzing" && "🧠"}
              {stage === "complete" && "✨"}
            </span>
          </div>
        </div>

        {/* Status text */}
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-xl">
            {stage === "scraping" && "Scanning Profile"}
            {stage === "analyzing" && "Reading the Vibes"}
            {stage === "complete" && "Almost There!"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {stage === "scraping" && (
              <>Fetching recent photos from <span className="font-medium text-foreground">@{username}</span></>
            )}
            {stage === "analyzing" && (
              <>AI is studying the aesthetic and mood of each photo</>
            )}
            {stage === "complete" && (
              <>Putting your personality profile together</>
            )}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-3">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 transition-all duration-1000 ease-out"
              style={{
                width: stage === "scraping" ? "33%" : stage === "analyzing" ? "66%" : "95%",
              }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between">
            {steps.map((step, i) => (
              <div key={step.key} className="flex items-center gap-1.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                    i < currentIndex
                      ? "bg-green-500 text-white"
                      : i === currentIndex
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-110"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < currentIndex ? "✓" : i + 1}
                </div>
                <span className={`text-xs ${i === currentIndex ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
