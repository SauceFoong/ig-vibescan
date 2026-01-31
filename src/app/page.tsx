import { UsernameForm } from "@/components/username-form";

export default function Home() {
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
      <UsernameForm />
    </main>
  );
}
