"use client"

import { useState } from "react"
import { Sparkles, FileText, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"

interface Props {
  onCreated: (articleId: string) => void
}

export function ArticleForm({ onCreated }: Props) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) return setError("Please fill in both fields.")
    setError(null)
    setLoading(true)
    try {
      const data = await api.createArticle(title, content)
      onCreated(data.articleId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-xl">Article Quiz Generator</CardTitle>
        </div>
        <CardDescription>
          Paste your article to generate a summary and quiz. Articles are saved in the sidebar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-1.5 text-sm">
            <Type className="h-3.5 w-3.5 text-muted-foreground" /> Article Title
          </Label>
          <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a title..." disabled={loading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content" className="flex items-center gap-1.5 text-sm">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" /> Article Content
          </Label>
          <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Paste your article here..." className="min-h-[180px] resize-none" disabled={loading} />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={loading || !title || !content}>
            {loading ? <><Sparkles className="mr-2 h-4 w-4 animate-spin" /> Generating summary...</> : "Generate summary"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
