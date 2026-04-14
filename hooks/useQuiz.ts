"use client"

import { useState } from "react"
import type { Quiz } from "@/types"

export function useQuiz(quiz: Quiz | null) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResult, setShowResult] = useState(false)

  function start() {
    setIndex(0)
    setSelected(null)
    setAnswers({})
    setShowResult(false)
    setOpen(true)
  }

  function close() {
    setOpen(false)
    setShowResult(false)
    setIndex(0)
    setSelected(null)
    setAnswers({})
  }

  function selectAnswer(optionIdx: number) {
    if (selected !== null || !quiz) return
    setSelected(optionIdx)
    setAnswers(prev => ({ ...prev, [index]: optionIdx }))
  }

  function next() {
    if (!quiz) return
    if (index < quiz.questions.length - 1) {
      setIndex(i => i + 1)
      setSelected(null)
    } else {
      setShowResult(true)
    }
  }

  return {
    open, index, selected, answers, showResult,
    start, close, selectAnswer, next,
    total: quiz?.questions.length ?? 0,
    currentQuestion: quiz?.questions[index] ?? null,
  }
}
