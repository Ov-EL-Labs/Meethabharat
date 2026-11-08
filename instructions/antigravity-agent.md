# Google Antigravity Agent Instructions (`ANTIGRAVITY.md` / `AGENTS.md`)

> **Target Agent:** Google Antigravity (Multi-Agent Mission Control, CLI, & Browser Verification Agent)  
> **Use Case:** Autonomous parallel task orchestration, full-stack feature implementation, and live browser visual verification.

## 1. Mission Control & Subagent Orchestration
When running in **Google Antigravity**, decompose complex web agency deliverables into specialized subagent tracks rather than executing a monolithic change:
- **Architect / UI Track (`./skills/design.md`):** Scaffolds semantic markup, responsive grid structures, design tokens, and all five UI states (default, hover, loading, empty, error).
- **Copy & Conversion Track (`./skills/product-copywriting.md`):** Crafts value-driven headlines, high-intent CTAs, trust micro-copy, and helpful validation messages.
- **Motion & Polish Track (`./skills/animations.md`):** Layers 60fps GPU-accelerated animations, shared layout transitions, and `@media (prefers-reduced-motion: reduce)` fallbacks.

## 2. Autonomous Execution & Sandbox Rules
- **Plan Artifact First:** Before modifying more than 3 files, output a concise implementation plan listing target files, component hierarchy, and state flow.
- **Safe Terminal Commands:** Execute package installations, typechecks (`tsc --noEmit`), and test suites inside the sandboxed terminal. Do not run destructive git commands (`git reset --hard`, `git push --force`) without explicit human approval.
- **Dependency Hygiene:** Prefer native Web APIs and existing workspace packages before installing new npm dependencies.

## 3. Browser Agent Visual & UX Verification
Before marking any frontend task complete, launch the **Antigravity Browser Agent** against the local dev server and verify:
1. **Responsive Viewports:** Inspect the rendered route at Desktop (`1440x900`), Tablet (`768x1024`), and Mobile (`375x812`). Confirm zero horizontal overflow (`overflow-x`).
2. **Interactive & Motion Check:** Trigger primary CTAs, modals, and form validations in the live DOM. Verify smooth animations and zero layout shift (`CLS = 0`).
3. **Console & Network Cleanliness:** Confirm zero uncaught runtime errors, zero React hydration mismatches, and zero failed asset requests (`404`/`500`) in the browser console.
