import { Brain, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  hasQuiz: boolean
  generating: boolean
  onStart: () => void
  onGenerate: () => void
}

export function QuizControls({ hasQuiz, generating, onStart, onGenerate }: Props) {
  if (hasQuiz) {
    return (
      <div className="flex gap-2">
        <Button onClick={onStart} className="gap-2">
          <Brain className="h-4 w-4" /> Start quiz
        </Button>
        <Button variant="outline" onClick={onGenerate} disabled={generating}>
          {generating ? "Generating..." : "New quiz"}
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={onGenerate} disabled={generating} className="gap-2">
      {generating ? <><Sparkles className="h-4 w-4 animate-spin" /> Generating quiz...</> : <><Brain className="h-4 w-4" /> Generate quiz</>}
    </Button>
  )
}
