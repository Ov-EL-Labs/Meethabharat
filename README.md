# meetha bharat

Static website concept for a premium Indian sweets and savoury snacks brand in Hubballi, Karnataka.

The site presents handcrafted mithai, crunches, ladoos, namkeens, gifting ideas, and store information through a responsive multi-page experience. The checkout is a browser-only demonstration created by Ov.EL Labs. It does not process payments, create real orders, or represent the official Meetha Bharat website.

## Features

- Responsive static pages for the home page, sweets, crunches, ladoos, namkeens, about, and contact content.
- Product cards with a client-side shopping cart backed by cookies and local storage.
- Demonstration checkout with GST calculation, order confirmation animation, and a Web Audio success chime.
- Custom brand favicon and reusable SVG icon sprite.
- Direct use of the supplied nuts, ghee, sparkle, and location artwork.
- Custom SVG gift icon for bespoke gifting content.
- SEO metadata, canonical URLs, Open Graph metadata, JSON-LD, sitemap, and robots directives.
- Optimized raster assets with reduced file sizes while preserving transparent PNG artwork.
- No emoji characters in the website source.

## Pages

| Page | File |
| --- | --- |
| Home | [`index.html`](./index.html) |
| Sweets | [`sweets.html`](./sweets.html) |
| Crunches | [`crunches.html`](./crunches.html) |
| Ladoos | [`ladoos.html`](./ladoos.html) |
| Namkeens | [`namkeens.html`](./namkeens.html) |
| Bites and crunch | [`bites-and-crunch.html`](./bites-and-crunch.html) |
| About | [`about.html`](./about.html) |
| Contact | [`contact.html`](./contact.html) |

`about us.html` and `contact-us.html` are redirect or fallback pages retained for compatibility.

## Tech stack

- Semantic HTML
- CSS custom properties, responsive grid and flexbox layouts
- Vanilla JavaScript
- SVG and PNG icon assets
- JPEG and PNG product and cultural imagery
- No package manager or framework is required

## Run locally

Serve the repository over HTTP so relative asset paths and browser APIs behave like a deployed site:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000/> in a browser.

Opening the HTML files directly also renders the pages, but an HTTP server is the recommended local workflow.

## Project structure

```text
.
├── assets/
│   ├── css/main.css
│   ├── icons/
│   └── js/site.js
├── instructions/
├── scripts/seo_check.py
├── index.html
├── sweets.html
├── crunches.html
├── ladoos.html
├── namkeens.html
├── bites-and-crunch.html
├── about.html
├── contact.html
├── robots.txt
└── sitemap.xml
```

## Validation

Run the repository's SEO and accessibility smoke check from the project root:

```bash
python3 scripts/seo_check.py
```

The check covers document structure, language metadata, titles, descriptions, canonical URLs, Open Graph tags, JSON-LD, heading uniqueness, image dimensions and alternative text, asset references, internal links, `robots.txt`, and `sitemap.xml`.

## Project notes

- The checkout flow is intentionally illustrative and must not be presented as a live commerce integration.
- The floating project disclaimer can be dismissed from the lower-left corner and its state is stored locally in the browser.
- Image loading behavior is intentionally configured in the page markup; keep the hero image prioritized when changing performance settings.
- Keep assets referenced by the HTML in their current relative locations unless all consuming references are updated together.
