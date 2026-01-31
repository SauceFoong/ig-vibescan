"use client";

import { PersonalityAnalysis } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AnalysisResultsProps {
  analysis: PersonalityAnalysis;
}

// MBTI type descriptions
const mbtiDescriptions: Record<string, string> = {
  INTJ: "The Architect - Imaginative and strategic thinkers",
  INTP: "The Logician - Innovative inventors with an unquenchable thirst for knowledge",
  ENTJ: "The Commander - Bold, imaginative and strong-willed leaders",
  ENTP: "The Debater - Smart and curious thinkers who cannot resist an intellectual challenge",
  INFJ: "The Advocate - Quiet and mystical, yet very inspiring and tireless idealists",
  INFP: "The Mediator - Poetic, kind and altruistic people, always eager to help a good cause",
  ENFJ: "The Protagonist - Charismatic and inspiring leaders, able to mesmerize their listeners",
  ENFP: "The Campaigner - Enthusiastic, creative and sociable free spirits",
  ISTJ: "The Logistician - Practical and fact-minded individuals",
  ISFJ: "The Defender - Very dedicated and warm protectors",
  ESTJ: "The Executive - Excellent administrators, unsurpassed at managing things or people",
  ESFJ: "The Consul - Extraordinarily caring, social and popular people",
  ISTP: "The Virtuoso - Bold and practical experimenters, masters of all kinds of tools",
  ISFP: "The Adventurer - Flexible and charming artists, always ready to explore and experience something new",
  ESTP: "The Entrepreneur - Smart, energetic and very perceptive people",
  ESFP: "The Entertainer - Spontaneous, energetic and enthusiastic people",
};

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const mbtiDescription = mbtiDescriptions[analysis.mbtiType] || "Unique personality type";

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">@{analysis.username}</CardTitle>
          <CardDescription>
            Analysis based on {analysis.photoCount} photos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            {analysis.overallSummary}
          </p>
        </CardContent>
      </Card>

      {/* MBTI Result */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
        <CardHeader className="text-center">
          <CardDescription>Predicted MBTI Type</CardDescription>
          <CardTitle className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            {analysis.mbtiType}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {mbtiDescription}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-center">{analysis.mbtiExplanation}</p>
        </CardContent>
      </Card>

      {/* Personality Traits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personality Traits</CardTitle>
          <CardDescription>Key characteristics observed from photos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analysis.personalityTraits.map((trait, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
              >
                {trait}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Interests & Hobbies</CardTitle>
          <CardDescription>What this person seems to enjoy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {analysis.interests.map((interest, index) => (
              <div
                key={index}
                className="p-3 bg-muted rounded-lg text-center text-sm font-medium"
              >
                {interest}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button asChild variant="outline">
          <Link href="/">Analyze Another Profile</Link>
        </Button>
      </div>
    </div>
  );
}
