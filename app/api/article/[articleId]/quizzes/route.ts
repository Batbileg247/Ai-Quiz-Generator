import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { generateQuizFromArticle } from "@/lib/ai";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ articleId: string }> },
) {
  try {
    const auth = await requireUser();
    if ("error" in auth) return auth.error;

    const { articleId } = await params;
    const article = await prisma.article.findFirst({
      where: { id: articleId, userId: auth.user.id },
    });
    if (!article)
      return NextResponse.json({ error: "Article not found" }, { status: 404 });

    const questions = await generateQuizFromArticle(article.content);
    const quiz = await prisma.quiz.create({
      data: {
        articleId: article.id,
        questions: {
          create: questions.map((q) => ({
            questionText: q.question,
            options: q.options,
            correctAnswer: parseInt(q.answer, 10),
          })),
        },
      },
      include: { questions: true },
    });

    return NextResponse.json(quiz);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}
