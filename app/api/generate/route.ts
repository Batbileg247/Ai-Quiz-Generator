import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { upsertUser } from "@/lib/auth-helpers";
import { summarizeArticle } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, content } = await req.json();
    if (!title?.trim() || !content?.trim())
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );

    const user = await upsertUser(userId);
    const summary = await summarizeArticle(content);
    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        summary,
        userId: user.id,
      },
    });

    return NextResponse.json({ articleId: article.id, summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
