import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QuizHeader } from "./QuizHeader"
import { QuizOption } from "./QuizOption"
import type { Question } from "@/types"

interface Props {
  question: Question
  currentIndex: number
  total: number
  selected: number | null
  onSelect: (i: number) => void
  onNext: () => void
  onClose: () => void
}

export function QuizQuestion({ question, currentIndex, total, selected, onSelect, onNext, onClose }: Props) {
  return (
    <Card>
      <QuizHeader
        title="Quick test"
        description="Take a quick test about your knowledge from your content"
        progress={{ current: currentIndex + 1, total }}
        onClose={onClose}
      />
      <CardContent className="space-y-4">
        <p className="text-sm font-medium leading-relaxed text-center py-2">{question.questionText}</p>
        <div className="grid grid-cols-2 gap-2">
          {question.options.map((opt, i) => (
            <QuizOption
              key={i}
              option={opt}
              index={i}
              selected={selected}
              correct={question.correctAnswer}
              onSelect={onSelect}
            />
          ))}
        </div>
        {selected !== null && (
          <div className="flex justify-end pt-1">
            <Button size="sm" onClick={onNext}>
              {currentIndex < total - 1 ? "Next question" : "See results"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
