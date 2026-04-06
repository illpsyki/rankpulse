import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reports = await prisma.report.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        url: true,
        title: true,
        overallScore: true,
        performance: true,
        accessibility: true,
        seo: true,
        mobile: true,
        createdAt: true,
      },
    })

    return NextResponse.json(reports)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
