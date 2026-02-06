"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorDisplayProps {
  title?: string;
  message: string;
}

export function ErrorDisplay({ title = "Something went wrong", message }: ErrorDisplayProps) {
  return (
    <div className="glass rounded-2xl p-10 shadow-xl w-full max-w-md animate-slide-up">
      <div className="flex flex-col items-center space-y-6">
        {/* Error icon */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-red-400/20 blur-xl" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-red-100 to-red-50 dark:from-red-950/40 dark:to-red-900/20 border border-red-200 dark:border-red-800/40 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>

        {/* Error text */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            {message}
          </p>
        </div>

        {/* Action */}
        <Button
          asChild
          className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-purple-500/20"
        >
          <Link href="/">Try Again</Link>
        </Button>
      </div>
    </div>
  );
}
