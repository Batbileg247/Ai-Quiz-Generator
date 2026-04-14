"use client"

import { useState, useEffect } from "react"
import type { Article, Quiz } from "@/types"

export function useArticle(articleId: string) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [generatingQuiz, setGeneratingQuiz] = useState(false)

  useEffect(() => {
    fetchArticle()
  }, [articleId])

  async function fetchArticle() {
    setLoading(true)
    try {
      const res = await fetch(`/api/article/${articleId}`)
      if (res.ok) {
        const data = await res.json()
        setArticle(data)
        if (data.quizzes?.length > 0) setActiveQuiz(data.quizzes[0])
      }
    } finally {
      setLoading(false)
    }
  }

  async function generateQuiz() {
    setGeneratingQuiz(true)
    try {
      const res = await fetch(`/api/article/${articleId}/quizzes`, { method: "POST" })
      if (res.ok) {
        const quiz = await res.json()
        setActiveQuiz(quiz)
        return quiz
      }
    } finally {
      setGeneratingQuiz(false)
    }
  }

  return { article, loading, activeQuiz, generatingQuiz, generateQuiz }
}
