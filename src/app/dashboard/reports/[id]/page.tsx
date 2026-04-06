import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import Link from "next/link"

export default async function ReportDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const report = await prisma.report.findUnique({
    where: { id: params.id },
  })

  if (!report) notFound()

  const aiData = report.aiSuggestions ? JSON.parse(report.aiSuggestions) : { issues: [], warnings: [], passes: [] }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="border-b bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
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
          <Link href="/dashboard/reports" className="text-sm text-gray-500 hover:text-gray-700">
            All Reports
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 truncate">{report.url}</h1>
          <p className="text-gray-400 text-sm">Audited on {new Date(report.createdAt).toLocaleString()}</p>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <ScoreCard label="Overall" score={report.overallScore} size="large" />
          <ScoreCard label="Performance" score={report.performance} />
          <ScoreCard label="SEO" score={report.seo} />
          <ScoreCard label="Accessibility" score={report.accessibility} />
          <ScoreCard label="Mobile" score={report.mobile} />
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-xl border shadow-sm mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b bg-red-50">
            <h2 className="font-semibold text-red-800 flex items-center gap-2">
              Critical Issues ({aiData.issues.length})
            </h2>
          </div>
          <div className="p-6">
            {aiData.issues.length === 0 ? (
              <p className="text-green-600">No critical issues found. Great job!</p>
            ) : (
              <ul className="space-y-2">
                {aiData.issues.map((issue: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✕</span>
                    <span className="text-sm">{issue}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b bg-yellow-50">
            <h2 className="font-semibold text-yellow-800 flex items-center gap-2">
              Warnings ({aiData.warnings.length})
            </h2>
          </div>
          <div className="p-6">
            {aiData.warnings.length === 0 ? (
              <p className="text-green-600">No warnings!</p>
            ) : (
              <ul className="space-y-2">
                {aiData.warnings.map((warning: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">!</span>
                    <span className="text-sm">{warning}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b bg-green-50">
            <h2 className="font-semibold text-green-800 flex items-center gap-2">
              Passed Checks ({aiData.passes.length})
            </h2>
          </div>
          <div className="p-6">
            {aiData.passes.map((pass: string, i: number) => (
              <li key={i} className="flex items-start gap-2 list-none mb-2 text-sm text-green-700">
                <span className="text-green-500">✓</span>
                <span>{pass}</span>
              </li>
            ))}
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold">Technical Details</h2>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-x-8 gap-y-3">
            <DetailRow label="URL" value={report.url} />
            <DetailRow label="Title" value={report.title || "(missing)"} />
            <DetailRow label="Meta Description" value={report.description || "(missing)"} />
            <DetailRow label="Canonical" value={report.canonical || "(not set)"} />
            <DetailRow label="OG Tags" value={report.ogTags ? "Present" : "Missing"} />
            <DetailRow label="H1 Tags" value={String(report.h1Count)} />
            <DetailRow label="H2 Tags" value={String(report.h2Count)} />
            <DetailRow label="HTTPS" value={report.https ? "Yes" : "No"} />
            <DetailRow label="Mobile Optimized" value={report.mobileOptimized ? "Yes" : "No"} />
            <DetailRow label="Sitemap" value={report.sitemap ? "Found" : "Not found"} />
            <DetailRow label="robots.txt" value={report.robotsTxt ? "Found" : "Not found"} />
            <DetailRow label="Page Load Time" value={`${report.pageLoadTime}s`} />
            <DetailRow label="Page Size" value={`${report.pageSize} KB`} />
            <DetailRow label="Total Images" value={String(report.imageCount)} />
            <DetailRow label="Images w/o Alt" value={String(report.imagesWithoutAlt)} />
            <DetailRow label="Total Links" value={String(report.linkCount)} />
            <DetailRow label="Word Count" value={String(report.wordCount)} />
            <DetailRow label="Structured Data" value={report.hasStructuredData ? "Found" : "Not found"} />
          </div>
        </div>

        {/* Priority Action Plan */}
        <div className="bg-white rounded-xl border shadow-sm mt-6 p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Priority Action Plan</h2>
          <p className="text-gray-500 mb-6">Fix these items in order for the biggest SEO impact.</p>
          <div className="text-left max-w-xl mx-auto space-y-3">
            {aiData.issues.slice(0, 5).map((issue: string, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded bg-red-50">
                <span className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm">{issue}</span>
              </div>
            ))}
          </div>
          {aiData.issues.length === 0 && (
            <p className="text-green-600">You're in great shape! No critical issues to fix.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function ScoreCard({ label, score, size = "small" }: { label: string; score: number; size?: "small" | "large" }) {
  const color = score >= 80 ? "text-green-600" :
                score >= 50 ? "text-yellow-600" :
                "text-red-600"
  const ringColor = score >= 80 ? "ring-green-200" :
                    score >= 50 ? "ring-yellow-200" :
                    "ring-red-200"
  const sizeClasses = size === "large"
    ? "w-20 h-20 text-3xl"
    : "w-16 h-16 text-xl"

  return (
    <div className="bg-white rounded-xl border p-4 text-center">
      <div className={`${sizeClasses} rounded-full ${ringColor} ring-4 flex items-center justify-center font-bold ${color} mx-auto mb-2`}>
        {score}
      </div>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
