# CLAUDE.md

Personal academic homepage of Eric Tillmann Bill, built on AEM Edge Delivery Services (EDS). Code lives in this repo; page content is authored in da.live (`https://da.live/#/ericbill21/webpage`). See @AGENTS.md for EDS conventions.

## Commands

```bash
npx -y @adobe/aem-cli up                  # local code + content from aem.page preview
npx -y @adobe/aem-cli up --html-folder drafts   # also serve local drafts/*.html test pages
npm run lint                              # ESLint + Stylelint (runs in CI)
```

`drafts/` is git-ignored. Draft pages need `head.html` pasted into `<head>`, and fragments (`nav`, `footer`) need a `*.plain.html` copy.

## Design system

`styles/styles.css` defines all tokens: warm paper palette (`--paper`, `--ink`, `--ink-2/3`, `--rule`, `--accent`), `--font-sans` (Inter) and `--font-mono` (JetBrains Mono), a 680px `--measure` column. Fonts are self-hosted in `fonts/`. `.chip` is the shared mono pill used for link badges. `h2` renders as a mono uppercase section label with a hairline.

## Blocks (authored as tables in da.live)

| Block | Table content |
|---|---|
| `header` / `footer` | Loaded from the `nav` / `footer` docs. `nav`: first link = brand, list items = nav links |
| `profile` | One row: photo \| name heading, role line(s), links (email/GitHub/Scholar get icons by URL) |
| `news` | One row per item: date \| text |
| `publications` | Header only; full list grouped by year |
| `selected-publications` | Header only; entries with `selected: true` |
| `carousel` | One row per photo: image (set alt text) \| caption |

## Publications

`publications.json` is the single source of truth, rendered by `scripts/pubs.js` (shared by both publication blocks). Entry fields: `title`, `authors`, `venue`, `details` (shown as a tag, e.g. "Oral"), `year`, `selected`, optional `teaser` (image path, e.g. `/images/teasers/focus.jpg`; falls back to a tile with the title prefix and year), and `links` with optional `doi` (Paper), `preprint` (arXiv), `pdf` (OpenReview or PDF), `webpage` (Project), `code`, `dataset`, `presentation` (Talk), `ads`, `bibtex` (opens a copyable dialog). `Eric Tillmann Bill` is bolded in author lists.
