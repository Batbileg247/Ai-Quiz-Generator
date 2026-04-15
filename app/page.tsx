import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Brain } from "lucide-react";
import { DashboardPage } from "@/components/Dashboard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Sparkles className="h-4 w-4" />
            Quiz app
          </div>
          <div className="flex items-center gap-3">
            <SignedOut></SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <SignedOut>
          <div className="flex min-h-screen items-center justify-center">
            <SignIn
              routing="hash"
              appearance={{
                elements: {
                  formButtonPrimary: "bg-slate-500 hover:bg-slate-600 text-sm",
                },
              }}
            />
          </div>
        </SignedOut>
        <SignedIn>
          <DashboardPage />
        </SignedIn>
      </main>
    </div>
  );
}
