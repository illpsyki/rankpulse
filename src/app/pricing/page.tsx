"use client"

import { useState } from "react"
import Link from "next/link"

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (priceId: string) => {
    if (!priceId || priceId === "placeholder") {
      alert("Stripe not configured. Pricing is $29/mo for Pro, $79/mo for Agency. Set up STRIPE_SECRET_KEY and price IDs to enable payments.")
      return
    }
    setLoading(priceId)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (e) {
      console.error(e)
    }
    setLoading(null)
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Choose your plan</h1>
        <p className="text-lg text-gray-500 text-center mb-12">
          Start with a free audit, then pick a plan to keep growing.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl border bg-white">
            <h3 className="font-semibold text-lg mb-1">Free</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-500"> forever</span>
            </div>
            <Link href="/register" className="block text-center py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200">
              Start Now
            </Link>
            <ul className="mt-6 space-y-3">
              {["1 SEO audit", "Basic report", "50+ SEO checks", "Email support"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  ✓ {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-2xl border-2 border-blue-600 shadow-xl shadow-blue-600/10 bg-white relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
              Most Popular
            </div>
            <h3 className="font-semibold text-lg mb-1">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-gray-500">/month</span>
            </div>
            <button
              onClick={() => handleUpgrade(process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "placeholder")}
              disabled={loading !== null}
              className="block w-full text-center py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading === "pro" ? "Redirecting..." : "Start Pro Trial"}
            </button>
            <ul className="mt-6 space-y-3">
              {[
                "Unlimited audits",
                "AI recommendations",
                "Historical tracking",
                "Competitor analysis",
                "Export to PDF",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  ✓ {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-2xl border bg-white">
            <h3 className="font-semibold text-lg mb-1">Agency</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$79</span>
              <span className="text-gray-500">/month</span>
            </div>
            <button
              onClick={() => handleUpgrade(process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID || "placeholder")}
              disabled={loading !== null}
              className="block w-full text-center py-3 rounded-lg font-semibold bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50"
            >
              {loading === "agency" ? "Redirecting..." : "Start Agency Trial"}
            </button>
            <ul className="mt-6 space-y-3">
              {[
                "Everything in Pro",
                "White-label reports",
                "Branded PDF reports",
                "API access",
                "Up to 50 clients",
                "Dedicated support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  ✓ {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
