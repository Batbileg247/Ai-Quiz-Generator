"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizResult } from "./QuizResult";
import { QuizQuestion } from "./QuizQuestion";
import { QuizControls } from "./QuizControls";
import { ArticleCard } from "./ArticleCard";

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
        if (data.quizzes?.length > 0) setActiveQuiz(data.quizzes[0]);
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
    if (selectedAnswer !== null) return;
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

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-1">
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        New article
      </Button>

      <ArticleCard title={article.title} summary={article.summary} />

      {!quizOpen && (
        <QuizControls
          hasQuiz={!!activeQuiz}
          generatingQuiz={generatingQuiz}
          onStart={startQuiz}
          onGenerate={handleGenerateQuiz}
        />
      )}

      {quizOpen && !showResult && currentQuestion && (
        <QuizQuestion
          questionText={currentQuestion.questionText}
          options={currentQuestion.options}
          correctAnswer={currentQuestion.correctAnswer}
          currentIndex={currentIndex}
          total={total}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
          onNext={handleNext}
          onClose={handleClose}
        />
      )}

      {quizOpen && showResult && activeQuiz && (
        <QuizResult
          questions={activeQuiz.questions}
          answers={answers}
          generatingQuiz={generatingQuiz}
          onRetake={startQuiz}
          onNewQuiz={handleGenerateQuiz}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
