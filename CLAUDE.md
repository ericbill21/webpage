# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Serve locally with live reload
hugo server

# Build static site to public/
hugo

# Include draft content while developing
hugo server -D
```

The `public/` directory is the built output — edit source files, not `public/`.

## Architecture

Personal academic website for Eric Tillmann Bill, built with [Hugo](https://gohugo.io/) using the **barks** theme (git submodule at `themes/barks`).

### Publications system

`data/publications.yaml` is the single source of truth for all publications. Each entry has: `title`, `authors`, `venue`, `details`, `year`, `selected` (bool), and `links` (object with optional keys: `preprint`, `pdf`, `bibtex`, `code`, `webpage`, `doi`, `ads`, `dataset`, `presentation`).

Two shortcodes render from this data:
- `{{< publications >}}` — all entries, grouped by year descending
- `{{< selected_publications >}}` — only `selected: true` entries, sorted by year desc

The author name `Eric Tillmann Bill` is automatically bolded. The `pdf` link key renders as "OpenReview" in the UI (not "PDF"). BibTeX strings render in a modal with copy-to-clipboard.

### Carousel shortcode

```
{{< carousel
    images="images/a.jpeg,images/b.jpeg"
    alts="Alt 1|Alt 2"
    captions="Caption 1|Caption 2"
    autoplay="5000"
>}}
```

`images` is comma-separated; `alts` and `captions` are pipe-separated. Images are served from `static/images/`.

### Custom assets

- `layouts/shortcodes/` — carousel, publications, selected_publications shortcodes
- `static/css/publications.css` — styles for publication cards and badges
