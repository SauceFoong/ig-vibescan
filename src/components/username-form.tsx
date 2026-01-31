"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export function UsernameForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [startYear, setStartYear] = useState(String(currentYear - 1));
  const [endYear, setEndYear] = useState(String(currentYear));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate username
    const cleanUsername = username.replace(/^@/, "").trim();
    if (!cleanUsername) {
      setError("Please enter an Instagram username");
      return;
    }

    // Validate year range
    if (parseInt(startYear) > parseInt(endYear)) {
      setError("Start year cannot be after end year");
      return;
    }

    setIsLoading(true);

    try {
      // Navigate to results page with query params
      const params = new URLSearchParams({
        username: cleanUsername,
        startYear,
        endYear,
      });
      router.push(`/results?${params.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">VibeScan</CardTitle>
        <CardDescription>
          Analyze any public Instagram profile to discover personality traits,
          interests, and MBTI type
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Instagram Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="@username or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startYear">From Year</Label>
              <Select
                value={startYear}
                onValueChange={setStartYear}
                disabled={isLoading}
              >
                <SelectTrigger id="startYear">
                  <SelectValue placeholder="Start Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endYear">To Year</Label>
              <Select
                value={endYear}
                onValueChange={setEndYear}
                disabled={isLoading}
              >
                <SelectTrigger id="endYear">
                  <SelectValue placeholder="End Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Analyze Profile"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Maximum 20 posts will be analyzed from the selected date range
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
