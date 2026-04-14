"use client"

import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/components/article/ArticleCard"
import { QuizControls } from "@/components/quiz/QuizControls"
import { QuizQuestion } from "@/components/quiz/QuizQuestion"
import { QuizResult } from "@/components/quiz/QuizResult"
import { useArticle } from "@/hooks/useArticle"
import { useQuiz } from "@/hooks/useQuiz"

interface Props {
  articleId: string
  onBack: () => void
}

export function ArticleDetail({ articleId, onBack }: Props) {
  const { article, loading, activeQuiz, generatingQuiz, generateQuiz } = useArticle(articleId)
  const quiz = useQuiz(activeQuiz)

  if (loading) return <div className="flex justify-center py-16"><Sparkles className="h-5 w-5 animate-spin text-muted-foreground" /></div>
  if (!article) return <div className="text-center py-16 text-muted-foreground">Article not found.</div>

  async function handleGenerate() {
    await generateQuiz()
    quiz.start()
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-1">
        <ArrowLeft className="mr-1.5 h-4 w-4" /> New article
      </Button>

      <ArticleCard title={article.title} summary={article.summary} />

      {!quiz.open && (
        <QuizControls
          hasQuiz={!!activeQuiz}
          generating={generatingQuiz}
          onStart={quiz.start}
          onGenerate={handleGenerate}
        />
      )}

      {quiz.open && !quiz.showResult && quiz.currentQuestion && (
        <QuizQuestion
          question={quiz.currentQuestion}
          currentIndex={quiz.index}
          total={quiz.total}
          selected={quiz.selected}
          onSelect={quiz.selectAnswer}
          onNext={quiz.next}
          onClose={quiz.close}
        />
      )}

      {quiz.open && quiz.showResult && activeQuiz && (
        <QuizResult
          questions={activeQuiz.questions}
          answers={quiz.answers}
          generatingQuiz={generatingQuiz}
          onRetake={quiz.start}
          onNewQuiz={handleGenerate}
          onClose={quiz.close}
        />
      )}
    </div>
  )
}
