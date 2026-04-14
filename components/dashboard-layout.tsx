"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Sparkles, PanelLeftClose, PanelLeftOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  createdAt: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  onSelectArticle?: (id: string) => void;
  selectedArticleId?: string;
}

export function DashboardLayout({
  children,
  onSelectArticle,
  selectedArticleId,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handler = () => fetchArticles();
    window.addEventListener("articles:refresh", handler);
    return () => window.removeEventListener("articles:refresh", handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className={cn(
          "flex flex-col border-r bg-card transition-all duration-200 ease-in-out flex-shrink-0",
          sidebarOpen ? "w-60" : "w-0 overflow-hidden border-r-0",
        )}
      >
        <div className="flex h-14 items-center justify-between px-4 border-b flex-shrink-0">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            Quiz app
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setSidebarOpen(false)}
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <Clock className="h-3 w-3" />
              History
            </div>
          </div>
          <ScrollArea className="flex-1 px-2">
            {articles.length === 0 ? (
              <p className="px-2 py-3 text-xs text-muted-foreground">
                No articles yet. Create your first one!
              </p>
            ) : (
              articles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => onSelectArticle?.(article.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors mb-0.5",
                    selectedArticleId === article.id
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <span className="line-clamp-2 leading-snug">
                    {article.title}
                  </span>
                </button>
              ))
            )}
          </ScrollArea>
        </div>
        <div className="border-t p-3 flex items-center justify-between flex-shrink-0">
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        {!sidebarOpen && (
          <div className="flex h-14 items-center gap-3 border-b px-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setSidebarOpen(true)}
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              Quiz app
            </div>
          </div>
        )}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
