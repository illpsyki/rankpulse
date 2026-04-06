import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { analyzeWebsite, saveReport } from "@/lib/seo-engine"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Check rate limits for free users
    const sub = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    const reportCount = await prisma.report.count({
      where: {
        userId: session.user.id,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    })

    // Free users get 1 report/month
    if (!sub || sub.status !== "active") {
      if (reportCount >= 1) {
        return NextResponse.json(
          { error: "Free plan limit reached. Upgrade to Pro or Agency for unlimited audits." },
          { status: 429 }
        )
      }
    }

    // Run the audit
    const audit = await analyzeWebsite(url)
    const report = await saveReport(session.user.id, audit)

    return NextResponse.json({
      id: report.id,
      ...audit,
    })
  } catch (err: any) {
    console.error("Audit error:", err.message)
    return NextResponse.json(
      { error: err.message || "Failed to analyze website" },
      { status: 500 }
    )
  }
}
