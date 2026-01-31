"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorDisplayProps {
  title?: string;
  message: string;
}

export function ErrorDisplay({ title = "Error", message }: ErrorDisplayProps) {
  return (
    <Card className="w-full max-w-md border-red-200 dark:border-red-800">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <CardTitle className="text-red-600 dark:text-red-400">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground text-sm">{message}</p>
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/">Try Again</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
