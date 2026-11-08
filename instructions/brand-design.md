# meetha bharat° — Brand Identity, UI & Motion System (design.md)

## 1. Brand DNA & Core Visual Language
- **Wordmark Architecture**: Stacked two-line lowercase wordmark (`meetha` on row 1, `bharat` on row 2) with a signature hollow degree circle (`°`) positioned at the top-right terminal of `meetha`.
- **Geometric Character**: Friendly, rounded monolinear terminals with zero sharp corners. Every interactive component (buttons, inputs, nav pills, hamburger bars) echoes this rounded geometry.
- **Signature Motif**: The hollow circle (`°`) acts as an interactive brand accent—used for loading orbits, click ripples, button badges, and menu animations.

---

## 2. Color Palette & Gradient Tokens
| Token Name          | Hex Value | Usage                                                     |
| ------------------- | --------- | --------------------------------------------------------- |
| `--brand-pink`      | `#FF057C` | Primary gradient start (left side of wordmark, 'm', 'b')  |
| `--brand-magenta`   | `#F20866` | Midpoint transition stop (42% - 50%)                      |
| `--brand-crimson`   | `#EE1C25` | Primary gradient end (right side of wordmark, 'a', 't', °)|
| `--surface-white`   | `#FFFFFF` | Primary clean canvas background                           |
| `--surface-blush`   | `#FFF7FA` | Warm celebratory secondary background                     |
| `--surface-dark`    | `#12090D` | Deep plum-charcoal dark mode surface                      |

### Primary Brand Gradient CSS
```css
:root {
  --mb-gradient: linear-gradient(105deg, #FF057C 0%, #F20866 48%, #EE1C25 100%);
  --mb-shadow: 0 10px 24px -6px rgba(242, 8, 102, 0.40);
}
```

---

## 3. Typography
- **Brand Display / Wordmark Font**: `Fredoka` (Weight 500/600) or `Quicksand` — matches the rounded stroke terminals and generous lowercase x-height of the logo.
- **UI & Body Font**: `Inter` (Weights 400, 500, 600) for clean readability across navigation, product cards, and checkout flows.
- **Monospace / Specs**: `JetBrains Mono`.

---

## 4. Motion & Animation Guidelines
1. **Looping Preloader (Cursive `mb` Ribbon)**:
   - Single continuous SVG path drawing a lowercase cursive `mb` with `stroke-linecap: round`.
   - Duration: `2.4s` infinite loop using `cubic-bezier(0.65, 0, 0.35, 1)`.
   - The hollow ring (`°`) scales in elastically at `45%` completion.
2. **Landing Page Logo Reveal**:
   - Staggered character pop (`60ms` delay per glyph) using spring physics `cubic-bezier(0.34, 1.56, 0.64, 1)`.
3. **Navigation & Hamburger Toggles**:
   - Links feature a `2.5px` rounded gradient underline that sweeps from left to right on hover.
   - Hamburger bars use `stroke-linecap: round` and morph smoothly in `380ms`.
4. **Buttons & Micro-Interactions**:
   - All buttons use `border-radius: 9999px` (full pill).
   - Click feedback spawns an expanding hollow circle (`°`) ripple in `#FF057C → #EE1C25`.