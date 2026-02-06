import { UsernameForm } from "@/components/username-form";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-violet-50 via-rose-50 to-amber-50 dark:from-gray-950 dark:via-purple-950/30 dark:to-gray-950">
      {/* Decorative background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-pink-300/25 blur-3xl animate-pulse-soft stagger-2" />
        <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-orange-200/20 blur-3xl animate-pulse-soft stagger-4" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
        {/* Logo / Hero */}
        <div className="mb-10 text-center animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 shadow-lg shadow-purple-500/25 mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight gradient-text mb-3">
            VibeScan
          </h1>
          <p className="text-muted-foreground text-lg max-w-xs mx-auto leading-relaxed">
            AI-powered personality insights from Instagram photos
          </p>
        </div>

        {/* Form */}
        <div className="w-full animate-slide-up stagger-2">
          <UsernameForm />
        </div>

        {/* Footer hint */}
        <p className="mt-8 text-xs text-muted-foreground/60 text-center animate-fade-in stagger-4">
          Analyzes up to 10 public photos using GPT-4o vision
        </p>
      </div>
    </main>
  );
}
