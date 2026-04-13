import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Brain } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Sparkles className="h-4 w-4" />
            Quiz app
          </div>
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Gemini AI
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Turn any article into an interactive quiz
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Paste an article, get an AI-generated summary, then test your
            comprehension with a custom quiz. Learn more, remember more.
          </p>
          <div className="flex items-center justify-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Get started free
                  </span>
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Go to dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            {[
              {
                icon: BookOpen,
                title: "Smart summaries",
                desc: "Condense long articles into clear takeaways",
              },
              {
                icon: Brain,
                title: "AI quizzes",
                desc: "Auto-generate 5 questions from any content",
              },
              {
                icon: Sparkles,
                title: "Track history",
                desc: "Revisit all your past articles and quizzes",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="text-left p-4 rounded-lg border bg-card space-y-2"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
