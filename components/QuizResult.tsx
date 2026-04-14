import { CheckCircle2, Sparkles, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
}

interface QuizResultProps {
  questions: Question[];
  answers: Record<number, number>;
  generatingQuiz: boolean;
  onRetake: () => void;
  onNewQuiz: () => void;
  onClose: () => void;
}

export function QuizResult({
  questions,
  answers,
  generatingQuiz,
  onRetake,
  onNewQuiz,
  onClose,
}: QuizResultProps) {
  const total = questions.length;
  const score = questions.filter(
    (q, i) => answers[i] === q.correctAnswer,
  ).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Results</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center py-4 space-y-2">
          <p className="text-4xl font-semibold">
            {score}{" "}
            <span className="text-muted-foreground text-2xl">/ {total}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {score === total
              ? "Perfect score! 🎉"
              : score >= total / 2
                ? "Good job!"
                : "Keep practicing!"}
          </p>
        </div>

        <div className="space-y-2">
          {questions.map((q, i) => (
            <div key={q.id} className="flex items-start gap-2 text-sm">
              {answers[i] === q.correctAnswer ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">{q.questionText}</p>
                {answers[i] !== q.correctAnswer && (
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Correct answer:{" "}
                    <span className="text-green-700 dark:text-green-400">
                      {q.options[q.correctAnswer]}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={onRetake} variant="outline">
            Retake
          </Button>
          <Button size="sm" onClick={onNewQuiz} disabled={generatingQuiz}>
            {generatingQuiz ? "Generating..." : "New quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
