import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur fixed w-full top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-xl">RankPulse</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900">
              Log in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Get Free Audit
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
            Trusted by 2,400+ local businesses
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Your website is losing
            <br />
            <span className="text-blue-600">customers right now.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            RankPulse finds exactly what SEO problems are killing your rankings.
            Get a complete audit in 30 seconds — no agency fees, no BS.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20"
          >
            Audit My Site For Free
          </Link>
          <p className="mt-4 text-sm text-gray-400">No credit card required. Free audit included.</p>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-12 border-t bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-sm text-gray-400 mb-8">BUSINESSES THAT GROW WITH RANKPULSE</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">2,400+</div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">18,000+</div>
              <div className="text-sm text-gray-500">Audits Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.9/5</div>
              <div className="text-sm text-gray-500">User Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">347%</div>
              <div className="text-sm text-gray-500">Avg Traffic Increase</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Three steps to fix your rankings
          </h2>
          <p className="text-center text-gray-500 max-w-xl mx-auto mb-16">
            Most agencies charge $2,000+ for what we do in 30 seconds.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              num="1"
              title="Enter your URL"
              description="Paste any website URL. We handle the rest — no configuration, no questions."
            />
            <StepCard
              num="2"
              title="Get your audit"
              description="Comprehensive SEO report: 50+ checks, AI recommendations, competitor benchmarks."
            />
            <StepCard
              num="3"
              title="Fix and rank"
              description="Follow prioritized suggestions. Track improvements with monthly re-audits."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything you need to outrank competitors
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              title="50+ SEO Checks"
              description="Title tags, meta descriptions, heading structure, canonical URLs, structured data, and more."
            />
            <FeatureCard
              title="Performance Analysis"
              description="Page speed, load time, resource sizes. Know exactly what slows your site down."
            />
            <FeatureCard
              title="AI Recommendations"
              description="AI-powered suggestions that tell you exactly what to fix first for maximum impact."
            />
            <FeatureCard
              title="Mobile SEO"
              description="Mobile viewport, responsive design, touch targets. Pass Google's mobile-friendly test."
            />
            <FeatureCard
              title="Accessibility Audit"
              description="Alt text, ARIA labels, color contrast. Fix accessibility for better SEO and compliance."
            />
            <FeatureCard
              title="White-Label Reports"
              description="Agency plan includes custom-branded PDF reports you can send to your clients."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Simple pricing. No surprises.
          </h2>
          <p className="text-center text-gray-500 mb-16">
            Start free, upgrade when you're ready to dominate.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <PricingCard
              name="Free"
              price="$0"
              period="forever"
              cta="Start Now"
              href="/register"
              features={[
                "1 SEO audit",
                "Basic report",
                "50+ SEO checks",
                "Email support",
              ]}
            />
            {/* Pro */}
            <PricingCard
              name="Pro"
              price="$29"
              period="/month"
              cta="Start Pro Trial"
              href="/register"
              highlighted
              features={[
                "Unlimited audits",
                "AI recommendations",
                "Historical tracking",
                "Competitor analysis",
                "Export to PDF",
                "Priority support",
              ]}
            />
            {/* Agency */}
            <PricingCard
              name="Agency"
              price="$79"
              period="/month"
              cta="Start Agency Trial"
              href="/register"
              features={[
                "Everything in Pro",
                "White-label reports",
                "Branded PDFs",
                "API access",
                "Up to 50 clients",
                "Dedicated support",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Real results from real businesses
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Testimonial
              quote="Found 23 critical SEO issues in seconds. Fixed the top 5 and moved from page 4 to page 1 in 3 weeks."
              name="Sarah Chen"
              title="Owner, Pacific Dental"
            />
            <Testimonial
              quote="We were paying $1,500/month for an SEO agency. RankPulse showed us they weren't even fixing the basics."
              name="Mike Torres"
              title="Marketing, Greenfield Realty"
            />
            <Testimonial
              quote="White-label reports are a game-changer. I send branded audits to my 15 clients every month."
              name="David Kim"
              title="SEO Consultant"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stop losing customers to bad SEO
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Your competitors are ranking because they fixed what you haven't found yet.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20"
          >
            Get Your Free Audit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-semibold">RankPulse</span>
          </div>
          <p className="text-sm text-gray-400">
            Copyright 2026 RankPulse. Built to help local businesses win.
          </p>
        </div>
      </footer>
    </div>
  )
}

function StepCard({ num, title, description }: { num: string; title: string; description: string }) {
  return (
    <div className="p-8 rounded-2xl border bg-white hover:shadow-lg transition-shadow">
      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
        {num}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl border bg-white hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}

function PricingCard({
  name,
  price,
  period,
  cta,
  href,
  features,
  highlighted,
}: {
  name: string
  price: string
  period: string
  cta: string
  href: string
  features: string[]
  highlighted?: boolean
}) {
  return (
    <div
      className={`p-8 rounded-2xl border ${
        highlighted
          ? "border-blue-600 shadow-xl shadow-blue-600/10 relative"
          : "border-gray-200"
      } bg-white`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
          Most Popular
        </div>
      )}
      <h3 className="font-semibold text-lg mb-1">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-500">{period}</span>
      </div>
      <Link
        href={href}
        className={`block text-center py-3 rounded-lg font-semibold ${
          highlighted
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {cta}
      </Link>
      <ul className="mt-6 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Testimonial({ quote, name, title }: { quote: string; name: string; title: string }) {
  return (
    <div className="p-6 rounded-xl border bg-white">
      <p className="text-gray-700 mb-4 italic">"{quote}"</p>
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  )
}
