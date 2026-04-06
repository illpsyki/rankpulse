import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import Link from "next/link"

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const reports = await prisma.report.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="font-bold">RankPulse</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/new" className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            + New Audit
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">All Audits ({reports.length})</h1>

        {reports.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">No audits yet.</p>
            <Link href="/dashboard/new" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
              Run Your First Audit
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/dashboard/reports/${report.id}`}
                className="block bg-white rounded-xl border p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">{report.url}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(report.createdAt).toLocaleString()}
                      {report.title && ` - ${report.title}`}
                    </p>
                  </div>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${
                    report.overallScore >= 80 ? "bg-green-100 text-green-700" :
                    report.overallScore >= 50 ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {report.overallScore}
                  </div>
                </div>
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  <span>Performance: <strong>{report.performance}</strong></span>
                  <span>SEO: <strong>{report.seo}</strong></span>
                  <span>Accessibility: <strong>{report.accessibility}</strong></span>
                  <span>Mobile: <strong>{report.mobile}</strong></span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
