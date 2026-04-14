"use client"

import { useEffect, useState } from "react"
import { UserButton } from "@clerk/nextjs"
import { Sparkles, PanelLeftClose, PanelLeftOpen, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ArticleMeta } from "@/types"

interface Props {
  children: React.ReactNode
  onSelectArticle?: (id: string) => void
  selectedArticleId?: string
}

export function DashboardLayout({ children, onSelectArticle, selectedArticleId }: Props) {
  const [open, setOpen] = useState(true)
  const [articles, setArticles] = useState<ArticleMeta[]>([])

  async function fetchArticles() {
    const res = await fetch("/api/articles")
    if (res.ok) setArticles(await res.json())
  }

  useEffect(() => {
    fetchArticles()
    window.addEventListener("articles:refresh", fetchArticles)
    return () => window.removeEventListener("articles:refresh", fetchArticles)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "flex flex-col border-r bg-card transition-all duration-200 ease-in-out flex-shrink-0",
        open ? "w-60" : "w-0 overflow-hidden border-r-0",
      )}>
        <SidebarHeader onClose={() => setOpen(false)} />
        <ScrollArea className="flex-1 px-2 py-2">
          {articles.length === 0
            ? <p className="px-2 py-3 text-xs text-muted-foreground">No articles yet. Create your first one!</p>
            : articles.map(a => (
              <button
                key={a.id}
                onClick={() => onSelectArticle?.(a.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors mb-0.5",
                  selectedArticleId === a.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <span className="line-clamp-2 leading-snug">{a.title}</span>
              </button>
            ))}
        </ScrollArea>
        <div className="border-t p-3">
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {!open && (
          <div className="flex h-14 items-center gap-3 border-b px-4 flex-shrink-0">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(true)}>
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
            <Logo />
          </div>
        )}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

function SidebarHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-14 items-center justify-between px-4 border-b flex-shrink-0">
      <Logo />
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
        <PanelLeftClose className="h-4 w-4" />
      </Button>
    </div>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      <Sparkles className="h-4 w-4" /> Quiz app
    </div>
  )
}
