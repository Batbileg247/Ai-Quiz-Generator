import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ articleId: string }> },
) {
  try {
    const auth = await requireUser();
    if ("error" in auth) return auth.error;

    const { articleId } = await params;
    const article = await prisma.article.findFirst({
      where: { id: articleId, userId: auth.user.id },
      include: {
        quizzes: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { questions: true },
        },
      },
    });

    if (!article)
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    return NextResponse.json(article);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
