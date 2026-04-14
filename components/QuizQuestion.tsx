import { CheckCircle2, Sparkles, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  questionText: string;
  options: string[];
  correctAnswer: number;
  currentIndex: number;
  total: number;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  onNext: () => void;
  onClose: () => void;
}

export function QuizQuestion({
  questionText,
  options,
  correctAnswer,
  currentIndex,
  total,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  onClose,
}: QuizQuestionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Quick test</CardTitle>
            </div>
            <CardDescription>
              Take a quick test about your knowledge from your content
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {currentIndex + 1}
              </span>
              {" / "}
              {total}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm font-medium leading-relaxed text-center py-2">
          {questionText}
        </p>

        <div className="grid grid-cols-2 gap-2">
          {options.map((opt, oi) => {
            const isSelected = selectedAnswer === oi;
            const isCorrect = oi === correctAnswer;
            const isWrong = selectedAnswer !== null && isSelected && !isCorrect;
            const showCorrect = selectedAnswer !== null && isCorrect;

            return (
              <button
                key={oi}
                onClick={() => onSelectAnswer(oi)}
                disabled={selectedAnswer !== null}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-3 rounded-md border text-sm text-center transition-colors",
                  selectedAnswer === null &&
                    "hover:bg-accent hover:border-accent-foreground/20 cursor-pointer",
                  selectedAnswer === null && "bg-background border-border",
                  showCorrect &&
                    "bg-green-50 border-green-300 text-green-800 dark:bg-green-950 dark:border-green-700 dark:text-green-100",
                  isWrong &&
                    "bg-red-50 border-red-300 text-red-800 dark:bg-red-950 dark:border-red-700 dark:text-red-100",
                  isSelected &&
                    selectedAnswer !== null &&
                    !isWrong &&
                    !showCorrect &&
                    "bg-accent",
                  !isSelected && selectedAnswer !== null && "opacity-50",
                )}
              >
                {selectedAnswer !== null && showCorrect && (
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-600" />
                )}
                {selectedAnswer !== null && isWrong && (
                  <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-red-500" />
                )}
                {opt}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div className="flex justify-end pt-1">
            <Button size="sm" onClick={onNext}>
              {currentIndex < total - 1 ? "Next question" : "See results"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
