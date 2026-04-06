/**
 * RankPulse SEO Audit Engine
 * Analyzes any URL and returns a comprehensive SEO audit report.
 * This is the core product - the audit quality is what users pay for.
 */

import * as cheerio from "cheerio"
import { prisma } from "./db"

const USER_AGENT = "Mozilla/5.0 (compatible; RankPulseBot/1.0; +https://rankpulse.io/bot)"

interface AuditResult {
  url: string
  title: string | null
  description: string | null
  metaKeywords: string | null
  canonical: string | null
  ogTags: boolean
  h1Count: number
  h2Count: number
  https: boolean
  mobileOptimized: boolean
  sitemap: boolean
  robotsTxt: boolean
  pageLoadTime: number
  pageSize: number
  imageCount: number
  imagesWithoutAlt: number
  linkCount: number
  brokenLinks: number
  wordCount: number
  hasStructuredData: boolean
  htmlSnapshot: string
  // Scores
  overallScore: number
  performance: number
  accessibility: number
  seo: number
  mobile: number
  // AI recommendations
  aiSuggestions: string
}

async function fetchWithTimeout(url: string, timeout = 10000): Promise<{ html: string; loadTime: number; size: number }> {
  const start = Date.now()

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml,*/*",
    },
    signal: controller.signal,
    redirect: "follow",
  })

  clearTimeout(timeoutId)
  const loadTime = (Date.now() - start) / 1000
  const html = await res.text()
  const size = new Blob([html]).size

  return { html, loadTime, size }
}

export async function analyzeWebsite(targetUrl: string): Promise<AuditResult> {
  const normalizedUrl = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`

  const { html, loadTime, size } = await fetchWithTimeout(normalizedUrl)
  const $ = cheerio.load(html)

  // Meta tags
  const title = $("title").text().trim() || null
  const description = $('meta[name="description"]').attr("content") || null
  const metaKeywords = $('meta[name="keywords"]').attr("content") || null
  const canonical = $('link[rel="canonical"]').attr("href") || null
  const ogTitle = $('meta[property="og:title"]').attr("content")
  const ogDescription = $('meta[property="og:description"]').attr("content")
  const ogImage = $('meta[property="og:image"]').attr("content")
  const ogTags = !!(ogTitle && ogDescription && ogImage)

  // Headings
  const h1Count = $("h1").length
  const h2Count = $("h2").length

  // Images
  const imageCount = $("img").length
  const imagesWithoutAlt = $("img:not([alt])").length

  // Links
  const linkCount = $("a").length

  // Technical
  const https = normalizedUrl.startsWith("https://")
  const viewport = $('meta[name="viewport"]').attr("content") || ""
  const mobileOptimized = viewport.includes("width") && viewport.includes("device-width")

  // Structured data
  const hasStructuredData = $('script[type="application/ld+json"]').length > 0

  // Sitemap & robots
  let sitemap = false
  let robotsTxt = false
  try {
    const baseUrl = new URL(normalizedUrl).origin
    const [robotsRes, sitemapRes] = await Promise.allSettled([
      fetch(`${baseUrl}/robots.txt`, { signal: AbortSignal.timeout(5000) }),
      fetch(`${baseUrl}/sitemap.xml`, { signal: AbortSignal.timeout(5000) }),
    ])
    if (robotsRes.status === "fulfilled" && robotsRes.value.ok) robotsTxt = true
    if (sitemapRes.status === "fulfilled" && sitemapRes.value.ok) sitemap = true
  } catch {}

  // Word count
  const bodyText = $("body").text()
    .replace(/\s+/g, " ")
    .trim()
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length

  // Generate AI recommendations
  const issues: string[] = []
  const warnings: string[] = []
  const passes: string[] = []

  // Title check
  if (!title) issues.push("Missing <title> tag - this is critical for SEO")
  else if (title.length < 30 || title.length > 60)
    warnings.push(`Title length is ${title.length} characters (recommended 30-60)`)
  else passes.push("Title tag is well-optimized")

  // Meta description
  if (!description) issues.push("Missing meta description")
  else if (description.length < 120 || description.length > 160)
    warnings.push(`Meta description is ${description.length} characters (recommended 120-160)`)
  else passes.push("Meta description length is optimal")

  // H1
  if (h1Count === 0) issues.push("Page has no H1 heading")
  else if (h1Count > 1) warnings.push("Multiple H1 headings found (should have exactly one)")
  else passes.push("Single H1 heading found")

  // H2
  if (h2Count === 0) warnings.push("No H2 subheadings found")
  else if (h2Count > 10) warnings.push("Many H2 headings (consider consolidating)")
  else passes.push("Good heading hierarchy")

  // OG tags
  if (!ogTags) warnings.push("Missing Open Graph tags - this hurts social sharing")
  else passes.push("Open Graph tags present")

  // Images without alt
  if (imagesWithoutAlt > 0)
    warnings.push(`${imagesWithoutAlt} image(s) missing alt text (accessibility and SEO impact)`)

  // Mobile
  if (!mobileOptimized) issues.push("No mobile viewport meta tag found")
  else passes.push("Mobile viewport configured")

  // HTTPS
  if (!https) issues.push("Site is not using HTTPS - major SEO issue")
  else passes.push("HTTPS enabled")

  // Structured data
  if (!hasStructuredData) warnings.push("No structured data (JSON-LD) found")
  else passes.push("Structured data present")

  // Page speed
  if (loadTime > 3) issues.push(`Slow page load: ${loadTime.toFixed(1)}s (>3s hurts rankings)`)
  else if (loadTime > 1.5) warnings.push(`Page load time: ${loadTime.toFixed(1)}s (could be faster)`)
  else passes.push("Fast page load time")

  // Word count
  if (wordCount < 300) issues.push(`Low content: only ${wordCount} words (aim for 300+)`)
  else if (wordCount < 1000) warnings.push(`Content length: ${wordCount} words (aim for 1000+ for ranking pages)`)
  else passes.push("Good content length")

  // Sitemap & robots
  if (!sitemap) warnings.push("No sitemap.xml found")
  if (!robotsTxt) warnings.push("No robots.txt found")

  const aiSuggestions = JSON.stringify({ issues, warnings, passes })

  // Calculate scores (0-100)
  const seoScore = calculateSeoScore({
    title: !!title,
    description: !!description,
    metaKeywords: !!metaKeywords,
    h1: h1Count === 1,
    h2: h2Count > 0,
    ogTags,
    structuredData: hasStructuredData,
    canonical: !!canonical,
    https,
    mobileOptimized,
    wordCount,
    imagesWithAlt: imageCount > 0 ? (imageCount - imagesWithoutAlt) / imageCount : 1,
  })

  const perfScore = calculatePerfScore(loadTime, size)
  const a11yScore = calculateA11yScore(imagesWithoutAlt, imageCount, hasStructuredData)
  const mobileScore = calculateMobileScore(mobileOptimized, https, viewport)

  const overallScore = Math.round(
    seoScore * 0.35 + perfScore * 0.25 + a11yScore * 0.2 + mobileScore * 0.2
  )

  return {
    url: normalizedUrl,
    title,
    description,
    metaKeywords,
    canonical,
    ogTags,
    h1Count,
    h2Count,
    https,
    mobileOptimized,
    sitemap,
    robotsTxt,
    pageLoadTime: Math.round(loadTime * 100) / 100,
    pageSize: Math.round(size / 1024),
    imageCount,
    imagesWithoutAlt,
    linkCount,
    brokenLinks: 0, // Would require actual link checking
    wordCount,
    hasStructuredData,
    htmlSnapshot: html.substring(0, 50000), // Store first 50KB
    overallScore,
    performance: perfScore,
    accessibility: a11yScore,
    seo: seoScore,
    mobile: mobileScore,
    aiSuggestions,
  }
}

function calculateSeoScore(checks: Record<string, any>): number {
  const weights: Record<string, number> = {
    title: 20,
    description: 15,
    h1: 12,
    https: 10,
    mobileOptimized: 10,
    canonical: 8,
    structuredData: 7,
    ogTags: 6,
    wordCount: 5,
    metaKeywords: 2,
    h2: 3,
    imagesWithAlt: 2,
  }

  let total = 0
  for (const [key, weight] of Object.entries(weights)) {
    const val = checks[key]
    if (typeof val === "number") {
      total += Math.min(val * weight, weight)
    } else if (val) {
      total += weight
    }
  }
  return Math.round(Math.min(total, 100))
}

function calculatePerfScore(loadTime: number, size: number): number {
  let score = 100
  if (loadTime > 3) score -= 40
  else if (loadTime > 1.5) score -= 20
  else if (loadTime > 1) score -= 10

  if (size > 3000) score -= 30
  else if (size > 1500) score -= 15
  else if (size > 500) score -= 5

  return Math.max(Math.round(score), 0)
}

function calculateA11yScore(missingAlt: number, totalImages: number, hasSD: boolean): number {
  let score = 80
  if (totalImages > 0) {
    score -= Math.round((missingAlt / totalImages) * 20)
  }
  if (hasSD) score += 10
  return Math.min(Math.max(score, 0), 100)
}

function calculateMobileScore(viewport: boolean, https: boolean, vp: string): number {
  let score = 50
  if (viewport) score += 25
  if (https) score += 15
  if (vp.includes("initial-scale")) score += 10
  return Math.min(score, 100)
}

// Save report to database
export async function saveReport(userId: string, audit: AuditResult) {
  return prisma.report.create({
    data: {
      userId,
      url: audit.url,
      title: audit.title,
      description: audit.description,
      metaKeywords: audit.metaKeywords,
      canonical: audit.canonical,
      ogTags: audit.ogTags ? "present" : "missing",
      h1Count: audit.h1Count,
      h2Count: audit.h2Count,
      https: audit.https,
      mobileOptimized: audit.mobileOptimized,
      sitemap: audit.sitemap,
      robotsTxt: audit.robotsTxt,
      pageLoadTime: audit.pageLoadTime,
      pageSize: audit.pageSize,
      imageCount: audit.imageCount,
      imagesWithoutAlt: audit.imagesWithoutAlt,
      linkCount: audit.linkCount,
      wordCount: audit.wordCount,
      hasStructuredData: audit.hasStructuredData,
      aiSuggestions: audit.aiSuggestions,
      htmlSnapshot: audit.htmlSnapshot,
      overallScore: audit.overallScore,
      performance: audit.performance,
      accessibility: audit.accessibility,
      seo: audit.seo,
      mobile: audit.mobile,
    },
  })
}
