export interface Question {
  id: string
  questionText: string
  options: string[]
  correctAnswer: number
}

export interface Quiz {
  id: string
  questions: Question[]
}

export interface Article {
  id: string
  title: string
  content: string
  summary: string
  quizzes: Quiz[]
}

export interface ArticleMeta {
  id: string
  title: string
  createdAt: string
}
