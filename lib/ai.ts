import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function summarizeArticle(content: string): Promise<string> {
  const trimmed = content.slice(0, 3000);
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `Please provide a concise 2-3 sentence summary:\n\n${trimmed}`,
      },
    ],
  });
  return response.choices[0].message.content ?? "";
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export async function generateQuizFromArticle(
  content: string,
): Promise<QuizQuestion[]> {
  const trimmed = content.slice(0, 3000);
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `Generate 5 multiple choice questions based on this article: ${trimmed}

Return ONLY a raw JSON array, no markdown, no code fences, nothing else.
Format: [{"question":"...","options":["A","B","C","D"],"answer":"0"}]
The answer field must be the index (0-3) as a string.`,
      },
    ],
  });

  const raw = (response.choices[0].message.content ?? "").trim();
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("Invalid quiz response");
  return JSON.parse(raw.slice(start, end + 1)) as QuizQuestion[];
}
