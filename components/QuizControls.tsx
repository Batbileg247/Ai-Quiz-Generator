import { Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizControlsProps {
  hasQuiz: boolean;
  generatingQuiz: boolean;
  onStart: () => void;
  onGenerate: () => void;
}

export function QuizControls({
  hasQuiz,
  generatingQuiz,
  onStart,
  onGenerate,
}: QuizControlsProps) {
  return (
    <div className="flex gap-2">
      {hasQuiz ? (
        <>
          <Button onClick={onStart} className="gap-2">
            <Brain className="h-4 w-4" />
            Start quiz
          </Button>
          <Button
            variant="outline"
            onClick={onGenerate}
            disabled={generatingQuiz}
          >
            {generatingQuiz ? "Generating..." : "New quiz"}
          </Button>
        </>
      ) : (
        <Button
          onClick={onGenerate}
          disabled={generatingQuiz}
          className="gap-2"
        >
          {generatingQuiz ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin" />
              Generating quiz...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              Generate quiz
            </>
          )}
        </Button>
      )}
    </div>
  );
}
