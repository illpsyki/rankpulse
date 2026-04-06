import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      reports: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })

  if (!user) redirect("/login")

  const plan = user.subscription?.status === "active" ? user.subscription.plan : "free"
  const reportCount = user.reports.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <nav className="border-b bg-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="font-bold">RankPulse</span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            plan === "agency" ? "bg-purple-100 text-purple-700" :
            plan === "pro" ? "bg-blue-100 text-blue-700" :
            "bg-gray-100 text-gray-600"
          }`}>
            {plan === "free" ? "Free" : plan === "pro" ? "Pro" : "Agency"}
          </span>
          <Link href="/dashboard/new" className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            + New Audit
          </Link>
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-700">
            Upgrade
          </Link>
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
            Sign out
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome back, {user.name || "there"}!</h1>
          <p className="text-gray-500 mt-1">
            You have {reportCount} audit{reportCount !== 1 ? "s" : ""}.
            {plan === "free" && reportCount === 0 && " Your free audit is waiting."}
            {plan === "free" && reportCount >= 1 && " Upgrade to unlock unlimited audits."}
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Plan" value={plan === "free" ? "Free" : plan === "pro" ? "Pro" : "Agency"} />
          <StatCard label="Audits Done" value={String(reportCount)} />
          <StatCard label="Best Score" value={user.reports.length > 0 ? `${Math.max(...user.reports.map(r => r.overallScore))}/100` : "—" } />
          <StatCard label="Last Audit" value={user.reports[0] ? new Date(user.reports[0].createdAt).toLocaleDateString() : "—"} />
        </div>

        {/* Recent reports */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">Recent Audits</h2>
            <Link href="/dashboard/reports" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          {user.reports.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-gray-400 mb-4">No audits yet. Run your first one!</p>
              <Link href="/dashboard/new" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                Audit a Website
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {user.reports.map((report) => (
                <Link
                  key={report.id}
                  href={`/dashboard/reports/${report.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium truncate max-w-md">{report.url}</p>
                    <p className="text-sm text-gray-400">{new Date(report.createdAt).toLocaleDateString()} {report.title ? `— ${report.title}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 text-sm text-gray-500">
                      <span>Perf: {report.performance}</span>
                      <span>SEO: {report.seo}</span>
                      <span>A11y: {report.accessibility}</span>
                    </div>
                    <ScoreBadge score={report.overallScore} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl border bg-white">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "bg-green-100 text-green-700" :
                score >= 50 ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${color}`}>
      {score}
    </div>
  )
}
