#!/usr/bin/env python3
"""meetha bharat° — SEO Smoke Test Script (SEOSKILL.md Section 13)
Verifies: DOCTYPE, lang, title, description, canonical, OG metadata,
JSON-LD structured data, H1 uniqueness, image alt text & dimensions,
and crawlable links.

Usage: python3 scripts/seo_check.py
"""

import os
import re
import sys

PAGES = ['index.html', 'sweets.html', 'bites-and-crunch.html', 'crunches.html', 'ladoos.html', 'namkeens.html', 'about.html']

def check_page(path):
    issues = []
    if not os.path.exists(path):
        return [f"File {path} does not exist"]

    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    # DOCTYPE
    if not html.strip().startswith('<!doctype html>'):
        issues.append("Missing <!doctype html>")

    # html lang
    if 'lang="en"' not in html:
        issues.append("Missing lang=\"en\" on <html>")

    # Title
    title_m = re.search(r'<title>(.*?)</title>', html, re.I)
    if not title_m or len(title_m.group(1).strip()) < 10:
        issues.append("Missing or too short <title>")
    elif any(p in title_m.group(1).lower() for p in ['untitled', 'document', 'lorem']):
        issues.append("Placeholder detected in <title>")

    # Meta Description
    desc_m = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.I)
    if not desc_m or len(desc_m.group(1).strip()) < 20:
        issues.append("Missing or short meta description")

    # Canonical
    canon_m = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']', html, re.I)
    if not canon_m or not canon_m.group(1).startswith('https://'):
        issues.append("Missing or non-absolute https canonical URL")
    elif 'localhost' in canon_m.group(1):
        issues.append("Localhost found in canonical URL")

    # Open Graph
    for og in ['og:title', 'og:description', 'og:url', 'og:image']:
        if f'property="{og}"' not in html:
            issues.append(f"Missing {og} tag")

    # JSON-LD Schema
    if 'application/ld+json' not in html:
        issues.append("Missing JSON-LD structured data")

    # H1 check
    h1s = re.findall(r'<h1[^>]*>.*?</h1>', html, re.I | re.DOTALL)
    if len(h1s) != 1:
        issues.append(f"Expected exactly 1 <h1>, found {len(h1s)}")

    # Images
    imgs = re.findall(r'<img\s+([^>]+)>', html, re.I)
    for img in imgs:
        if 'alt=' not in img:
            issues.append(f"Image missing alt attribute: {img[:60]}...")
        if 'width=' not in img and 'banner-bg-img' not in img:
            issues.append(f"Image missing width attribute: {img[:60]}...")
        if 'height=' not in img and 'banner-bg-img' not in img:
            issues.append(f"Image missing height attribute: {img[:60]}...")

    # Assets referenced
    srcs = re.findall(r'src=["\'](assets/[^"\'?#]+)["\']', html)
    for src in srcs:
        if not os.path.exists(src):
            issues.append(f"Broken asset reference: {src}")

    # Internal page links
    hrefs = re.findall(r'href=["\']([^"\'#:]+\.html)["\']', html)
    for href in hrefs:
        if href.startswith(('http://', 'https://')):
            continue
        if not os.path.exists(href):
            issues.append(f"Broken internal link: {href}")

    return issues

def main():
    print("=" * 60)
    print("meetha bharat° — SEO & Accessibility Smoke Test")
    print("=" * 60)

    total_issues = 0
    for page in PAGES:
        issues = check_page(page)
        if issues:
            print(f"❌ {page}: {len(issues)} issue(s)")
            for iss in issues:
                print(f"   - {iss}")
            total_issues += len(issues)
        else:
            print(f"✅ {page}: Clean (Passed all checks)")

    # Robots.txt
    if os.path.exists('robots.txt') and 'Sitemap:' in open('robots.txt').read():
        print("✅ robots.txt: Found with valid Sitemap directive")
    else:
        print("❌ robots.txt: Missing or invalid")
        total_issues += 1

    # Sitemap.xml
    if os.path.exists('sitemap.xml') and '<urlset' in open('sitemap.xml').read():
        print("✅ sitemap.xml: Found and well-formed")
    else:
        print("❌ sitemap.xml: Missing or invalid")
        total_issues += 1

    print("=" * 60)
    if total_issues == 0:
        print("🎉 ALL TESTS PASSED! Project is production ready.")
        sys.exit(0)
    else:
        print(f"⚠️ Found {total_issues} issue(s).")
        sys.exit(1)

if __name__ == '__main__':
    main()
