import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQuizFromArticle } from "@/lib/ai";

export async function POST(
  req: NextRequest,
  // 1. Change the type to Promise
  { params }: { params: Promise<{ articleId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Await the params before accessing articleId
    const { articleId } = await params;

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const article = await prisma.article.findFirst({
      // 3. Use the awaited articleId
      where: { id: articleId, userId: user.id },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

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
  } catch (err: unknown) {
    console.error("[/api/quizzes] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}