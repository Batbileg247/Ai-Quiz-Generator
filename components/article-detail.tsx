"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  XCircle,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: string;
  questions: Question[];
}

interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  quizzes: Quiz[];
}

interface ArticleDetailProps {
  articleId: string;
  onBack: () => void;
}

export function ArticleDetail({ articleId, onBack }: ArticleDetailProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Quiz state
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/article/${articleId}`);
      if (res.ok) {
        const data = await res.json();
        setArticle(data);
        if (data.quizzes?.length > 0) {
          setActiveQuiz(data.quizzes[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true);
    try {
      const res = await fetch(`/api/article/${articleId}/quizzes`, {
        method: "POST",
      });
      if (res.ok) {
        const quiz = await res.json();
        setActiveQuiz(quiz);
        startQuiz();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const startQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers({});
    setShowResult(false);
    setQuizOpen(true);
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(optionIdx);
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIdx }));
  };

  const handleNext = () => {
    if (!activeQuiz) return;
    if (currentIndex < activeQuiz.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleClose = () => {
    setQuizOpen(false);
    setShowResult(false);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers({});
  };

  const getScore = () => {
    if (!activeQuiz) return 0;
    return activeQuiz.questions.filter((q, i) => answers[i] === q.correctAnswer)
      .length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Sparkles className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Article not found.
      </div>
    );
  }

  const currentQuestion = activeQuiz?.questions[currentIndex];
  const total = activeQuiz?.questions.length ?? 0;
  const score = getScore();

  return (
    <div className="space-y-4">
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-1">
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        New article
      </Button>

      {/* Summary card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{article.title}</CardTitle>
          <CardDescription className="text-xs uppercase tracking-wide font-medium">
            AI Summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{article.summary}</p>
        </CardContent>
      </Card>

      {/* Start quiz button */}
      {!quizOpen && (
        <div className="flex gap-2">
          {activeQuiz ? (
            <>
              <Button onClick={startQuiz} className="gap-2">
                <Brain className="h-4 w-4" />
                Start quiz
              </Button>
              <Button
                variant="outline"
                onClick={handleGenerateQuiz}
                disabled={generatingQuiz}
              >
                {generatingQuiz ? "Generating..." : "New quiz"}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleGenerateQuiz}
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
      )}

      {/* Quiz card — one question at a time */}
      {quizOpen && !showResult && currentQuestion && (
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
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Question */}
            <p className="text-sm font-medium leading-relaxed text-center py-2">
              {currentQuestion.questionText}
            </p>

            {/* 2x2 answer grid */}
            <div className="grid grid-cols-2 gap-2">
              {currentQuestion.options.map((opt, oi) => {
                const isSelected = selectedAnswer === oi;
                const isCorrect = oi === currentQuestion.correctAnswer;
                const isWrong =
                  selectedAnswer !== null && isSelected && !isCorrect;
                const showCorrect = selectedAnswer !== null && isCorrect;

                return (
                  <button
                    key={oi}
                    onClick={() => handleSelectAnswer(oi)}
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

            {/* Next button — appears after answering */}
            {selectedAnswer !== null && (
              <div className="flex justify-end pt-1">
                <Button size="sm" onClick={handleNext}>
                  {currentIndex < total - 1 ? "Next question" : "See results"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results card */}
      {quizOpen && showResult && (
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
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4 space-y-2">
              <p className="text-4xl font-semibold">
                {score}{" "}
                <span className="text-muted-foreground text-2xl">
                  / {total}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                {score === total
                  ? "Perfect score! 🎉"
                  : score >= total / 2
                    ? "Good job!"
                    : "Keep practicing!"}
              </p>
            </div>

            {/* Answer review */}
            <div className="space-y-2">
              {activeQuiz?.questions.map((q, i) => (
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
              <Button size="sm" onClick={startQuiz} variant="outline">
                Retake
              </Button>
              <Button
                size="sm"
                onClick={handleGenerateQuiz}
                disabled={generatingQuiz}
              >
                {generatingQuiz ? "Generating..." : "New quiz"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
