"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

    const cleanUsername = username.replace(/^@/, "").trim();
    if (!cleanUsername) {
      setError("Please enter an Instagram username");
      return;
    }

    if (parseInt(startYear) > parseInt(endYear)) {
      setError("Start year cannot be after end year");
      return;
    }

    setIsLoading(true);

    try {
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
    <div className="glass rounded-2xl p-8 shadow-xl shadow-purple-500/5 w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username input */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium">
            Instagram Username
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              @
            </span>
            <Input
              id="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="pl-8 h-11 bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 focus:border-purple-400 transition-colors"
            />
          </div>
        </div>

        {/* Year range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Date Range</Label>
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={startYear}
              onValueChange={setStartYear}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={endYear}
              onValueChange={setEndYear}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10">
                <SelectValue placeholder="To" />
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

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
            </svg>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/30 hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Scanning...
            </span>
          ) : (
            "Scan Vibes"
          )}
        </Button>

        <p className="text-xs text-muted-foreground/70 text-center">
          Up to 10 photos analyzed from the selected date range
        </p>
      </form>
    </div>
  );
}
