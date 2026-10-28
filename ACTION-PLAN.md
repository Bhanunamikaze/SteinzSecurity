# SEO action plan — Steinz Security

**Date:** 2026-10-28. Based on [FULL-AUDIT-REPORT.md](FULL-AUDIT-REPORT.md). Preserve the restored Steiner design and its interactive controls in every change.

| Priority | Work | Status and acceptance check |
|---|---|---|
| P0 | Verify the GitHub Pages build for commit `59c2772`, then compare the public Steiner panel and assistant controls with the original design on desktop and mobile. | Complete: Pages build succeeded; live panel is dark, comparison text legible, and the assistant selector works. The later JWT wrap was checked locally and awaits its build. |
| P1 | Stop Cloudflare Email Obfuscation from rewriting `mailto:` links. | Confirmed live issue before restoration. Use an `email_off` marker or Cloudflare setting; public HTML must contain `mailto:` and no `/cdn-cgi/l/email-protection` links. |
| P1 | Add raw title, unique description, canonical, OG and Twitter metadata to Steiner's real `<head>` while keeping the original runtime and styles. | Currently incomplete. Compare screenshots and click behavior before release. |
| P1 | Make Steiner's primary content accessible when `unpkg.com` fails. | Controlled failure confirmed. A tested fallback must preserve the current visual design; avoid replacing the interactive page with an unchecked static DOM snapshot. |
| P2 | Redirect old DAST URLs with HTTP 301/308 using the edge provider if inbound links matter. | Both `Steinzdast.html` and `steinzdast.html` were removed by explicit request. They will 404 after deployment unless redirected at Cloudflare. |
| P2 | Provide evidence for benchmark and outcome claims; label all sample dashboard counts. | Publish corpus size/date/method or qualify/remove absolutes; do not present illustrative data as customer results. |
| P2 | Inspect Search Console and measure mobile LCP, INP and CLS. | Unknown. The PageSpeed API was rate limited; record field values when available. |

Completed: GitHub Pages reactivated by pushing `main`; the custom domain and HTTPS respond; apex redirects to `www`; canonicals, sitemap and robots URLs were aligned to `www`; missing OG and touch icon files were added; home and Purple snippets were shortened. Numeric SEO scoring is deferred until indexing and performance data are available.
