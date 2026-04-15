import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/** Returns { userId, user } or a 401/404 NextResponse */
export async function requireUser() {
  const { userId } = await auth()
  if (!userId) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return { error: NextResponse.json({ error: "User not found" }, { status: 404 }) }

  return { userId, user }
}

export async function upsertUser(userId: string) {
  const clerkUser = await currentUser()
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${userId}@clerk.user`
  return prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: { clerkId: userId, email },
  })
}
