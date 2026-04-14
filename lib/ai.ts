import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

const MAX_CHARS = 3000

export async function summarizeArticle(content: string) {
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 300,
    messages: [{ role: "user", content: `Summarize in 2-3 sentences:\n\n${content.slice(0, MAX_CHARS)}` }],
  })
  return res.choices[0].message.content ?? ""
}

export interface QuizQuestion {
  question: string
  options: string[]
  answer: string // index as string e.g. "0"
}

export async function generateQuizFromArticle(content: string): Promise<QuizQuestion[]> {
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: `Generate 5 multiple choice questions from this article: ${content.slice(0, MAX_CHARS)}

Return ONLY a raw JSON array, no markdown, no code fences.
Format: [{"question":"...","options":["A","B","C","D"],"answer":"0"}]
The answer must be the option index (0-3) as a string.`,
    }],
  })

  const raw = (res.choices[0].message.content ?? "").trim()
  const start = raw.indexOf("[")
  const end = raw.lastIndexOf("]")
  if (start === -1 || end === -1) throw new Error("Invalid quiz response")
  return JSON.parse(raw.slice(start, end + 1))
}
