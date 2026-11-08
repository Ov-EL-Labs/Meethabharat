# WriteSkill.md — Web Development Rules for AI Coding Agents

> **Mission:** Write web code that is correct, secure, accessible, fast, search-friendly, maintainable, and easy for humans to understand. Optimize for the smallest *reasonable* solution—not the fewest characters. Code is read, debugged, reviewed, and changed far more often than it is first written.

These rules apply to AI agents creating, editing, reviewing, or refactoring websites and web applications. Adapt examples to the repository's actual framework and conventions.

## 1. Rules of engagement

1. **Inspect before editing.** Read the project instructions, package scripts, framework configuration, nearby components, and relevant tests. Identify the stack and its existing conventions before choosing tools or adding dependencies.
2. **Make the smallest complete change.** Solve the requested problem without unrelated rewrites, speculative features, or needless architecture changes.
3. **Preserve working behavior.** Check callers, routes, data contracts, loading/error states, environment variables, and existing tests before changing interfaces.
4. **Prefer established platform features.** Use semantic HTML, standard browser APIs, and existing project utilities before adding a dependency.
5. **Be explicit about uncertainty.** Never invent package APIs, environment variables, test results, or facts about the codebase. Verify uncertain behavior from local source or primary documentation.
6. **Do not claim checks you did not run.** Report exactly which tests, linting, type checks, builds, or browser checks passed, failed, or were not run.
7. **Follow higher-priority instructions.** Repository-specific requirements, framework constraints, security rules, and user requirements take precedence over stylistic preferences here.

## 2. The standard workflow

For each task, follow this short loop:

1. **Understand:** Restate the expected behavior internally. Identify relevant files, constraints, edge cases, and how success will be verified.
2. **Plan:** Choose the smallest safe implementation. Split risky or cross-cutting work into steps.
3. **Implement:** Match the project's patterns. Keep changes focused and types/contracts accurate.
4. **Verify:** Run the most relevant tests and checks available. Inspect the diff for regressions, accidental edits, secrets, and dead code.
5. **Report:** Summarize what changed, why, and what validation ran. Call out limitations honestly.

If a task is unclear, inspect the codebase and make a reasonable, low-risk assumption when possible. Ask only when the missing information changes the solution materially or risks destructive behavior.

## 3. Write for the next human

### Readability is a requirement

- Use descriptive names that communicate purpose: `isCheckoutReady`, `getUserById`, and `visibleProducts` are better than `x`, `tmp`, or `data2`.
- Prefer small functions with one clear responsibility. Extract a helper when it names a meaningful operation or removes real duplication.
- Keep control flow easy to scan. Use guard clauses and early returns when they reduce nesting.
- Use consistent formatting and follow the repository's formatter and lint rules.
- Keep related code together. Separate UI, domain logic, data access, and infrastructure when doing so clarifies responsibilities.
- Comment on **why**, constraints, surprising behavior, and non-obvious trade-offs—not on every line of self-explanatory code.
- Write useful error messages that help a developer or user understand what failed and what to do next, without exposing secrets or internals.
- Prefer straightforward code over clever one-liners, deeply nested ternaries, dense chains, hidden side effects, or unexplained abbreviations.

### Keep abstractions useful

- Avoid duplicated logic when a shared helper or data-driven structure genuinely makes updates safer.
- Do not create a generic framework for a one-off feature without a clear future use.
- Avoid wrappers that only rename a function without adding meaning, safety, or reuse.
- Do not split code into many tiny files solely to appear modular. Organize around real responsibilities and project conventions.
- Avoid premature optimization. Measure performance before adding complexity unless a known bottleneck or clear cost is already evident.

### Example: readable reuse

Instead of repeating near-identical markup for every item, represent the changing information as data and render the shared structure once:

```tsx
const links = [
  { href: "/docs", label: "Documentation" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About us" },
];

export function FooterLinks() {
  return (
    <nav aria-label="Footer">
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

Do not abstract genuinely different UI just to force it into one component. Reuse should make intent clearer, not hide important differences.

## 4. HTML, CSS, and UI

### HTML and semantics

- Use semantic elements for their intended purpose: `header`, `nav`, `main`, `section`, `article`, `form`, and `footer` where appropriate.
- Use a real `<a href="...">` for navigation and a real `<button>` for actions. Do not make clickable `<div>` elements the default.
- Give pages a meaningful title and a logical heading hierarchy. Headings should describe the content beneath them, not merely style text.
- Associate each form control with a visible or programmatic label. Use native input types and validation where appropriate.
- Provide useful alternative text for meaningful images. Use `alt=""` for decorative images so assistive technology can skip them. Never stuff alt text with keywords.
- Reserve space for images and embeds using dimensions or `aspect-ratio` to reduce layout movement.
- Keep important content available as text, not only embedded in an image or canvas.

### CSS and responsive design

- Build mobile-first where that fits the design; support narrow screens, zoom, and varied input methods.
- Use flexible layouts (`flex`, `grid`, fluid sizing, and sensible `minmax()` values) rather than hard-coded coordinates for ordinary page structure.
- Define design tokens/custom properties for genuinely repeated colors, spacing, typography, and radii. Avoid turning every single value into an unnecessary abstraction.
- Keep contrast legible and focus indicators visible. Do not convey status through color alone.
- Respect `prefers-reduced-motion`; avoid decorative motion that blocks reading or interaction.
- Avoid layout hacks and excessive `!important`. Fix the source of a styling conflict where practical.
- Test long text, empty content, errors, loading states, and small screens—not only the happy path at one desktop width.

## 5. JavaScript and TypeScript

- Use the language features and target supported by the project's configured runtime. Do not assume the newest API is available without checking support or feature-detecting where necessary.
- In TypeScript, model real data with useful types. Avoid `any`, unsafe casts, non-null assertions, and duplicated type definitions unless there is a documented reason.
- Validate untrusted data at system boundaries: form input, API responses, URL parameters, file uploads, and third-party messages. A TypeScript type does not validate runtime data.
- Keep state minimal. Do not store values that can be derived cheaply from existing state or props.
- Avoid effects for values that can be calculated during render. Use effects for synchronizing with external systems, subscriptions, timers, or imperative browser APIs—and clean them up correctly.
- Avoid unnecessary `useMemo`, `useCallback`, global state, event buses, and custom hooks. Use them when they solve a demonstrated problem or fit an established project pattern.
- Handle asynchronous work carefully: loading, success, empty, failure, cancellation/stale responses, and duplicate submissions when relevant.
- Do not silently swallow errors. Catch an error when the code can recover, add useful context, or show a meaningful response; otherwise let the correct error boundary handle it.
- Use `const` by default; use `let` only when reassignment is required. Avoid mutable shared state unless it is intentional.
- Keep business rules independent from UI details when that separation makes them easier to test and reuse.

## 6. Accessibility: build for real people

Target **WCAG 2.2 AA** as a practical baseline where applicable; automated audits alone cannot prove conformance.

- Make all functionality keyboard-operable. Ensure focus is visible, predictable, and not trapped.
- Keep focus order logical. For dialogs and menus, manage focus correctly, support expected keyboard behavior, and return focus to the trigger when appropriate.
- Use native controls before custom widgets. Custom controls require correct semantics, keyboard behavior, state announcements, and screen-reader testing.
- Use accessible names for controls, descriptive link text, labelled form fields, and specific inline validation messages.
- Announce important asynchronous updates where appropriate, for example with a restrained `aria-live` region. Do not add ARIA roles when native HTML already provides the right semantics.
- Support zoom and text resizing. Do not rely on tiny text, hover-only interactions, color-only status, or motion-sensitive effects.
- Test with keyboard navigation and at least one accessibility tool. Manually inspect the interactions the tool cannot understand.

Reference: [W3C Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG/).

## 7. Performance and Core Web Vitals

Optimize the user experience, not a score in isolation. Measure first, improve the largest real bottleneck, then measure again.

Google's current Core Web Vitals guidance defines these **good** field-data thresholds at the 75th percentile:

- **LCP (Largest Contentful Paint):** 2.5 seconds or less.
- **INP (Interaction to Next Paint):** 200 milliseconds or less.
- **CLS (Cumulative Layout Shift):** 0.1 or less.

Practical rules:

- Ship less JavaScript. Prefer server-rendered/static HTML when it suits the app and defer client-side code until it is needed.
- Split code by route or feature when it reduces initial work. Lazy-load below-the-fold images and genuinely optional heavy features; do not lazy-load the main image likely to be the LCP element.
- Optimize images: choose appropriate dimensions and modern formats, use responsive sources when useful, and avoid sending desktop-sized images to small screens.
- Set image/video dimensions or aspect ratios to reserve layout space.
- Minimize render-blocking CSS/JavaScript. Load only fonts and resource hints that are genuinely needed; excessive preloads can hurt performance.
- Avoid long main-thread tasks and expensive work on every render. Debounce or throttle high-frequency work when suitable, and virtualize long lists only when measurement justifies it.
- Cache static assets appropriately, fingerprint versioned build outputs, compress responses, and use a CDN when it benefits the deployment.
- Treat third-party scripts, trackers, chat widgets, and embeds as performance costs. Load only what provides real value.
- Measure with real-user data and suitable lab tools. A fast development machine is not representative of a low-end phone or slow connection.

References: [Google's Core Web Vitals guidance](https://developers.google.com/search/docs/appearance/core-web-vitals), [web.dev Core Web Vitals](https://web.dev/explore/learn-core-web-vitals), and [MDN performance best practices](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/Best_practices).

## 8. Google Search Central / Webmaster guidance

The old Google Webmaster Guidelines are now represented by **Google Search Essentials** and related Search Central documentation. Treat SEO as discoverability and useful information architecture, never as a ranking hack. No implementation guarantees indexing or a particular ranking.

### Crawlability and indexability

- Give each important public page a stable, meaningful URL and unique, descriptive page title.
- Use crawlable links: `<a href="/destination">Descriptive link</a>`. JavaScript-only click handlers and links without an `href` can make navigation harder for crawlers, assistive technology, and users without full client-side functionality.
- Ensure important page content and links are present in rendered HTML. Use server rendering or pre-rendering when appropriate; do not make essential content depend on a user clicking or scrolling before it exists.
- Use meaningful HTTP status codes: `200` for successful content, `404` for a missing page, and correct redirects (such as `301`/`308`) for moved content. Do not return `200` for every nonexistent route.
- Use `robots.txt` to control crawling, not to remove a URL from search results reliably. Use appropriate `noindex` controls when a page should not be indexed, and make sure crawlers can access the page to see those controls.
- Use canonical URLs to consolidate genuinely duplicate or equivalent pages. Keep canonicals consistent with internal links and redirects; do not canonicalize unrelated pages together.
- Generate an accurate XML sitemap for important canonical URLs and submit it through Google Search Console when useful. A sitemap helps discovery but does not guarantee indexing.
- Verify ownership in Google Search Console. Use URL Inspection, indexing reports, and Core Web Vitals reports to diagnose actual issues rather than guessing.

### Helpful content and on-page clarity

- Write original, useful, people-first content that fulfills the page's purpose. Do not mass-produce thin pages, scrape other sites, hide text, keyword-stuff, or create doorway pages.
- Place clear, natural terms users actually search for in the page title, main heading, link text, image alt text where relevant, and body copy. Do not force keywords into every sentence.
- Make page titles, headings, snippets/meta descriptions, and link labels descriptive and distinct. Meta descriptions may help describe a result but do not guarantee a particular snippet.
- Use a sensible heading hierarchy and short sections. Content must be easy to scan and understand on mobile and desktop.
- For images, use ordinary `<img>`/`<picture>` markup when appropriate, descriptive filenames, relevant surrounding copy, and contextual alt text. Ensure lazy-loaded content becomes available when it enters the viewport without requiring a user action Googlebot cannot perform.
- Add structured data only when it accurately represents visible page content and complies with Google's feature-specific requirements. Validate it with the appropriate Rich Results Test; valid markup does not guarantee a rich result.
- Localize `lang` and other locale metadata correctly when the site supports multiple languages. Use explicit, valid URLs for localized variants where needed.
- Do not block essential CSS or JavaScript resources required to render important content.

References: [Google Search Essentials](https://developers.google.com/search/docs/essentials), [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [image SEO best practices](https://developers.google.com/search/docs/appearance/google-images), and [guidance for lazy-loaded content](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading).

## 9. Security and privacy

Treat all user-controlled input and external data as untrusted.

- Keep secrets, private keys, database credentials, and privileged tokens out of source code, client bundles, public environment variables, logs, screenshots, and commit history. Use the platform's secret-management system.
- Never put privileged credentials in browser code. Anything sent to a client must be treated as publicly inspectable.
- Validate input on the server and enforce authorization on every protected operation. Hiding a button in the UI is not access control.
- Use parameterized database queries or the framework's safe query builder. Do not build SQL or shell commands by concatenating untrusted strings.
- Rely on framework escaping for ordinary text rendering. Avoid raw HTML injection (`innerHTML`, `dangerouslySetInnerHTML`, equivalent APIs) unless there is a clear need and an appropriate sanitization strategy.
- Use secure, maintained authentication/session libraries where possible. Configure cookies with appropriate `Secure`, `HttpOnly`, and `SameSite` attributes; follow the framework's CSRF protections.
- Use HTTPS in production. Configure security headers such as a suitable Content Security Policy, `X-Content-Type-Options`, and framing protections based on the application's requirements; do not blindly copy a policy that breaks the app.
- Apply least privilege to database users, API keys, service roles, storage buckets, and deployment permissions.
- Rate-limit sensitive endpoints where appropriate. Validate file type, size, ownership, storage destination, and access for uploads.
- Avoid leaking personal data through logs, analytics, error messages, URLs, or client telemetry. Collect only what the feature needs and document retention where applicable.
- Keep dependencies updated and review package provenance, permissions, and security advisories. Do not add a dependency for a trivial helper.

References: [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/), [XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), and [HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).

## 10. Testing and quality gates

Choose checks that match the change. Prefer existing project scripts over inventing a new toolchain.

- **Unit tests:** business rules, helpers, validation, transformations, and edge cases.
- **Integration tests:** database, API, authentication, and component interactions at meaningful boundaries.
- **End-to-end tests:** key user journeys such as signup, login, checkout, or primary navigation where the project supports them.
- **Static checks:** formatter, linter, type checker, production build, and dependency/security audits when available.
- **Browser checks:** responsive layout, keyboard interactions, console errors, network failures, and loading/empty/error states for meaningful UI changes.
- **SEO checks:** inspect status codes, rendered content, titles, canonicals, crawlable links, robots directives, and structured data where relevant.
- **Accessibility checks:** run automated checks, then manually test keyboard use, focus order, labels, and key screen-reader interactions.

Do not add tests that merely mirror the implementation line by line. Test observable behavior and important failure modes. Avoid flaky tests, arbitrary sleeps, and assertions that can pass while the feature is broken.

Before finishing, inspect the diff and confirm:

- No unrelated files or generated artifacts changed unexpectedly.
- No secrets, debug logs, temporary code, dead branches, or accidental TODOs were introduced.
- Error/loading/empty states are handled where applicable.
- Types and accessibility semantics remain correct.
- Tests and build checks were run—or their absence is clearly reported.

## 11. Token-efficient coding without sacrificing readability

**Optimize the reasoning and implementation path, not just the number of characters in the source file.** There are two separate goals: use AI context/tokens efficiently and avoid unnecessary code shipped to users. Do not confuse either goal with minifying source code humans must maintain.

### A. Spend fewer AI tokens on the work

- Inspect only relevant files first. Use targeted searches for symbols, routes, and call sites instead of dumping the entire repository into context.
- Read project guidance and package scripts once, then retain a concise mental summary of stack, conventions, and test commands.
- When changing code, prefer a focused diff or patch over regenerating a whole large file. Preserve unrelated formatting and content.
- Reuse context already obtained. Do not repeatedly restate the full task, copy the same source into multiple messages, or explain routine changes at excessive length.
- Ask tools for concise output where appropriate. Request the failing test, relevant stack trace, and nearby code—not thousands of lines of logs.
- Start with the simplest viable hypothesis, verify it, and expand investigation only when evidence requires it. Do not call tools or read files speculatively.
- In the final report, state changed behavior, tests run, and known risks briefly. Do not narrate every keystroke or dump large file contents unless requested.
- Keep reusable repository instructions concise, specific, and non-duplicative. Long instructions compete with the actual task for the model's context window.

### B. Write less redundant code

- Use a shared function or component for repeated behavior that changes together; use a data array/config for repeated structures with the same shape.
- Keep one source of truth for repeated business rules, route names, labels, and configuration. Do not copy the same literal or logic into multiple files.
- Use built-in language and platform APIs before installing a library for simple functionality.
- Delete dead code, unused dependencies, unreachable branches, duplicate state, and obsolete comments when they are in scope and safe to remove.
- Prefer derived values over redundant stored state. Avoid multiple transformations of the same data when one clear pass is enough.
- Use direct, idiomatic solutions. Do not add a class, hook, abstraction layer, or dependency just to save a few repeated characters.
- Add comments only where they preserve useful context. A comment that repeats `// increment counter` above `counter++` adds noise and context cost.

### C. Keep the savings safe

- **Do not minify or obfuscate hand-written source for token savings.** Minification belongs in the build pipeline; source code should remain reviewable.
- Do not shorten names to single letters, remove whitespace indiscriminately, compress multiple statements onto one line, or replace clear branches with clever expressions to save tokens.
- Do not use opaque regexes, positional arrays, magic numbers, clever bitwise tricks, or deeply nested ternaries when an explicit implementation is easier to understand.
- Prefer fewer meaningful lines over fewer physical lines. A short helper with a clear name can save more future debugging time than a compact one-liner.
- Abstract duplication only when the abstraction is easier to understand than the duplicated code. Two small, distinct pieces of UI may be better left separate.
- Optimize bundle size through tree-shaking, code splitting, proper dependency selection, compression, caching, and removing unused code—not by making source unreadable.

### D. Example: concise but clear

Avoid repeating the same rule in multiple places:

```ts
// Repeated condition: easy for copies to drift apart.
if (user.role === "admin" || user.role === "owner") { /* ... */ }
if (user.role === "admin" || user.role === "owner") { /* ... */ }
```

If the rule is a real shared concept, give it one name:

```ts
const canManageWorkspace = (role: UserRole) =>
  role === "admin" || role === "owner";

if (canManageWorkspace(user.role)) {
  // ...
}
```

Do not build a generic permission framework for only one trivial check. The goal is to remove drift and clarify meaning, not to maximize abstraction.

## 12. Dependencies and framework choices

- Use the framework and package manager already present unless the task explicitly calls for a migration.
- Check whether a dependency already solves the problem before adding another. Prefer actively maintained, appropriately sized packages with clear licensing and security posture.
- Avoid loading a large library for a tiny task the platform can handle safely.
- Keep server-only code, secrets, and privileged operations out of client components and browser bundles.
- Follow official framework guidance for data fetching, caching, routing, metadata, rendering, and server/client boundaries. These details change between framework versions; verify the version in the repository before relying on current docs.
- Never change framework, lockfile, build system, or deployment settings casually. Such changes need a clear reason and corresponding validation.

## 13. Content and product quality

- Write interface text that is specific and helpful. Prefer “Save changes” over vague labels such as “Submit” when the action is known.
- Design for slow networks, failed requests, empty results, and users who refresh or revisit a page.
- Prevent destructive actions from happening accidentally. Explain consequences and offer undo/confirmation when appropriate.
- Do not add fake testimonials, fabricated metrics, misleading UI, hidden subscriptions, deceptive consent, or dark patterns.
- For user-generated content, safely render text and define moderation, reporting, and deletion behavior appropriate to the product.
- Respect user preferences, privacy choices, reduced motion, and browser settings.

## 14. Definition of done

A change is ready when the following applicable checks are true:

- [ ] It solves the requested problem without unrelated scope.
- [ ] The code matches local conventions and is understandable without needing the author present.
- [ ] Inputs, types, permissions, and errors are handled appropriately.
- [ ] The UI is semantic, keyboard-friendly, responsive, and readable.
- [ ] Performance costs are reasonable; optimization claims are supported by measurement where needed.
- [ ] Important public pages remain crawlable and have correct metadata/status behavior where SEO applies.
- [ ] Security and privacy implications were considered.
- [ ] Relevant automated checks were run, or omitted checks are called out clearly.
- [ ] The diff contains no accidental secrets, debug code, dead code, or unrelated churn.
- [ ] The completion message is concise and truthful.

## 15. Primary references

Use official documentation first. Verify version-specific recommendations before applying them.

- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Google image SEO best practices](https://developers.google.com/search/docs/appearance/google-images)
- [Google guidance for lazy-loaded content](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading)
- [W3C WCAG 2.2](https://www.w3.org/TR/wcag/)
- [MDN web performance best practices](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/Best_practices)
- [web.dev Core Web Vitals](https://web.dev/explore/learn-core-web-vitals)
- [web.dev JavaScript code splitting](https://web.dev/learn/performance/code-split-javascript)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Cross-Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)

---

**Final principle:** Write code for the next person who must understand it—including the future version of you. Make it simple, safe, measurable, and readable first; make it smaller only when the simplification remains clear.
