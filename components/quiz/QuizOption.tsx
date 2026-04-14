import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  option: string
  index: number
  selected: number | null
  correct: number
  onSelect: (i: number) => void
}

export function QuizOption({ option, index, selected, correct, onSelect }: Props) {
  const answered = selected !== null
  const isCorrect = index === correct
  const isWrong = answered && selected === index && !isCorrect
  const showCorrect = answered && isCorrect

  return (
    <button
      onClick={() => onSelect(index)}
      disabled={answered}
      className={cn(
        "flex items-center justify-center gap-2 px-4 py-3 rounded-md border text-sm text-center transition-colors",
        !answered && "hover:bg-accent hover:border-accent-foreground/20 cursor-pointer bg-background border-border",
        showCorrect && "bg-green-50 border-green-300 text-green-800 dark:bg-green-950 dark:border-green-700 dark:text-green-100",
        isWrong && "bg-red-50 border-red-300 text-red-800 dark:bg-red-950 dark:border-red-700 dark:text-red-100",
        !isWrong && !showCorrect && answered && selected === index && "bg-accent",
        selected !== index && answered && "opacity-50",
      )}
    >
      {showCorrect && <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-600" />}
      {isWrong && <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-red-500" />}
      {option}
    </button>
  )
}
