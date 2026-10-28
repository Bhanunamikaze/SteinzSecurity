#!/usr/bin/env python3
"""Embed the shared CSS without changing its rules.

Run after editing assets/style.css; use --check to detect stale HTML copies.
The site is small enough to deliver these styles in the initial HTML response,
so the first paint does not wait for a separate stylesheet request.
"""

import argparse
import hashlib
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
PAGES = ("index.html", "products/steiner/index.html", "products/steinzpurple/index.html")
BLOCK = re.compile(r"<!-- shared-styles:start -->.*?<!-- shared-styles:end -->", re.S)
LINK = re.compile(r'<link rel="stylesheet" href="(?:../../)?assets/style\.css[^" ]*">')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    source = (ROOT / "assets/style.css").read_text()
    # Remove comments and indentation only. Preserve declarations, selector
    # whitespace, quoted strings and calc() operators exactly.
    css = "\n".join(line.strip() for line in re.sub(r"/\*.*?\*/", "", source, flags=re.S).splitlines() if line.strip())
    digest = hashlib.sha256(source.encode()).hexdigest()[:12]
    block = f'<!-- shared-styles:start -->\n<style data-shared-styles="{digest}">\n{css}\n</style>\n<!-- shared-styles:end -->'
    stale = []
    for name in PAGES:
        path = ROOT / name
        original = path.read_text()
        pattern = BLOCK if BLOCK.search(original) else LINK
        updated, count = pattern.subn(lambda _: block, original)
        if count != 1:
            raise SystemExit(f"Expected one shared stylesheet in {name}; found {count}")
        if updated != original:
            stale.append(name)
            if not args.check:
                path.write_text(updated)
    if args.check and stale:
        raise SystemExit("Run python3 tools/inline_styles.py to update: " + ", ".join(stale))
    print("Shared styles synchronized" + (": " + ", ".join(stale) if stale else " (no changes)"))


if __name__ == "__main__":
    main()
