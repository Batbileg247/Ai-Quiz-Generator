import { CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QuizHeader } from "./QuizHeader"
import type { Question } from "@/types"

interface Props {
  questions: Question[]
  answers: Record<number, number>
  generatingQuiz: boolean
  onRetake: () => void
  onNewQuiz: () => void
  onClose: () => void
}

const scoreMessage = (score: number, total: number) => {
  if (score === total) return "Perfect score! 🎉"
  if (score >= total / 2) return "Good job!"
  return "Keep practicing!"
}

export function QuizResult({ questions, answers, generatingQuiz, onRetake, onNewQuiz, onClose }: Props) {
  const score = questions.filter((q, i) => answers[i] === q.correctAnswer).length

  return (
    <Card>
      <QuizHeader title="Results" onClose={onClose} />
      <CardContent className="space-y-4">
        <div className="text-center py-4 space-y-2">
          <p className="text-4xl font-semibold">
            {score} <span className="text-muted-foreground text-2xl">/ {questions.length}</span>
          </p>
          <p className="text-sm text-muted-foreground">{scoreMessage(score, questions.length)}</p>
        </div>

        <div className="space-y-2">
          {questions.map((q, i) => (
            <div key={q.id} className="flex items-start gap-2 text-sm">
              {answers[i] === q.correctAnswer
                ? <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                : <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />}
              <div>
                <p className="font-medium">{q.questionText}</p>
                {answers[i] !== q.correctAnswer && (
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Correct: <span className="text-green-700 dark:text-green-400">{q.options[q.correctAnswer]}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={onRetake}>Retake</Button>
          <Button size="sm" onClick={onNewQuiz} disabled={generatingQuiz}>
            {generatingQuiz ? "Generating..." : "New quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
