# Steinz Security SEO audit

**Date:** 2026-10-28  
**Scope:** Full site: homepage, Steiner, SteinzPurple, robots, sitemap, social assets, legacy URLs, and public GitHub Pages delivery. The restored interactive design is at commit `59c2772`; the later scrollbar and legacy-file removal are pending publication.

## A. Audit summary

The site was republished at <https://www.steinzsecurity.com/>. The earlier 404 ended when GitHub Pages deployed commit `9c90358`. The apex host redirects to `www` in one 301 hop. The homepage, both product pages, sitemap, and social image returned HTTP 200 after publication. Commit `59c2772` restored the original Steiner runtime, dark panels, and working assistant controls; this was verified in the live browser.

**Rating: insufficient data for a reliable numeric score.** Search Console indexing and field Core Web Vitals are unavailable; the PageSpeed API rate limited the mobile check. Three confirmed technical issues remain: Steiner's external JavaScript dependency, Cloudflare's rewriting of email links, and legacy page URLs that use HTML redirects.

| Area | Severity | Confidence | Finding | Evidence | Impact and fix |
|---|---|---|---|---|---|
| Hosting and canonical host | Pass | Confirmed | GitHub Pages serves the custom domain; apex redirects to `www`. | Public checks returned 200 for `/`, `/products/steiner/`, `/products/steinzpurple/`, `/sitemap.xml`, and `/assets/og-image.png`; redirect checker saw one 301 from apex. | Keep sitemap, robots, JSON-LD, OG and canonical URLs on `www`. |
| Steiner rendering | Critical | Confirmed locally | Original interactive page depends on React and ReactDOM loaded from `unpkg.com`; its template is hidden before those scripts load. | `assets/support.js` calls `hideRawTemplate()` before `loadReactUmd()`. In the prior controlled blocked-CDN test, Steiner had no visible body text. | A CDN outage or blocked script can blank the product page. A future fix needs a tested static fallback that preserves the existing design and controls. |
| Steiner head metadata | Warning | Confirmed | Its title and stylesheet are in a body `<helmet>` interpreted by the runtime; the raw `<head>` lacks a description and canonical. | `products/steiner/index.html` starts with charset, viewport and support script, then closes `</head>`. | Search parsers and social crawlers may see incomplete metadata before rendering. Move metadata into the real head without changing the layout. |
| Email links | Warning | Confirmed before final restoration | Cloudflare rewrote `mailto:` links into `/cdn-cgi/l/email-protection#…` URLs; the live broken-link script found two 404 links on the homepage. | Public HTML and broken-link output, 2026-10-28. Local source links are valid `mailto:` links. | Disable Cloudflare Email Obfuscation for these links or the site, then verify public raw HTML and clicks. This is a CDN rewrite, not a missing page. |
| Legacy product URLs | Warning | Confirmed | `/Steinzdast.html` returned 200 with an HTML refresh before the user requested deletion of both DAST alias files. | Public redirect checker returned 200, zero hops before deletion. The next deploy removes both files. | Old links will become 404 unless an edge redirect is configured; the two files were removed by explicit request. |
| Product claims and examples | Warning | Confirmed in source | Some absolute claims and sample dashboard figures have no linked public method, corpus size/date or example proof. | Existing Steiner copy says “No false positives”; screenshots and panels show sample counts. Home and Purple now label some examples as illustrative, but coverage is incomplete. | Qualify claims or publish verifiable methodology and label all demo metrics. Do not invent proof. |
| Social assets | Pass | Confirmed | 1200×630 OG image and 512×512 icon now exist. | Public OG image returned 200; local file signatures and dimensions match the metadata. | Review a real social preview after caches refresh. |
| On-page metadata | Mixed | Confirmed | Home and Purple have unique titles, descriptions, self canonicals, and one H1; Steiner's real head remains incomplete. | Bundled HTML parser on public HTML: home 1,000 words, Purple 1,090, Steiner 2,081 after JS rendering. | Repair Steiner head when implementing a design-preserving fallback. |
| Schema | Pass with eligibility caveat | Confirmed | Home Organization/WebSite graph and both product SoftwareApplication descriptions parse. | Product schema validator returned no warnings. The bundled home validator flags graph root lacking `@type`, although its child nodes are typed. | Do not add fake reviews or prices; software rich results require truthful, publicly visible eligibility fields. |
| Internal links | Pass | Confirmed locally | Three primary pages link to one another, with no local broken links. | Bundled crawler found three primary pages; local broken-link check returned zero broken. | Recheck after Cloudflare email obfuscation is addressed. |
| Performance | Unknown | Hypothesis | Field LCP, INP, CLS and production Lighthouse results are unavailable. | PageSpeed Insights API returned a rate limit error. | Measure with Search Console/CrUX or a later PageSpeed run; do not infer a failing metric. |

## B. Prioritized action plan

1. Keep the restored interactive Steiner design stable. Test any future metadata or fallback change against the comparison panel, assistant controls, desktop and mobile screenshots before publication. The JWT example now wraps its long token and has no horizontal scrollbar in local desktop/mobile checks.
2. Correct Cloudflare email rewriting and verify public mail links.
3. Add permanent edge redirects for legacy product URLs.
4. Publish benchmark methods and label remaining illustrative metrics; expand concise product definitions and evidence-backed buyer answers.
5. Measure field Core Web Vitals and inspect all three canonical URLs in Search Console after indexing.

## C. Unknowns and follow-ups

- **Indexing and traffic:** No Search Console access or query/impression data was available. An HTTP 200 and `index, follow` do not prove indexing.
- **Core Web Vitals:** Mobile PageSpeed API rate limited the request; no LCP, INP or CLS value is claimed.
- **Cloudflare policy:** Its live `robots.txt` adds AI crawler rules beyond the repository file. General crawling remains allowed. This is a policy choice, not an indexing defect.
- **Reference freshness:** The SEO skill's schema, CWV and Google reference files were last marked 2026-02-07, more than 90 days old; time-sensitive guidance should be rechecked before implementing changes based solely on them.

## Method and limitations

Read the SEO skill and audit rubric; inspected git diff, raw source and rendered pages; ran the bundled fetch, HTML parse, robots, social-meta, redirect, broken-link, internal-link, schema and PageSpeed scripts; checked local desktop/mobile rendering and click behavior with Playwright. The first batch of Python live checks hit transient DNS failures and succeeded on a single retry. The PageSpeed API rate limit remained an environment limitation. The web reader returned cached prepublication content, so direct public HTTP and fetched HTML supplied the live evidence.
