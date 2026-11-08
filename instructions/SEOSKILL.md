---
name: seo-engineering
description: Build and review websites so search engines and AI answer engines can crawl, render, index, understand, and rank them. Use this skill whenever you create or modify anything that becomes a public web page or site — HTML, templates, React/Next.js/Nuxt/Astro/SvelteKit/Remix/Angular/Vue routes, CMS themes, landing pages, blogs, docs sites, e-commerce pages, sitemaps, robots.txt, redirects, metadata, structured data (JSON-LD), images, fonts, or performance work — and whenever the user mentions SEO, search ranking, Google, indexing, Core Web Vitals, meta tags, schema markup, sitemap, canonical URLs, hreflang, GEO/AEO, AI Overviews, or "getting found". Apply it even when the user never says "SEO": shipping a public page with a placeholder title, an empty server-rendered body, or a missing canonical is a bug, not a style choice. Skip only for authenticated app screens, internal tools, and non-web code.
---

# SEO Engineering for Coding Agents

Most SEO outcomes are decided by engineering choices made while the code is being written: how a page is rendered, what the HTML head contains, which status code a missing page returns, how URLs are structured, how fast the largest element paints. Fixing these later costs far more than getting them right the first time, and a coding agent is in the best position to get them right because it controls the code.

This skill tells you what to build, what to avoid, and how to verify. It is current as of **October 2026**. Items marked **(volatile)** change often; if you have web access and a decision depends on one, check the linked official source instead of trusting this file.

## 1. Operating principles

Hold these in mind for every page you touch. When a situation is not covered below, reason from them.

1. **Crawlable HTML first.** A crawler should be able to read the page's main content, title, links, and metadata from the initial HTML response. Googlebot can execute JavaScript, but rendering is deferred and can fail, and many other crawlers (including many AI crawlers) do not execute JavaScript at all. Server-rendered or pre-rendered HTML is the safe default.
2. **One URL, one purpose, one canonical.** Every indexable piece of content should live at exactly one preferred URL. Duplicates dilute signals and waste crawl budget.
3. **Metadata is unique and truthful.** Every indexable page gets its own title, description, and canonical that describe *that* page. Never ship framework defaults or copy-pasted values.
4. **Performance is measured on real users.** Core Web Vitals are judged at the 75th percentile of field data per device class. Lab scores (Lighthouse) are a proxy, not the goal.
5. **Structured data describes what is visibly on the page.** It never invents facts. Fabricated ratings, prices, addresses, or reviews violate Google's spam policies and can trigger manual actions.
6. **Write for people.** Do not keyword-stuff, hide text, cloak, or mass-produce thin pages. Search systems are built to reward content that helps users and to demote content made mainly to rank.
7. **Verify, do not assume.** Fetch the actual HTML your code produces (`curl`, view-source) and inspect it. Frameworks routinely emit something different from what the source suggests.
8. **Do not cargo-cult.** Google's own guidance for AI Overviews and AI Mode says no special AI markup, no `llms.txt`, no content "chunking," and no AI-specific rewrites are needed. Strong fundamentals are the strategy. See section 11.

## 2. Workflow

### Step 0 — Detect the context (do this before editing)

Inspect the repo and determine:

- **Stack and rendering mode**: `package.json`, `next.config.*`, `nuxt.config.*`, `astro.config.*`, `svelte.config.*`, `angular.json`, `vite.config.*`, `wp-config.php`, template engines. Is each route SSG, SSR, ISR, or client-only?
- **Canonical origin**: the one true `https://host` (www vs apex, trailing-slash policy). Look for env vars like `SITE_URL`. If none exists, create one and use it everywhere (canonical, sitemap, OG URLs, JSON-LD). **Never hardcode `localhost` or a preview URL into anything that ships.**
- **Locales**: single language or multi-language/region?
- **Existing SEO plumbing**: robots, sitemap, metadata helpers, SEO components. Extend them; do not create a parallel system.
- **Page types present**: see section 12 for the per-type definition of done.

### Step 1 — Classify every route

| Class | Examples | Treatment |
|---|---|---|
| **Index** | Home, product, article, docs, category, landing | Full SEO treatment |
| **Noindex, crawlable** | Internal search results, filtered/sorted views with no unique value, thank-you pages, tag archives with thin content | `noindex` via meta or `X-Robots-Tag`; leave crawlable so the directive is seen |
| **Blocked / private** | Admin, account, cart, checkout, staging | Authentication (real protection) plus `noindex`; do not rely on robots.txt alone |

### Step 2 — Implement using the sections below

### Step 3 — Verify (section 13)

### Step 4 — Report (section 14)

### When to ask the user

Ask once, up front, only for facts you cannot infer and must not invent: the canonical domain, real business details for schema (name, address, phone, logo, social profiles), supported locales, and whether AI training crawlers should be blocked (section 11). For everything else, choose a sensible default and state the assumption in your report. Do not invent target keywords; derive topics from the page's actual content and the user's stated goals.

### Modes

- **Build mode**: you are creating pages. Bake SEO in as you go; do not leave it for "later."
- **Audit mode**: you are reviewing. Report findings by severity (Critical / High / Medium / Low) with file and line references, then fix what is in scope.
- **Fix mode**: a specific symptom (pages not indexed, traffic drop, slow LCP). Diagnose with evidence before changing code; section 13 lists the checks.

## 3. Failure modes coding agents repeat — check these first

These are the highest-frequency, highest-impact mistakes. Scan for them in every task.

1. **Client-only SPA shell.** The response body is `<div id="root"></div>` plus a script. Crawlers that skip JS see nothing. Switch indexable routes to SSR/SSG.
2. **Placeholder metadata shipped.** "Create Next App," "Vite + React," "Document," "Untitled," lorem ipsum, or a title identical on every route.
3. **Identical title/description on all routes** because metadata lives only in the root layout or `index.html`.
4. **`localhost` or preview URLs** in canonical tags, `og:url`, sitemap entries, or JSON-LD.
5. **Fake links.** `<div onClick>` or `<a onClick>` without `href` for navigation. Crawlers follow `<a href>`; they do not click.
6. **Soft 404s.** A "Page not found" screen served with HTTP 200 (very common in SPAs). Missing resources must return a real 404 or 410.
7. **JS redirects instead of HTTP redirects.** Use 301/308 for permanent moves, not `window.location` or meta refresh.
8. **`noindex` or `Disallow: /` leaking to production** from a staging config; or the reverse, staging left open and indexable.
9. **Blocking CSS/JS in robots.txt.** Googlebot needs them to render the page.
10. **Images without `alt`, without `width`/`height`, or with `loading="lazy"` on the hero image** (hurts LCP and CLS).
11. **Missing or multiple/styled-away `<h1>`**; headings chosen for font size instead of document outline.
12. **Fabricated structured data**: invented ratings, review counts, prices, addresses, or `sameAs` links.
13. **Canonical pointing to a different page** "to consolidate" when the content is not equivalent, or canonicalizing page 2+ of a series to page 1.
14. **Infinite scroll or "load more" with no crawlable paginated URLs**, hiding content from crawlers.
15. **Content behind interactions**: text that appears only after a click/tab event and is never in the DOM at load.
16. **Hash-based routes** (`/#/products`) for indexable content. Use real paths via the History API.
17. **Programmatic page explosion**: generating thousands of near-duplicate pages from a template with only a keyword swapped (scaled content abuse; see section 10).

## 4. Choose the rendering strategy deliberately

| Strategy | Use for | SEO notes |
|---|---|---|
| **SSG** (static generation) | Marketing, blogs, docs, most content | Best default: fastest TTFB, full HTML for every crawler |
| **ISR / on-demand revalidation** | Large catalogs, content that changes hourly/daily | Same HTML benefits; ensure revalidation updates `lastmod` and sitemap |
| **SSR** | Personalized-but-indexable, frequently changing, search-driven pages | Cache aggressively at the CDN; watch TTFB (LCP starts there) |
| **CSR only** | Authenticated dashboards and tools | Acceptable only for routes that are `noindex`/private |
| **Dynamic rendering** (serve bots a prerendered copy) | Nothing new | Google calls it a workaround, not a long-term solution. Prefer SSR/SSG |

Rules of thumb:

- If a route is meant to rank, its primary content, `<title>`, meta description, canonical, headings, and internal links must appear in the **initial HTML**.
- Hydration is fine; hiding content until hydration is not.
- Hash-bang and fragment-only navigation are not crawlable routes.

## 5. Crawlability and indexation control

### 5.1 Status codes and redirects

| Situation | Response |
|---|---|
| Page exists | `200` |
| Permanently moved | `301` or `308` to the final URL (no chains; max one hop) |
| Temporarily moved | `302` / `307` |
| Removed for good | `410` (or `404`) |
| Not found | `404` with a helpful page that has links back into the site |
| Planned downtime | `503` with `Retry-After` |

- Apply redirects at the server/edge/framework-config level, not in client JS.
- Normalize one host and protocol: force HTTPS, pick www or apex, pick trailing slash or none, and 301 everything else to it. Do this in one place.
- When changing a URL, add a 301 from the old URL and update internal links to point at the new one directly. Never leave redirect chains or loops.
- In SPAs/SSR frameworks, call the framework's not-found helper (`notFound()` in Next.js, `error(404)` in SvelteKit, `throw createError({ statusCode: 404 })` in Nuxt) so the **HTTP status** is 404, not just the UI.

### 5.2 robots.txt (crawl control, not index control)

`Disallow` stops crawling; it does **not** remove a URL from the index, and a blocked page's `noindex` can never be seen. Never combine `Disallow` with `noindex` on the same URL and expect de-indexing.

```txt
User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /cart
Disallow: /search          # internal search results
Allow: /

Sitemap: https://www.example.com/sitemap.xml
```

- Do **not** block CSS, JS, fonts, or images needed to render the page.
- robots.txt is per host and protocol; each subdomain needs its own.
- It is public. Never list secret paths in it; protect them with authentication.
- Keep staging out with HTTP authentication (the real control) plus `X-Robots-Tag: noindex`. Robots.txt alone is not protection.
- Gate dev-only directives on the environment so they cannot reach production:

```ts
// One explicit switch, set ONLY in the real production environment.
// NODE_ENV alone is not enough: staging and preview builds also run with NODE_ENV=production.
const isProd = process.env.APP_ENV === "production";
export const robots = isProd ? { index: true, follow: true } : { index: false, follow: false };
```

### 5.3 Indexing directives

- Use `<meta name="robots" content="noindex">` or the `X-Robots-Tag` HTTP header (the only option for PDFs and other non-HTML files).
- Valid snippet controls: `nosnippet`, `max-snippet:N`, `max-image-preview:large`, `max-video-preview:N`, and the `data-nosnippet` attribute for sections. Add `max-image-preview:large` to content pages that want large image previews in Search and Discover. These controls also govern what Google's AI features may show.
- `nofollow`, `rel="sponsored"`, `rel="ugc"` apply to links: use `sponsored` for paid links and `ugc` for user-generated content links.
- `<meta name="keywords">` is ignored by Google. Do not add it.

### 5.4 Canonical URLs

```html
<link rel="canonical" href="https://www.example.com/blog/how-to-x">
```

- Every indexable page gets a **self-referencing**, **absolute**, **single** canonical in the `<head>` (never in `<body>`, never two).
- Canonical is a hint, not a command. Make it consistent with redirects, sitemap entries, and internal links, or Google will pick its own.
- Canonicalize parameter variants (`?utm_*`, `?sort=`, session IDs) to the clean URL. Strip tracking parameters from internal links.
- Only canonicalize pages whose content is equivalent. Do not canonicalize page 2 of a series to page 1.
- Do not rely on canonical to hide thin or duplicate pages you generated; fix the generation.

### 5.5 URL design

- Lowercase, hyphen-separated, human-readable, stable: `/guides/core-web-vitals`, not `/p?id=48291` or `/Guides/Core_Web_Vitals`.
- Reflect hierarchy only where it is stable. Avoid dates in URLs for evergreen content.
- No session IDs or tracking parameters in indexable URLs. No fragments (`#`) for content.
- Keep it short, but never rename slugs casually. Every rename needs a 301.

### 5.6 XML sitemaps

- Generate dynamically from the real data source so it cannot drift from the site. Include only **indexable, canonical, 200-status** URLs.
- Limits: 50,000 URLs and 50 MB uncompressed per file; beyond that use a sitemap index.
- `<lastmod>` is used only if it is accurate (the date content last meaningfully changed). Do not set it to "now" on every build. Google ignores `<priority>` and `<changefreq>`; omit them.
- Reference the sitemap in robots.txt and submit it in Search Console.
- Separate sitemaps per locale or content type are fine and make debugging easier.

```ts
// Next.js App Router: app/sitemap.ts
import type { MetadataRoute } from "next";
const SITE = process.env.NEXT_PUBLIC_SITE_URL!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPublishedPosts();           // only published, indexable
  return [
    { url: `${SITE}/`, lastModified: new Date() },
    ...posts.map((p) => ({ url: `${SITE}/blog/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
```

### 5.7 Pagination, filters, and infinite scroll

- Each page of a paginated list needs its own crawlable URL (`/blog?page=2` or `/blog/page/2`) linked with real `<a href>` elements. Google no longer uses `rel="prev/next"`.
- Self-canonical each page. Give each page a distinct title (e.g., "Blog – Page 2").
- For infinite scroll, also provide paginated URLs and update them with the History API.
- Faceted navigation (filters/sorts) can create millions of URLs. Decide which combinations have standalone search demand (index and link them), and `noindex` or `Disallow` the rest. Keep filter state in parameters you can control.

### 5.8 International and multilingual

- Use separate URLs per locale (`/en/`, `/fr/` or subdomains/ccTLDs). Do not serve different languages from one URL based on cookies or `Accept-Language`.
- `hreflang` rules: **bidirectional** (every alternate links back), **self-referencing**, **absolute URLs**, valid codes (`en`, `en-GB`, `pt-BR`), plus `x-default` for the fallback.

```html
<link rel="alternate" hreflang="en" href="https://www.example.com/en/pricing">
<link rel="alternate" hreflang="fr" href="https://www.example.com/fr/tarifs">
<link rel="alternate" hreflang="x-default" href="https://www.example.com/en/pricing">
```

- Set `<html lang="…">` correctly (accessibility and other engines use it). Translate titles, descriptions, headings, alt text, and structured data, not only body copy. Machine-translated, unreviewed pages at scale are a quality risk.

## 6. On-page HTML

### 6.1 Minimum viable `<head>` for an indexable page

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Core Web Vitals Guide: LCP, INP, CLS | Example</title>
  <meta name="description" content="What the three Core Web Vitals measure, the 2026 thresholds, and the fixes that move them.">
  <link rel="canonical" href="https://www.example.com/guides/core-web-vitals">
  <meta name="robots" content="index, follow, max-image-preview:large">

  <meta property="og:type" content="article">
  <meta property="og:title" content="Core Web Vitals Guide: LCP, INP, CLS">
  <meta property="og:description" content="What the three Core Web Vitals measure and how to fix them.">
  <meta property="og:url" content="https://www.example.com/guides/core-web-vitals">
  <meta property="og:image" content="https://www.example.com/og/core-web-vitals.png">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
</head>
```

### 6.2 Titles

- Unique per page; lead with the primary topic; brand last (`Topic | Brand`). Roughly 50–60 characters keeps most titles untruncated, but length is pixel-based, so treat it as a guideline.
- Describe the page honestly. Google rewrites titles it finds misleading, stuffed, or boilerplate.
- In frameworks, use a **title template** in the root layout and set only the page-specific part in each route.

### 6.3 Meta descriptions

- Not a ranking factor; they shape the snippet and click-through. One unique, accurate sentence or two (~120–160 chars) that tells the searcher what they will get.
- Google often substitutes text from the page. A good description still helps, and a missing one forces a guess.
- Never duplicate across pages. If you cannot write a specific one, generate it from the page's real summary field, not a template.

### 6.4 Headings and semantic structure

- Exactly one clear `<h1>` that states the page topic (more than one is technically valid HTML5, but one is unambiguous). Follow with `<h2>`/`<h3>` in logical order without skipping levels for styling.
- Use landmarks and semantic elements: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`, `<figure>`/`<figcaption>`, `<time datetime>`, lists for lists, `<table>` for tabular data.
- Style with CSS; choose elements by meaning. This is also what accessibility tools and AI parsers rely on.

### 6.5 Links

- Navigation uses `<a href="/real/path">`. Buttons (`<button>`) are for actions.
- Anchor text describes the destination ("pricing plans", not "click here").
- Ensure every indexable page is reachable via internal links within a few clicks of the homepage; add breadcrumbs, related links, and hub pages. A page that appears only in a sitemap (an orphan) is weak.
- External links to untrusted or paid destinations get `rel="sponsored"`/`"ugc"`/`"nofollow"` as appropriate. Open-in-new-tab links get `rel="noopener"`.

### 6.6 Images, video, and fonts

```html
<img src="/img/hero-1200.avif"
     srcset="/img/hero-600.avif 600w, /img/hero-1200.avif 1200w, /img/hero-2000.avif 2000w"
     sizes="(max-width: 800px) 100vw, 800px"
     width="1200" height="630"
     alt="Dashboard showing LCP dropping from 4.1s to 1.9s after image preloading"
     fetchpriority="high">           <!-- LCP image: eager, high priority -->

<img src="/img/diagram.webp" width="800" height="450" alt="…" loading="lazy" decoding="async">
```

- **Alt text** states what the image conveys in context (empty `alt=""` only for purely decorative images). No keyword stuffing; do not start with "image of."
- Always set `width` and `height` (or CSS `aspect-ratio`) to prevent layout shift.
- Use modern formats (AVIF/WebP) with `srcset`/`sizes`; descriptive file names (`core-web-vitals-chart.png`).
- **Lazy-load below-the-fold images only.** Never lazy-load the LCP image.
- Images must be in `<img>`/`<picture>` elements (or CSS only if purely decorative); Google does not index CSS background images as content.
- Videos: provide a poster, a transcript or captions where possible, and make the page useful without the video. Add `VideoObject` only if it matches visible content.
- Fonts: self-host, preload only the one or two critical files (`<link rel="preload" as="font" type="font/woff2" crossorigin>`), and set `font-display: swap` (or `optional`).

### 6.7 Social/sharing metadata

Open Graph and Twitter Card tags do not affect rankings, but they control how links look when shared, which drives clicks. Provide `og:title`, `og:description`, `og:image` (1200×630, absolute URL, reachable without auth), `og:url`, `og:type`, and `twitter:card`.

## 7. Structured data (schema.org JSON-LD)

Structured data helps systems understand entities and may make a page eligible for rich results. It never guarantees them and is not a ranking shortcut.

### 7.1 Rules

- Use **JSON-LD** in a `<script type="application/ld+json">` block (Google's preferred format), rendered server-side.
- Mark up only what is **visible on the page** and true. Do not invent ratings, reviews, prices, availability, or business details. Use real values from the data layer; if a value is unknown, omit the property.
- Use absolute URLs and ISO 8601 dates. Keep `@id`s stable so entities can be cross-referenced (`Organization` ← `Article.publisher`).
- Escape `<` as `\u003c` when serializing JSON into HTML to prevent script injection.
- Validate with Google's Rich Results Test and the Schema Markup Validator. Fix errors; treat warnings case by case.

### 7.2 What to use (volatile)

Google keeps pruning rich result types. **HowTo** rich results were removed in 2023, and **FAQ** rich results stopped appearing in Google Search on **May 7, 2026**, with Search Console reporting and Rich Results Test support being phased out. Markup can stay (other consumers may read it), but do **not** add FAQPage or HowTo markup expecting a SERP feature, and do not report it as a win. Before investing in any type, check Google's Search Gallery: https://developers.google.com/search/docs/appearance/structured-data/search-gallery

Reliably useful, content-accurate types for most sites:

| Page type | Schema types |
|---|---|
| Any site | `Organization` (name, url, logo, `sameAs`), `WebSite` |
| Hierarchy | `BreadcrumbList` |
| Articles/blog | `Article` / `BlogPosting` / `NewsArticle` with `headline`, `image`, `datePublished`, `dateModified`, `author` (`Person` with `url`), `publisher` |
| Products | `Product` + `Offer` (price, priceCurrency, availability), plus `AggregateRating`/`Review` **only** if real reviews are shown on the page |
| Local business | `LocalBusiness` (or subtype) with real NAP, hours, geo |
| Software | `SoftwareApplication` / `WebApplication` |
| Events, jobs, recipes, video, courses | `Event`, `JobPosting`, `Recipe`, `VideoObject`, per Google's current docs |

### 7.3 Example: article with breadcrumbs

```tsx
// components/JsonLd.tsx (server component)
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

// usage in the page
<JsonLd data={{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": `${SITE}/blog/${post.slug}#article`,
      headline: post.title,
      image: [post.ogImage],
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: { "@type": "Person", name: post.author.name, url: `${SITE}/authors/${post.author.slug}` },
      publisher: { "@id": `${SITE}/#organization` },
      mainEntityOfPage: `${SITE}/blog/${post.slug}`,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
        { "@type": "ListItem", position: 3, name: post.title },
      ],
    },
  ],
}} />
```

### 7.4 Example: product (only with real data)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Trail Runner 2",
  "image": ["https://www.example.com/img/trail-runner-2.jpg"],
  "description": "Lightweight trail shoe with a 6 mm drop.",
  "sku": "TR2-BLK-42",
  "brand": { "@type": "Brand", "name": "Example" },
  "offers": {
    "@type": "Offer",
    "url": "https://www.example.com/p/trail-runner-2",
    "priceCurrency": "USD",
    "price": "129.00",
    "availability": "https://schema.org/InStock"
  }
}
```

Keep price and availability in sync with the visible page and with any merchant feed; mismatches get rich results suppressed.

## 8. Performance and Core Web Vitals

Core Web Vitals are Google's real-user experience metrics. A page passes only if the **75th percentile** of real visits is "good" on **each** metric, per device class (mobile and desktop are assessed separately; mobile is usually the hard one). The thresholds have been stable since INP replaced FID in March 2024 (volatile; check web.dev/vitals).

| Metric | Good | Poor | Measures |
|---|---|---|---|
| **LCP** Largest Contentful Paint | ≤ 2.5 s | > 4.0 s | Loading: when the main content paints |
| **INP** Interaction to Next Paint | ≤ 200 ms | > 500 ms | Responsiveness across all interactions in a visit |
| **CLS** Cumulative Layout Shift | ≤ 0.1 | > 0.25 | Visual stability |

TTFB ≤ 0.8 s is a useful diagnostic target because LCP cannot start before the server responds. Fix the **worst** metric first; one failing metric fails the page.

### 8.1 LCP

LCP time splits into four parts: TTFB, resource load delay, resource load duration, element render delay. Find which dominates (Lighthouse/PageSpeed "LCP breakdown", or `web-vitals` attribution), then:

- **Identify the LCP element** (usually the hero image or an `<h1>` block) and make it discoverable in the initial HTML, not injected by JS or referenced only from CSS.
- **Prioritize it**: `fetchpriority="high"`, no `loading="lazy"`, and preload when it is otherwise discovered late (CSS background, JS-inserted).
- **Shrink it**: AVIF/WebP, correct `srcset`/`sizes`, no oversized originals.
- **Cut TTFB**: CDN and edge caching, static generation, cache HTML for anonymous users, avoid waterfalls of server-side fetches (`Promise.all`).
- **Remove render-blocking work**: inline the small amount of critical CSS or keep CSS lean, `defer`/`async` scripts, no blocking third-party scripts in `<head>`.
- **Do not render the LCP element client-side** after hydration or behind a skeleton.

```html
<link rel="preload" as="image" href="/img/hero-1200.avif" imagesrcset="/img/hero-600.avif 600w, /img/hero-1200.avif 1200w" imagesizes="100vw" fetchpriority="high">
```

### 8.2 INP

INP is dominated by main-thread blocking. Look for long tasks (>50 ms) during and after hydration and in event handlers.

- Ship less JavaScript: code-split by route, lazy-load below-the-fold components and heavy widgets, drop unused dependencies, prefer server components/islands/partial hydration where the framework supports them.
- Break up long work and yield to the main thread:

```js
const yieldToMain = () =>
  globalThis.scheduler?.yield ? scheduler.yield() : new Promise((r) => setTimeout(r, 0));

async function processAll(items) {
  let last = performance.now();
  for (const item of items) {
    handle(item);
    if (performance.now() - last > 40) { await yieldToMain(); last = performance.now(); }
  }
}
```

- Keep the visual response to an interaction immediate; move non-urgent work (analytics, state sync) after the next paint. In React use `startTransition`/`useDeferredValue` for expensive updates.
- Avoid layout thrashing (interleaved DOM reads and writes), huge DOMs (virtualize long lists; `content-visibility: auto` for offscreen sections), and synchronous third-party handlers.
- Load third-party scripts (tag managers, chat, A/B tools) `async`/`defer` or after interaction, and audit what each costs.

### 8.3 CLS

- Reserve space for everything that loads late: `width`/`height` or `aspect-ratio` on images, video, iframes, and embeds; fixed-height containers for ads, banners, and consent bars.
- Never insert content above existing content after load (cookie banners should overlay or occupy pre-reserved space).
- Fonts: preload critical fonts, use `font-display: swap`/`optional`, and tune fallback metrics (`size-adjust`, `ascent-override`) or use the framework's font optimizer.
- Animate with `transform`/`opacity`, not `top`/`left`/`height`.

### 8.4 Delivery hygiene

Brotli/gzip compression; HTTP/2 or HTTP/3; long-lived `immutable` caching for fingerprinted assets and short/revalidated caching for HTML; `preconnect` only to the one or two origins truly needed early; avoid `unload` handlers (they break the back/forward cache). Set size budgets for JS, CSS, and images and enforce them in CI.

### 8.5 Measure real users

Lab data (Lighthouse) finds problems; field data decides success. Use CrUX/PageSpeed Insights/Search Console for public field data, and instrument your own:

```js
import { onLCP, onINP, onCLS } from "web-vitals/attribution";

function report(m) {
  navigator.sendBeacon("/api/vitals", JSON.stringify({
    name: m.name, value: m.value, rating: m.rating, id: m.id, path: location.pathname,
  }));
}
onLCP(report); onINP(report); onCLS(report);
```

Never claim "passes Core Web Vitals" from a single Lighthouse run. Say what you measured and in which environment.

## 9. Framework implementation notes

Use the framework's native head/metadata, sitemap, and rendering features rather than hand-rolled tags, so server output is correct.

| Stack | Metadata | Sitemap/robots | Rendering / 404 |
|---|---|---|---|
| **Next.js (App Router)** | `export const metadata` / `generateMetadata`; title template in root layout; `alternates.canonical`; `openGraph`; `robots` | `app/sitemap.ts`, `app/robots.ts` | Server Components by default; `generateStaticParams` for SSG; `notFound()` for true 404s; `next/image` with `priority` (or `preload` in newer versions) for the LCP image; `next/font` |
| **Nuxt** | `useSeoMeta()`, `useHead()`, `useRequestURL()` for absolute URLs | `@nuxtjs/sitemap`, `robots` module | `routeRules` to prerender or ISR; `throw createError({ statusCode: 404 })` |
| **Astro** | Layout component with `<title>`/meta props | `@astrojs/sitemap`, `src/pages/robots.txt.ts` | Static by default (ideal); island hydration only where needed |
| **SvelteKit** | `<svelte:head>` in routes/layouts | Endpoints for `sitemap.xml`/`robots.txt` | `export const prerender = true`; `error(404, …)` |
| **React Router / Remix** | `meta` export per route | Resource routes | Throw `new Response(null, { status: 404 })` from loaders |
| **Angular** | `Title` and `Meta` services | Generated at build | Enable SSR/prerender with `@angular/ssr`; set status in the server response |
| **Vite + React/Vue SPA** | Client head libraries only affect JS-executing crawlers | Static files in `public/` | For indexable content, add SSG/SSR (e.g., a meta-framework or prerender step) rather than shipping an empty shell |
| **WordPress** | Theme declares `add_theme_support('title-tag')`; use one SEO plugin | Plugin or core sitemap | Do not run two SEO plugins; avoid duplicate canonical/schema output |
| **Shopify/e-commerce themes** | `canonical_url`, theme `<head>` | Auto sitemap | Keep variants canonicalized to the product; real inventory in schema |

Next.js App Router example:

```tsx
// app/layout.tsx
import type { Metadata } from "next";
const SITE = process.env.NEXT_PUBLIC_SITE_URL!;

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Example", template: "%s | Example" },
  robots: process.env.APP_ENV === "production"
    ? { index: true, follow: true, "max-image-preview": "large" }
    : { index: false, follow: false },
};

// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;                 // params is async in Next.js 15+
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.summary, publishedTime: post.publishedAt, modifiedTime: post.updatedAt },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();                         // real HTTP 404, not a soft 404
  // …render <article> with a single <h1>, then <JsonLd … />
}
```

Check the installed framework version's docs before relying on an API; metadata and image APIs change between majors.

## 10. Content quality and spam policies

Search systems reward original, accurate, useful content and demote content produced mainly to rank. How content is produced (human, AI, or both) is not the test; originality, accuracy, and usefulness are.

When you generate, template, or scaffold content:

- **Never fabricate** facts, statistics, quotes, testimonials, reviews, author bios, credentials, case studies, or business details. Use real data supplied by the user or the data layer. Placeholder text must not ship; if real content is missing, say so in your report and mark the page `noindex` until it exists.
- **Match search intent.** Decide what the visitor wants (learn, compare, buy, find a place) and build the page to satisfy it. Put the main answer or offer early; support it with depth, evidence, and first-hand detail (original images, data, steps actually performed).
- **Use language naturally.** Put the primary topic in the title, `<h1>`, and opening; cover related subtopics and real questions. Do not repeat keyword variants, and do not create one page per keyword variant.
- **Show provenance** where it matters: named author with a real bio page, publish and meaningful-update dates, cited sources. Update `dateModified` only when content materially changes.
- **Programmatic/templated pages** (city, product, comparison, integration pages) need unique value per page, such as unique data, real inventory, local specifics, or original analysis. Swapping a noun in a template is scaled content abuse. Add quality gates: a minimum amount of unique data per page, a duplicate-similarity check, `noindex` until a page passes, and a cap on batch size.

Do not implement any of these (they violate Google's spam policies and risk manual actions or demotion): cloaking (different content for bots vs users), sneaky redirects, hidden text or links, keyword stuffing, doorway pages, scaled content abuse, site reputation abuse (hosting third-party content to borrow a site's ranking), expired-domain abuse, link schemes (paid or automated link building), fake or self-serving reviews markup, and misleading functionality. Do not place hidden text or instructions aimed at AI agents in pages; that is cloaking-adjacent and a prompt-injection vector.

User experience also counts: avoid intrusive interstitials that cover content right after a visitor arrives from search, avoid ad layouts that push the main content below the fold, and keep the site on HTTPS with no mixed content.

## 11. AI search and answer-engine visibility (GEO/AEO)

**Google AI Overviews and AI Mode** draw on the same ranking and quality systems as regular Search. Google's own guidance (published 2026, volatile) says site owners do **not** need `llms.txt`, special AI markup or schema, content chunking, AI-specific rewrites, or manufactured brand mentions. What it does emphasize is first-hand, original content; strong images and video; and technical hygiene (crawlable, indexable, fast, with accurate structured data). Traffic from AI features is reported within Search Console's overall Search performance totals.

Therefore:

1. Do all of sections 5–10 well. This is the strategy.
2. Do not add "AI-only" tricks and do not tell the user they will boost AI Overviews visibility. There is no directive that keeps a page in Search but out of AI features. The available controls are `noindex`, `nosnippet`, `data-nosnippet`, and `max-snippet`.
3. Make main content available as plain server-rendered HTML with clear headings, descriptive link text, and specific facts. Many non-Google AI crawlers do not execute JavaScript, so this is what lets them read the page at all.

**Other AI crawlers** are controlled through robots.txt, and they fall into three groups. Treat the groups differently (volatile: tokens change; confirm in each vendor's docs):

| Purpose | Tokens (examples) | Default stance |
|---|---|---|
| **Search/citation** (builds the index that answers cite and link to) | `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot` | **Allow.** Blocking removes the site from those assistants' answers |
| **Training** (collects data for model training) | `GPTBot`, `ClaudeBot`, `CCBot`, `Applebot-Extended`, `Google-Extended` (a control token only, absent from logs) | **Business decision: ask the user.** Do not block or allow silently. `Google-Extended` does not affect Search ranking or AI Overviews |
| **User-initiated fetch** (retrieves a page because a person asked) | `ChatGPT-User`, `Claude-User`, `Perplexity-User` | May not honor robots.txt. Protect private content with authentication, not robots.txt |

Rules for agents:

- If the user has no AI-crawler policy, **write no AI-specific rules**; just avoid blanket blocks (`User-agent: *` + `Disallow: /`) and WAF/CDN bot-fight settings that accidentally block search crawlers.
- If the user wants to opt out of training only, disallow the training tokens and leave search/citation tokens allowed.
- Verify crawler claims by log analysis (user-agent plus reverse-DNS/IP ranges the vendor publishes); user-agent strings can be spoofed.
- `llms.txt` is optional and harmless. Google does not use it. If the user wants one (for example, a docs site that wants to give agents a curated Markdown index), create a short, accurate, link-checked file and make **no** ranking claims. Do not spend effort here before fundamentals are done.
- Entity clarity helps every system: a consistent brand name, an `Organization` entity with `sameAs` links to real profiles, named authors, and consistent facts (hours, address, pricing) across the site and its feeds.

## 12. Definition of done by page type

### 12.1 Per page type

| Type | Must have |
|---|---|
| **Home** | Unique title with brand and core offering; one `<h1>`; `Organization` + `WebSite` schema; crawlable links to key sections; canonical to the clean root |
| **Article / blog post** | Unique title/description; `<article>`, one `<h1>`; byline linking to author page; visible published/updated dates; `BlogPosting`/`Article` + `BreadcrumbList`; hero image with dimensions and alt; related-content links; OG image |
| **Product** | Unique title with product name; real description (not manufacturer boilerplate only); `Product` + `Offer` matching visible price/stock; variants canonicalized to the parent or each indexed deliberately; images with alt; reviews markup only for real, visible reviews; breadcrumbs |
| **Category / listing** | Descriptive intro copy; crawlable pagination; filters controlled (index or `noindex`); self-canonical per page; `BreadcrumbList`; no empty pages indexed |
| **Docs / help** | Stable URLs; one topic per page; headings with anchors; sidebar and prev/next as real links; code examples in text, not images; `dateModified`; version handling (canonicalize old versions to latest or `noindex` them) |
| **Landing page** | Single clear topic and intent; unique copy (not cloned from sibling campaigns); fast LCP; no intrusive pop-ups; `noindex` paid-only variants that duplicate others |
| **Search results, cart, checkout, account, admin, thank-you** | `noindex` (or authentication); excluded from sitemap; no internal links from indexable pages that waste crawl |
| **404 page** | HTTP 404; links back to key sections; `noindex` unnecessary because the status already excludes it |

### 12.2 Migrations, redesigns, and launches

Rebuilds are where sites lose traffic. When replacing URLs, platforms, or domains:

1. **Inventory** old URLs from the sitemap, analytics, Search Console, and a crawl. Include images and PDFs that earn traffic or links.
2. **Map 1:1** old to new with 301s. Map to the closest equivalent page, never mass-redirect to the homepage (that reads as soft 404s).
3. **Preserve** content, titles, headings, internal links, and structured data on pages that already perform; improve them after the move stabilizes.
4. **Update** canonicals, sitemaps, hreflang, internal links, OG URLs, and JSON-LD to the new URLs; keep the old sitemap briefly to speed rediscovery.
5. **Test redirects in bulk** with a script that asserts status, single hop, and final URL for every mapping.
6. **Launch checklist**: staging auth removed, `noindex` removed, robots.txt correct, HTTPS and host normalization working, analytics and Search Console verified.
7. **Keep redirects** for at least a year. For domain changes, also use Search Console's change-of-address tool.
8. Avoid changing URLs, design, and content all at once if the schedule allows; separating them makes regressions diagnosable.

## 13. Verification

Never report SEO work as done without evidence. Inspect what the server actually returns.

### 13.1 Fast checks

```bash
# Status chain and headers (redirects, X-Robots-Tag, Link canonical, caching)
curl -sSIL https://www.example.com/page

# Initial HTML exactly as a non-JS crawler sees it: is the real content here?
curl -sS https://www.example.com/page | head -c 6000

# Does a missing page return a real 404?
curl -s -o /dev/null -w "%{http_code}\n" https://www.example.com/definitely-not-a-page
```

### 13.2 Smoke-test script (Python standard library only)

Save as `scripts/seo_check.py`, run it against local or deployed URLs, and wire it into CI for key routes. It exits non-zero on any CRITICAL or HIGH finding.

```python
#!/usr/bin/env python3
"""SEO smoke test. Usage: python seo_check.py URL [URL...]
Exit code 1 if any CRITICAL or HIGH issue is found."""
import json, re, sys, urllib.error, urllib.request
from html.parser import HTMLParser

PLACEHOLDER = re.compile(r"create (next|react) app|vite \+|^document$|^untitled|lorem ipsum|^home$", re.I)
SEV = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3, "INFO": 4}


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title, self.lang = "", None
        self.h1 = self.imgs = self.imgs_no_alt = self.bad_links = 0
        self.meta, self.canonicals, self.hreflang, self.ld = {}, [], [], []
        self._in_title = self._in_ld = False
        self._buf = ""

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "title":
            self._in_title = True
        elif tag == "h1":
            self.h1 += 1
        elif tag == "meta":
            key = (a.get("name") or a.get("property") or "").lower()
            if key:
                self.meta[key] = a.get("content") or ""
        elif tag == "link":
            rel = (a.get("rel") or "").lower().split()
            if "canonical" in rel:
                self.canonicals.append(a.get("href") or "")
            if "alternate" in rel and a.get("hreflang"):
                self.hreflang.append(a["hreflang"])
        elif tag == "img":
            self.imgs += 1
            if "alt" not in a:
                self.imgs_no_alt += 1
        elif tag == "a" and not a.get("href"):
            self.bad_links += 1
        elif tag == "script" and (a.get("type") or "").lower() == "application/ld+json":
            self._in_ld, self._buf = True, ""

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        elif tag == "script" and self._in_ld:
            self._in_ld = False
            self.ld.append(self._buf)

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        elif self._in_ld:
            self._buf += data


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "seo-check/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status, r.geturl(), r.headers, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, url, e.headers, e.read().decode("utf-8", "replace")


def check(url):
    status, final, headers, html = fetch(url)
    p = Page()
    p.feed(html)
    out = []
    add = lambda sev, msg: out.append((sev, msg))

    if status != 200:
        add("HIGH", f"HTTP {status} (expected 200 for an indexable page)")
    if final != url:
        add("INFO", f"redirected to {final}")

    title = " ".join(p.title.split())
    if not title:
        add("CRITICAL", "missing <title>")
    else:
        if PLACEHOLDER.search(title):
            add("HIGH", f"placeholder-looking title: {title!r}")
        if len(title) > 65:
            add("LOW", f"title is {len(title)} chars; may truncate in results")

    desc = p.meta.get("description", "").strip()
    if not desc:
        add("MEDIUM", "missing meta description")
    elif len(desc) > 170:
        add("LOW", f"meta description is {len(desc)} chars; may truncate")

    if p.h1 != 1:
        add("MEDIUM", f"{p.h1} <h1> elements (want exactly 1)")

    if len(p.canonicals) != 1:
        add("HIGH", f"{len(p.canonicals)} canonical links (want exactly 1)")
    else:
        c = p.canonicals[0]
        if re.search(r"localhost|127\.0\.0\.1|\.local(\W|$)", c):
            add("CRITICAL", f"canonical points at a local/dev host: {c}")
        elif not re.match(r"https?://", c):
            add("HIGH", f"canonical is not absolute: {c!r}")

    robots = f"{p.meta.get('robots', '')} {headers.get('X-Robots-Tag', '')}".lower()
    if "noindex" in robots:
        add("HIGH", "noindex present (intended for this page?)")

    if not p.lang:
        add("MEDIUM", "missing <html lang>")
    if "viewport" not in p.meta:
        add("HIGH", "missing viewport meta (mobile-first indexing)")
    if "og:image" not in p.meta:
        add("LOW", "missing og:image")
    if p.imgs_no_alt:
        add("MEDIUM", f"{p.imgs_no_alt}/{p.imgs} <img> without alt attribute")
    if p.bad_links:
        add("MEDIUM", f"{p.bad_links} <a> without href (not crawlable)")

    for i, raw in enumerate(p.ld, 1):
        try:
            json.loads(raw)
        except ValueError as e:
            add("HIGH", f"JSON-LD block {i} is invalid JSON: {e}")

    body = re.sub(r"(?is)<(script|style|noscript)\b.*?</\1>", " ", html)
    words = len(re.sub(r"<[^>]+>", " ", body).split())
    if words < 80:
        add("HIGH", f"only ~{words} words in initial HTML; main content may be client-rendered")

    return sorted(out, key=lambda i: SEV[i[0]])


def main(urls):
    failed = False
    for url in urls:
        print(f"\n== {url}")
        issues = check(url)
        if not issues:
            print("  ok")
        for sev, msg in issues:
            print(f"  [{sev}] {msg}")
            failed |= sev in ("CRITICAL", "HIGH")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1:])
```

The script catches the repeat offenders from section 3, but it cannot judge content quality, canonical correctness relative to the live index, or field performance. Use the tools below for those.

### 13.3 Tools

- **Search Console**: URL Inspection (rendered HTML, Google-selected canonical, indexing status), Pages report, Sitemaps, Core Web Vitals, Performance (AI-feature traffic is included in totals).
- **PageSpeed Insights / CrUX**: field Core Web Vitals; **Lighthouse CI** for lab regression gates (assert LCP, CLS, total blocking time, and the SEO category).
- **Rich Results Test and Schema Markup Validator**: structured data (remember that FAQ and HowTo no longer yield rich results).
- **Crawler** (Screaming Frog, Sitebulb, or a script): broken links, redirect chains, orphans, duplicate titles, canonical mismatches.
- **Server logs**: which crawlers hit which URLs and with what status codes.

### 13.4 Diagnosing "my page is not indexed / not ranking"

Work down this list and stop at the first hit:

1. Is it blocked in robots.txt, or returning 4xx/5xx or a soft 404?
2. Does it carry `noindex` (meta or `X-Robots-Tag`), possibly from a staging flag?
3. Does the canonical point elsewhere, or does Google select a different canonical (URL Inspection)?
4. Does the initial HTML contain the content, and does the rendered HTML in URL Inspection match?
5. Is it reachable by crawlable internal links and listed in the sitemap, or an orphan?
6. Is it a near-duplicate or thin page? "Crawled, currently not indexed" usually signals quality or duplication; "Discovered, currently not indexed" usually signals low priority or crawl capacity.
7. Only then consider competitiveness, intent match, and authority, which are content and brand work for the user, not code fixes.

## 14. Reporting format

End every SEO-relevant task with a short report. Do not claim rankings, traffic, or rich results outcomes; no one can promise them.

```
SEO summary
- Scope: <routes/templates touched> | Stack/rendering: <e.g., Next.js 15, SSG>
- Changed: <titles/meta, canonical, sitemap, schema, redirects, perf fixes … with file paths>
- Verified: <what you ran and the result: curl status chain, seo_check.py output, Lighthouse numbers + environment>
- Assumptions: <canonical origin, locales, indexability decisions, AI-crawler stance>
- Not verified / needs the user: <field CWV data, Search Console submission, real business data for schema, content gaps>
- Risks / follow-ups: <ordered by severity>
```

## 15. Pre-merge checklist

**Crawl and index**
- [ ] Indexable routes return 200 with content in the initial HTML; missing pages return real 404/410
- [ ] One canonical origin; HTTP→HTTPS and host/slash normalization via 301; no chains
- [ ] Self-referencing absolute canonical on every indexable page; no `localhost`/preview URLs anywhere
- [ ] robots.txt correct for production; no CSS/JS blocked; sitemap lists only canonical, indexable, 200 URLs; non-production is auth-protected and `noindex`
- [ ] Utility/private pages `noindex` or authenticated and absent from the sitemap
- [ ] Pagination and filters crawlable or deliberately excluded; hreflang bidirectional with `x-default`

**On page**
- [ ] Unique, accurate `<title>` and meta description per page; no framework defaults or placeholder text
- [ ] One `<h1>`; logical heading outline; semantic landmarks
- [ ] Navigation via `<a href>`; descriptive anchors; no orphan pages; breadcrumbs where hierarchical
- [ ] Images: alt text, `width`/`height`, modern formats, `srcset`; LCP image eager with `fetchpriority="high"`; others lazy
- [ ] `<html lang>`, viewport meta, favicon, OG/Twitter tags with absolute image URLs

**Structured data**
- [ ] JSON-LD only for visible, true content; validates; no FAQ/HowTo added for SERP features; no fabricated ratings or business data

**Performance**
- [ ] LCP element discoverable and prioritized; no layout shift sources; long tasks and third-party scripts audited; field data (or an instrumented plan) for LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75

**Quality and safety**
- [ ] No fabricated content, hidden text, cloaking, doorway or scaled low-value pages; programmatic pages gated
- [ ] AI-crawler stance confirmed with the user or left unset; search crawlers not blocked; no `llms.txt` ranking claims
- [ ] Verification evidence captured and the report written

## 16. Volatile facts and where to confirm them

Re-check these before asserting them, preferably against the primary source:

| Topic | State as of Oct 2026 | Source |
|---|---|---|
| Core Web Vitals metrics and thresholds | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75; unchanged since INP replaced FID (Mar 2024) | web.dev/vitals |
| FAQ rich results | Stopped appearing in Google Search on May 7, 2026; reporting being removed | Google FAQPage structured data docs |
| HowTo rich results | Removed in 2023 | Google Search Central blog |
| Supported rich result types | Pruned periodically | Google Search Gallery |
| AI Overviews / AI Mode guidance | Same ranking systems; no special markup, `llms.txt`, chunking, or AI rewrites needed | Google Search Central: "AI features and your website" and the generative-AI optimization guide |
| AI crawler user-agent tokens | See section 11; tokens and behavior change | OpenAI, Anthropic, Perplexity, Google, and Apple crawler documentation |
| Spam policies | Cloaking, doorway pages, scaled content abuse, site reputation abuse, etc. | Google Search spam policies |

Primary sources: Google Search Central (developers.google.com/search), web.dev, and each AI vendor's crawler documentation. When a blog or tool vendor contradicts these, trust the primary source.
