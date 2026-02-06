"use client";

import { useState } from "react";
import { PersonalityAnalysis } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AnalysisResultsProps {
  analysis: PersonalityAnalysis;
  photoUrls?: string[];
  profilePicUrl?: string | null;
}

const mbtiDescriptions: Record<string, string> = {
  INTJ: "The Architect — Imaginative and strategic thinkers",
  INTP: "The Logician — Innovative inventors with unquenchable curiosity",
  ENTJ: "The Commander — Bold, imaginative, strong-willed leaders",
  ENTP: "The Debater — Curious thinkers who love intellectual challenges",
  INFJ: "The Advocate — Quiet, mystical, inspiring idealists",
  INFP: "The Mediator — Poetic, kind, and altruistic souls",
  ENFJ: "The Protagonist — Charismatic and inspiring leaders",
  ENFP: "The Campaigner — Enthusiastic, creative free spirits",
  ISTJ: "The Logistician — Practical and fact-minded individuals",
  ISFJ: "The Defender — Dedicated and warm protectors",
  ESTJ: "The Executive — Excellent administrators and organizers",
  ESFJ: "The Consul — Extraordinarily caring and popular people",
  ISTP: "The Virtuoso — Bold and practical experimenters",
  ISFP: "The Adventurer — Flexible and charming artists",
  ESTP: "The Entrepreneur — Smart, energetic, perceptive people",
  ESFP: "The Entertainer — Spontaneous and enthusiastic people",
};

const traitColors = [
  "from-purple-500 to-violet-500",
  "from-pink-500 to-rose-500",
  "from-orange-500 to-amber-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-green-500",
  "from-fuchsia-500 to-purple-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-yellow-500",
];

const interestIcons = [
  "🎨", "🎵", "📸", "✈️", "🏋️", "📚", "🍳", "🌿",
  "💻", "🎮", "🧘", "⚽", "🎭", "🏔️", "🎬", "🐾",
];

export function AnalysisResults({ analysis, photoUrls = [], profilePicUrl }: AnalysisResultsProps) {
  const mbtiDescription = mbtiDescriptions[analysis.mbtiType] || "A unique personality type";
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [profilePicFailed, setProfilePicFailed] = useState(false);

  return (
    <div className="w-full max-w-2xl space-y-6 animate-fade-in">
      {/* Profile header card */}
      <div className="glass rounded-2xl p-8 shadow-xl shadow-purple-500/5 text-center animate-slide-up">
        {/* Profile avatar */}
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[3px] shadow-lg shadow-purple-500/25 mb-4">
          {profilePicUrl && !profilePicFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/api/image-proxy?url=${encodeURIComponent(profilePicUrl)}`}
              alt={`@${analysis.username}`}
              className="w-full h-full rounded-full object-cover"
              onError={() => setProfilePicFailed(true)}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {analysis.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-1">@{analysis.username}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Based on {analysis.photoCount} photos
        </p>
        <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
          {analysis.overallSummary}
        </p>
      </div>

      {/* MBTI hero card */}
      <div className="relative overflow-hidden rounded-2xl animate-slide-up stagger-1">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent)]" />
        <div className="relative p-10 text-center text-white">
          <p className="text-sm font-medium uppercase tracking-widest opacity-80 mb-3">
            Your Personality Type
          </p>
          <h3 className="text-6xl sm:text-7xl font-black tracking-tight mb-2">
            {analysis.mbtiType}
          </h3>
          <p className="text-lg font-medium opacity-90 mb-4">
            {mbtiDescription}
          </p>
          <div className="max-w-md mx-auto">
            <p className="text-sm opacity-80 leading-relaxed">
              {analysis.mbtiExplanation}
            </p>
          </div>
        </div>
      </div>

      {/* Personality traits */}
      <div className="glass rounded-2xl p-8 shadow-xl shadow-purple-500/5 animate-slide-up stagger-2">
        <div className="mb-5">
          <h3 className="text-lg font-semibold">Personality Traits</h3>
          <p className="text-sm text-muted-foreground">Key characteristics observed from photos</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {analysis.personalityTraits.map((trait, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${traitColors[index % traitColors.length]} shadow-sm`}
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Interests & Hobbies */}
      <div className="glass rounded-2xl p-8 shadow-xl shadow-purple-500/5 animate-slide-up stagger-3">
        <div className="mb-5">
          <h3 className="text-lg font-semibold">Interests & Hobbies</h3>
          <p className="text-sm text-muted-foreground">What this person seems to enjoy</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {analysis.interests.map((interest, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 p-3.5 rounded-xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 hover:scale-[1.02] transition-transform"
            >
              <span className="text-lg">{interestIcons[index % interestIcons.length]}</span>
              <span className="text-sm font-medium">{interest}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Analyzed Photos */}
      {photoUrls.length > 0 && (
        <div className="glass rounded-2xl p-8 shadow-xl shadow-purple-500/5 animate-slide-up stagger-4">
          <div className="mb-5">
            <h3 className="text-lg font-semibold">Photos Analyzed</h3>
            <p className="text-sm text-muted-foreground">
              The {photoUrls.length} photos used for this personality reading
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {photoUrls.map((url, index) => (
              !failedImages.has(index) && (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden bg-muted group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/image-proxy?url=${encodeURIComponent(url)}`}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    onError={() =>
                      setFailedImages((prev) => new Set(prev).add(index))
                    }
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-1 right-1.5 text-[10px] font-semibold text-white/80 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow">
                    {index + 1}
                  </span>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Action */}
      <div className="flex justify-center pt-2 animate-slide-up stagger-5">
        <Button
          asChild
          variant="outline"
          className="h-11 px-8 rounded-full border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
        >
          <Link href="/">Analyze Another Profile</Link>
        </Button>
      </div>
    </div>
  );
}
